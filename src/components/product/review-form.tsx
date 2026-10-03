"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("saving");

    try {
      const response = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: data.get("author"),
          campus: data.get("campus"),
          major: data.get("major"),
          title: data.get("title"),
          body: data.get("body"),
          rating,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Could not save your review.");
        return;
      }

      form.reset();
      setRating(5);
      setStatus("done");
      setMessage("Thanks! Your review is live.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network hiccup — please try again.");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-6 py-3 text-sm font-semibold text-espresso transition hover:border-espresso hover:bg-espresso hover:text-crema"
      >
        Write a review
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="animate-fade-up rounded-[1.4rem] border border-espresso/12 bg-white/60 p-6 sm:p-7"
    >
      <h3 className="font-display text-xl text-espresso">Share your brew notes</h3>
      <p className="mt-1 text-sm text-espresso/55">
        Students read these before they buy. Be honest about the grind.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.16em] text-espresso/45">
          Rating
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className={`text-xl transition-transform hover:scale-125 ${
                (hover || rating) >= value ? "text-caramel-deep" : "text-espresso/25"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="author" placeholder="Ananya R." required />
        <Field label="College" name="campus" placeholder="IIT Madras" required />
        <Field label="Course & year" name="major" placeholder="CS, 3rd year" />
        <Field label="Headline" name="title" placeholder="Survived four deadlines" required />
      </div>

      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-[0.16em] text-espresso/45">
          Your review
        </span>
        <textarea
          name="body"
          required
          rows={4}
          placeholder="How did you brew it, what did you taste, would you reorder?"
          className="mt-2 w-full rounded-xl border border-espresso/15 bg-crema px-4 py-3 text-sm text-espresso placeholder:text-espresso/35 focus:border-espresso focus:outline-none"
        />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-crema transition hover:bg-caramel-deep disabled:opacity-60"
        >
          {status === "saving" ? "Posting…" : "Post review"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-espresso/50 transition hover:text-espresso"
        >
          Cancel
        </button>
        {message && (
          <p
            className={`text-sm ${
              status === "error" ? "text-terracotta" : "text-sage"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-espresso/45">
        {label}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-espresso/15 bg-crema px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-espresso focus:outline-none"
      />
    </label>
  );
}
