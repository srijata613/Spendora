"use client";

import { useState } from "react";
import { askFinanceAI } from "@/actions/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AIAssistant() {

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {
    if (!question) return;

    const res = await askFinanceAI(question);
    setAnswer(res);
  };

  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center text-lg
        hover:scale-110 hover:shadow-2xl transition-all duration-300
        animate-pulse"
      >
        AI
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white border rounded-xl shadow-xl p-4 space-y-3">

          <div className="font-semibold">
            Spendora AI
          </div>

          <Input
            placeholder="Ask about your finances..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="flex gap-2">

            <Button onClick={ask}>
              Ask
            </Button>

            <Button variant="outline" onClick={startVoiceInput}>
              🎤
            </Button>

          </div>

          {answer && (
            <p className="text-sm text-muted-foreground">
              {answer}
            </p>
          )}

        </div>
      )}
    </>
  );
}