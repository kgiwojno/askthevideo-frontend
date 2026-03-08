import { useState, useCallback, useRef, useEffect } from "react";

// ── Voice Input (Speech Recognition) ──

const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export const speechRecognitionSupported = !!SpeechRecognition;

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return { isListening, startListening, stopListening };
}

// ── Voice Output (Speech Synthesis) ──

export const speechSynthesisSupported =
  typeof window !== "undefined" && "speechSynthesis" in window;

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const speak = useCallback((text: string, id: string) => {
    if (!speechSynthesisSupported) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const clean = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/^#+\s/gm, "")
      .replace(/^[-*]\s/gm, "")
      .replace(/\n/g, ". ");

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(null);
  }, []);

  return { isSpeaking, speak, stop };
}
