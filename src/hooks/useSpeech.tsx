import { useEffect, useState } from "react";

export const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechUtterance, setspeechUtterance] =
    useState<null | SpeechSynthesisUtterance>(null);

  useEffect(() => {
    // load voices
    const realVoices = window.speechSynthesis.getVoices();
    setVoices(realVoices);
    setspeechUtterance(new SpeechSynthesisUtterance());
  }, []);

  const speak = ({ text }: { text: string }) => {
    if ("speechSynthesis" in window && speechUtterance != null) {
      // Set the text to be spoken
      speechUtterance.text = text;
      speechUtterance.voice = voices[0];
      speechUtterance.rate = 0.85;
      window.speechSynthesis.speak(speechUtterance);
    } else {
      console.error("Speech synthesis is not supported in this browser.");
    }
  };

  return speak;
};
