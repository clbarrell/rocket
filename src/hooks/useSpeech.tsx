import log from "@/lib/log";
import { useEffect, useState } from "react";

export const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechUtterance, setspeechUtterance] =
    useState<null | SpeechSynthesisUtterance>(null);

  useEffect(() => {
    // load voices
    log("setting event listener");
    const firstGo = window.speechSynthesis.getVoices();
    console.log("first go", firstGo.length);

    window.speechSynthesis.onvoiceschanged = () => {
      log("set voices onChange");
      const realVoices = window.speechSynthesis.getVoices();
      setVoices(realVoices);
    };
  }, []);

  useEffect(() => {
    if (voices.length > 0) {
      const speech = new SpeechSynthesisUtterance();
      speech.lang = "en-US";
      log("voices length", voices.length);
      speech.voice = voices[0];
      speech.rate = 0.85;
      setspeechUtterance(speech);
    }
  }, [voices]);

  const speak = ({ text }: { text: string }) => {
    if ("speechSynthesis" in window && speechUtterance != null) {
      // Set the text to be spoken
      speechUtterance.text = text;
      window.speechSynthesis.speak(speechUtterance);
    } else {
      console.error("Speech synthesis is not supported in this browser.");
    }
  };

  return speak;
};
