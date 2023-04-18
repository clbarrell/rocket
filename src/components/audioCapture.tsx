import log from "@/lib/log";
import { sendBlobToApi } from "@/lib/sendBlobToAPI";
import { Box, Button, IconButton, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiMicrophone } from "react-icons/hi2";

const AudioCapture: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [blobSize, setblobSize] = useState(0);

  useEffect(() => {
    const totalChunks = chunks.reduce((pr, cu) => {
      return pr + cu.size;
    }, 0);
    setblobSize(totalChunks);

    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: "audio/webm" });
      sendBlobToApi(blob, "/api/talk");
      setChunks([]);
      log("sent blob");
    }
  }, [chunks]);

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          setChunks((prevChunks) => [...prevChunks, e.data]);
        }
      });
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      log("Stopped mediaRecorder")
    }
  };

  const saveRecording = () => {
    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recording.ogg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setChunks([]);
    }
  };

  return (
    <Stack direction="row">
      <Button
        w={20}
        h={20}
        fontSize="4xl"
        aria-label="Toggle audio recording"
        onClick={toggleRecording}
        colorScheme={recording ? "red" : "gray"}
        outline="5px solid"
        outlineColor={"transparent"}
        className={recording ? "animate-outline" : ""}
        transition={"all 100ms"}
        color={recording ? "red.500" : "inherit"}
      >
        <HiMicrophone />
      </Button>

      <Text>Size: {blobSize}</Text>
      <Text>Blobs: {chunks.length}</Text>
    </Stack>
  );
};

export default AudioCapture;
