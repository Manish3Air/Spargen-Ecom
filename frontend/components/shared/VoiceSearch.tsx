"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

const VoiceSearch = ({ onSearch, children }: Props) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const RecognitionClass =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!RecognitionClass) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new RecognitionClass();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onSearch]);

  const handleClick = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setListening((prev) => !prev);
  };

  return (
  <button
    onClick={handleClick}
    className={`p-2 rounded-full transition shadow-neumorphic ${
      listening ? "bg-blue-500 text-white animate-pulse" : "bg-white dark:bg-gray-900"
    }`}
    aria-label="Voice search"
  >
    {children ? (
      children
    ) : listening ? (
      <MicOff className="w-5 h-5" />
    ) : (
      <Mic className="w-5 h-5 text-white" />
    )}
  </button>
);
};

export default VoiceSearch;
