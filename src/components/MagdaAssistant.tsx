import React, { useState, useRef, useEffect } from "react";
import "./magda-assistant.css";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_ACTIONS = [
  {
    label: "Conoce sus servicios",
    message: "¿Qué servicios ofrece Magda?",
  },
  {
    label: "Apoyo para lanzamientos",
    message: "¿Cómo puede ayudar Magda en un lanzamiento farmacéutico?",
  },
  {
    label: "Pricing y Market Access",
    message: "¿Cómo trabaja Magda en Pricing y Market Access?",
  },
  {
    label: "¿Cómo contactarla?",
    message: "¿Cómo puedo contactar a Magda?",
  },
];

function normalizeText(text: string): string {
  return text.replace(/\*\*/g, "").replace(/##/g, "").replace(/###/g, "");
}

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

  const handleSend = async (messageText?: string) => {
    const userMessage = (messageText || input).trim();
    if (!userMessage || loading) return;

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
      setMessages((prev) => [...prev, { role: "assistant", content: normalizeText(data.message) }]);
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

  const showQuickActions = messages.length === 1 && messages[0] && messages[0].role === "assistant";

  return (
    <div className="magda-assistant-widget">
      {!isOpen && (
        <button
          className="magda-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with Magda's assistant"
          aria-expanded="false"
        >
          <img src="/magda.jpg" alt="Magda" className="magda-trigger-avatar" />
          <span className="magda-trigger-text">Habla con Magda</span>
          <span className="magda-trigger-icon">✦</span>
        </button>
      )}

      {isOpen && (
        <div className="magda-panel" role="dialog" aria-labelledby="magda-panel-title">
          <div className="magda-panel-header">
            <div className="magda-panel-header-content">
              <img src="/magda.jpg" alt="Magda Gutiérrez" className="magda-panel-avatar" />
              <div className="magda-panel-header-text">
                <h2 id="magda-panel-title">Magda Gutiérrez</h2>
                <p className="magda-panel-subtitle">HEOR · Pricing · Market Access</p>
                <p className="magda-panel-status">Asistente virtual</p>
              </div>
            </div>
            <button
              className="magda-panel-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              aria-expanded="true"
            >
              ✕
            </button>
          </div>

          <div className="magda-panel-body">
            <div className="magda-panel-background" />

            <div className="magda-panel-messages" role="log">
              {messages.map((msg, idx) => (
                <div key={idx} className={`magda-msg magda-msg-${msg.role}`}>
                  <div className="magda-msg-content">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="magda-msg magda-msg-assistant">
                  <div className="magda-msg-content magda-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showQuickActions && (
              <div className="magda-quick-actions">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.message}
                    className="magda-quick-action"
                    onClick={() => handleSend(action.message)}
                    disabled={loading}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="magda-panel-composer">
            <textarea
              className="magda-composer-input"
              placeholder="Escribe tu consulta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              aria-label="Message input"
            />
            <button
              className="magda-composer-send"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              title="Send (Ctrl+Enter)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
