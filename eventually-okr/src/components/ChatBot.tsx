import React, { useEffect, useRef, useState } from "react";

interface ChatBotProps {
  apiBase: string;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const ChatBot = ({ apiBase, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hello, how may I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user" as const, content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/chat-bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chats: newMessages,
        })
      });

      if (!response.ok) {
        throw new Error(`Chat request failed (${response.status})`);
      }

      const result = await response.text();

      setMessages(prev => [
        ...prev,
        { role: "ai", content: result }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", content: "Something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="glass-card flex h-full flex-col bg-slate-50/80">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">OKR Assistant</div>
          <div className="text-xs text-slate-500">Ask about objectives and key results</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50/60 to-white/50 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.role === "user"
                  ? "border border-teal-300 bg-teal-600 text-white"
                  : "border border-slate-200 bg-white text-zinc-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-slate-400">Typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-slate-200 bg-white/80 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about your OKRs..."
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-full border border-teal-300 bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
