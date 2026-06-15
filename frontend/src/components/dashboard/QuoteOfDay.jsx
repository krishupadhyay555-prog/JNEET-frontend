// ============================================================
//  JNEET+ AI — components/dashboard/QuoteOfDay.jsx
//  Quiet, typographic quote. Deterministic daily rotation —
//  same quote all day, changes at midnight.
// ============================================================

import { Quote } from "lucide-react";

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The harder I work, the luckier I get.", author: "Gary Player" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "One day or day one. You decide.", author: "Paulo Coelho" },
  { text: "Success doesn't come from what you do occasionally. It comes from what you do consistently.", author: "Marie Forleo" },
];

function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function QuoteOfDay() {
  const quote = getDailyQuote();

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl px-5 py-4 relative overflow-hidden">
      {/* Decorative quote mark */}
      <div className="absolute top-3 right-4 opacity-5">
        <Quote size={40} className="text-violet-400" />
      </div>

      <div className="flex items-start gap-3">
        <Quote size={13} className="text-violet-500/60 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-gray-400 leading-relaxed italic font-light">
            {quote.text}
          </p>
          <p className="text-[11px] text-gray-700 mt-2 font-medium">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
}