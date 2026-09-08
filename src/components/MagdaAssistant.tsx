import React, { useState, useRef, useEffect } from "react";
import "./magda-assistant.css";

type Message = { role: "user" | "assistant"; content: string };

export function MagdaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola. Soy el asistente virtual de Magda Gutiérrez. Puedo orientarte sobre Pricing, HEOR, Market Access y sus servicios. ¿En qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          history: messages,
        }),
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Perdona, hubo un error. Intenta de nuevo.",
          },
        ]);
        return;
      }

      const data = (await response.json()) as { message: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "No puedo conectar en este momento. Intenta después.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="magda-chat-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with Magda"
          title="Chat with Magda"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="magda-chat-panel" role="dialog" aria-labelledby="magda-chat-title">
          <div className="magda-chat-header">
            <h2 id="magda-chat-title">Magda Assistant</h2>
            <button
              className="magda-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="magda-chat-messages" role="log">
            {messages.map((msg, idx) => (
              <div key={idx} className={`magda-message magda-message-${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="magda-avatar" aria-label="Magda">
                    M
                  </div>
                )}
                <div className="magda-message-text">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="magda-message magda-message-assistant">
                <div className="magda-avatar">M</div>
                <div className="magda-message-text magda-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="magda-chat-input-area">
            <textarea
              className="magda-chat-input"
              placeholder="Pregunta algo sobre pricing, HEOR..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={2}
              aria-label="Message input"
            />
            <button
              className="magda-chat-send"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
