import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type Sentiment = "love" | "ok" | "bug" | "idea";

const SENTIMENTS: { value: Sentiment; label: string }[] = [
  { value: "love", label: "Love it" },
  { value: "ok", label: "It's OK" },
  { value: "bug", label: "Bug" },
  { value: "idea", label: "Idea" },
];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !sent) {
      setTimeout(() => textareaRef.current?.focus(), 320);
    }
  }, [open, sent]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => {
    setSentiment(null);
    setMessage("");
    setEmail("");
    setSent(false);
    setError(null);
  };

  const submit = async () => {
    if (!message.trim()) {
      setError("Please write a short message.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest("POST", "/api/feedback", {
        sentiment,
        message: message.trim(),
        email: email.trim() || undefined,
        page: typeof window !== "undefined" ? window.location.pathname : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setTimeout(reset, 400);
      }, 1600);
    } catch (e: any) {
      setError(e?.message || "Could not send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-end gap-3 pointer-events-none">
      {/* Slide-out form panel (anchored to right; translates from the right edge) */}
      <div
        role="dialog"
        aria-label="Send feedback"
        aria-hidden={!open}
        {...(!open ? { inert: "" as any } : {})}
        className={`pointer-events-auto origin-bottom-right transition-all duration-300 ease-out
          ${open ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-6 scale-95 pointer-events-none"}`}
      >
        <div className="w-[min(92vw,360px)] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="text-white text-sm font-bold">Send feedback</h3>
              <p className="text-teal-50 text-xs">We read every message.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close feedback form"
              data-testid="button-feedback-close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          {sent ? (
            <div className="px-5 py-8 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Thanks for the feedback.</p>
              <p className="text-xs text-slate-500">We'll take a look.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Sentiment chips */}
              <div className="flex flex-wrap gap-2">
                {SENTIMENTS.map((s) => {
                  const active = sentiment === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSentiment(s.value)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        active
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "bg-white border-slate-300 text-slate-600 hover:border-teal-400"
                      }`}
                      data-testid={`chip-sentiment-${s.value}`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="feedback-message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your feedback
                </label>
                <textarea
                  ref={textareaRef}
                  id="feedback-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  placeholder="What's working, what's not, what would help…"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none resize-none"
                  data-testid="textarea-feedback-message"
                />
                <p className="text-[10px] text-slate-400 text-right mt-0.5">{message.length}/2000</p>
              </div>

              {/* Email (optional) */}
              <div>
                <label htmlFor="feedback-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email <span className="font-normal text-slate-400">(optional, so we can reply)</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={200}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                  data-testid="input-feedback-email"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={submitting || !message.trim()}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                data-testid="button-feedback-submit"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send feedback
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Speech-bubble button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close feedback" : "Open feedback"}
        aria-expanded={open}
        className="pointer-events-auto relative w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-xl shadow-teal-300/40 hover:shadow-teal-400/50 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
        data-testid="button-feedback-toggle"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {/* speech-bubble tail */}
        {!open && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 right-3 w-3 h-3 bg-teal-600 rotate-45 rounded-sm"
          />
        )}
      </button>
    </div>
  );
}

export default FeedbackWidget;
