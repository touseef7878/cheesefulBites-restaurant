import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOCAL_ASSETS } from "@/lib/assets";

type ChatMessage = { role: "user" | "assistant"; content: string };

const initialMessage: ChatMessage = {
  role: "assistant",
  content: "Welcome to Cheeseful Bites. I can help with our menu, ordering, delivery, location, hours, and account questions.",
};
const suggestions = ["What are your hours?", "How do I order on WhatsApp?", "Where is Cheeseful Bites?"];

export function RestaurantAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [isOpen, messages, isLoading]);

  const send = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;
    const userMessage: ChatMessage = { role: "user", content: message };
    const history = messages.slice(-6);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/restaurant-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const payload = await response.json() as { reply?: string; error?: string };
      setMessages((current) => [...current, { role: "assistant", content: payload.reply ?? payload.error ?? "I’m unable to answer right now. Please call or message +92 328 8681123 for help." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "I’m unable to connect right now. Please call or message +92 328 8681123 for help." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="restaurant-assistant" aria-live="polite">
      {isOpen && <section className="restaurant-assistant__panel" aria-label="Cheeseful Bites restaurant assistant">
        <header className="restaurant-assistant__header"><img src={LOCAL_ASSETS.assistantChef} alt="Cheeseful Bites assistant chef" /><div><p>Cheeseful Assistant</p><span>Restaurant help only</span></div><button type="button" onClick={() => setIsOpen(false)} aria-label="Close restaurant assistant"><X size={19} /></button></header>
        <div className="restaurant-assistant__messages" ref={scrollRef}>
          {messages.map((chat, index) => <div className={`restaurant-assistant__message is-${chat.role}`} key={`${chat.role}-${index}`}>{chat.role === "assistant" && <img src={LOCAL_ASSETS.assistantChef} alt="" />}<p>{chat.content}</p></div>)}
          {isLoading && <div className="restaurant-assistant__message is-assistant"><img src={LOCAL_ASSETS.assistantChef} alt="" /><p><Loader2 size={17} className="restaurant-assistant__spinner" /> Preparing a restaurant answer…</p></div>}
        </div>
        <div className="restaurant-assistant__suggestions" aria-label="Suggested restaurant questions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void send(suggestion)} disabled={isLoading}>{suggestion}</button>)}</div>
        <form className="restaurant-assistant__composer" onSubmit={(event) => { event.preventDefault(); void send(input); }}><label className="screen-reader-only" htmlFor="restaurant-assistant-input">Ask Cheeseful Bites a restaurant question</label><input id="restaurant-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Cheeseful Bites…" maxLength={700} disabled={isLoading} /><button type="submit" aria-label="Send restaurant question" disabled={!input.trim() || isLoading}><Send size={17} /></button></form>
      </section>}
      <button type="button" className="restaurant-assistant__trigger" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label={isOpen ? "Close Cheeseful Bites assistant" : "Open Cheeseful Bites assistant"}><span className="restaurant-assistant__trigger-icon"><img src={LOCAL_ASSETS.assistantChef} alt="" /></span><span><b>{isOpen ? "Close help" : "Need help?"}</b><small>Ask our chef</small></span>{isOpen ? <X size={20} /> : <MessageCircle size={20} />}</button>
    </div>
  );
}
