"use client";

import { useState } from "react";
import { askFinanceAI } from "@/actions/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AIFinanceChat() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {

    if (!question) return;

    const res = await askFinanceAI(question);

    setAnswer(res);
  };

  // 🎤 Voice input
  const startVoiceInput = () => {

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };

    recognition.onerror = () => {
      alert("Voice recognition failed.");
    };
  };

  return (
    <div className="space-y-3">

      <Input
        placeholder="Ask Spendora AI..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex gap-2">

        <Button onClick={ask}>
          Ask
        </Button>

        <Button
          variant="outline"
          onClick={startVoiceInput}
        >
          🎤 Voice
        </Button>

      </div>

      {answer && (
        <p className="text-sm text-muted-foreground">
          {answer}
        </p>
      )}

    </div>
  );
}