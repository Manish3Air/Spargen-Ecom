"use client";
import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
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
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

const VoiceSearch = ({ onSearch }: Props) => {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const RecognitionClass =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!RecognitionClass) return;

    const recognition = new RecognitionClass();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);

    if (listening) recognition.start();

    return () => recognition.abort();
  }, [listening, onSearch]);

  return (
    <button
      onClick={() => setListening(true)}
      className="p-2 rounded-full shadow-neumorphic bg-[#e0e5ec]"
      aria-label="Voice search"
    >
      <Mic className="text-gray-600" />
    </button>
  );
};

export default VoiceSearch;
