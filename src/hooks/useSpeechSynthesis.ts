import { useState, useCallback, useEffect } from "react";

interface SpeechSynthesisProps {
  text: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  voiceIndex?: number;
  onEnd?: () => void;
}

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      const getVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
    }
  }, []);

  const speak = useCallback(
    ({ text, pitch = 1, rate = 1, volume = 1, voiceIndex = 0, onEnd }: SpeechSynthesisProps) => {
      if (!supported) return;

      setSpeaking(true);
      // Cancel previous utterance
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      
      if (voices.length > 0 && voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
      }

      utterance.onend = () => {
        setSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
          setSpeaking(false);
      }

      window.speechSynthesis.speak(utterance);
    },
    [supported, voices]
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  }, [supported]);

  return {
    supported,
    speak,
    cancel,
    speaking,
    voices,
  };
};