import { useAppContext } from "@/context/appContext";
import { useSpeech } from "@/hooks/useSpeech";
import log from "@/lib/log";
import { sendBlobToApi } from "@/lib/sendBlobToAPI";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiMicrophone } from "react-icons/hi2";
import Timer from "./timer";

const AudioCapture: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [runTheAPIs, setRunTheAPIs] = useState(true);
  const speak = useSpeech();

  // TODO: Store each question and answer, and use the message thread with history
  // https://github.com/hwchase17/langchainjs/blob/6b77cbe861addc47da69cb6e25cde7f4d35fd5bb/langchain/src/chains/llm_chain.ts#L43
  const { dispatch } = useAppContext();

  useEffect(() => {
    const receivedText = ({ ai, user }: { ai: string; user: string }) => {
      setWaitingForResponse(false);
      speak({ text: ai });
      dispatch({ type: "saveMessages", message: { ai, user } });
    };

    if (chunks.length > 0) {
      if (runTheAPIs) {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setWaitingForResponse(true);
        sendBlobToApi(blob, "/api/talk", receivedText);
        log("sent blob");
      }
      setChunks([]);
    }
  }, [chunks, runTheAPIs, speak, dispatch]);

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
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
      log("Stopped mediaRecorder");
    }
  };

  return (
    <Stack
      alignItems={"center"}
      justifyContent="center"
      direction={"row"}
      spacing={8}
    >
      <Button
        w={20}
        h={20}
        fontSize="4xl"
        aria-label="Toggle audio recording"
        onClick={toggleRecording}
        colorScheme={recording ? "red" : "gray"}
        outline="6px solid"
        outlineColor={"transparent"}
        className={recording ? "animate-outline" : ""}
        transition={"all 100ms"}
        color={recording ? "red.500" : "inherit"}
        disabled={waitingForResponse}
        opacity={waitingForResponse ? 0.6 : 1}
        boxShadow="lg"
        isLoading={waitingForResponse}
      >
        <HiMicrophone />
      </Button>
      <Box>
        <Timer counting={recording} stopTimer={stopRecording} />
      </Box>
      <Box>
        <Checkbox
          checked={runTheAPIs}
          onChange={(e) => setRunTheAPIs(e.target.checked)}
          hidden={process.env.NODE_ENV === "production"}
          defaultChecked
        >
          Run the APIs?
        </Checkbox>
      </Box>
    </Stack>
  );
};

export default AudioCapture;
