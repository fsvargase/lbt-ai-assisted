"use client";

import { useState } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export function ContactForm() {
  const { execute } = useRecaptcha();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // reCAPTCHA v3 token obtained before completing submission.
    await execute("contact");

    // Success state representation (client-only as per non-goals)
    setSuccess(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-surface p-6 sm:p-8 shadow-md">
      {success ? (
        <div data-testid="contact-success" role="alert" className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-accent-gold animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-foreground">Message Sent</h3>
          <p className="mt-2 text-sm text-muted">
            Thank you for reaching out. An operator will contact you shortly about your NYC luxury transportation inquiry.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-6 text-sm font-semibold text-accent-gold hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" aria-label="Contact NYC Chauffeur Service">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xs font-semibold text-muted uppercase tracking-wider">
              Name <span className="text-accent-gold">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              data-testid="contact-name"
              aria-invalid={!!validationErrors.name}
              aria-describedby={validationErrors.name ? "name-error" : undefined}
              className="w-full rounded-xl bg-background/50 border border-gray-800 px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition"
              placeholder="Your name"
            />
            {validationErrors.name && (
              <p id="name-error" className="text-xs text-red-500 mt-1" role="alert" data-testid="error-name">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-semibold text-muted uppercase tracking-wider">
              Email <span className="text-accent-gold">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              data-testid="contact-email"
              aria-invalid={!!validationErrors.email}
              aria-describedby={validationErrors.email ? "email-error" : undefined}
              className="w-full rounded-xl bg-background/50 border border-gray-800 px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition"
              placeholder="you@example.com"
            />
            {validationErrors.email && (
              <p id="email-error" className="text-xs text-red-500 mt-1" role="alert" data-testid="error-email">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-xs font-semibold text-muted uppercase tracking-wider">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              data-testid="contact-phone"
              className="w-full rounded-xl bg-background/50 border border-gray-800 px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition"
              placeholder="+1 (212) 555-0100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-xs font-semibold text-muted uppercase tracking-wider">
              Message <span className="text-accent-gold">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              data-testid="contact-message"
              aria-invalid={!!validationErrors.message}
              aria-describedby={validationErrors.message ? "message-error" : undefined}
              className="w-full rounded-xl bg-background/50 border border-gray-800 px-4 py-3 text-sm text-foreground placeholder:text-gray-600 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none transition resize-none"
              placeholder="Tell us about your transport requirements..."
            />
            {validationErrors.message && (
              <p id="message-error" className="text-xs text-red-500 mt-1" role="alert" data-testid="error-message">
                {validationErrors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-testid="contact-submit"
            className="w-full rounded-xl bg-accent-gold py-4 text-center text-xs font-bold uppercase tracking-wider text-background hover:bg-accent-gold/90 transition shadow-lg shadow-accent-gold/10 active:scale-95"
          >
            Send Inquiry
          </button>
        </form>
      )}
    </div>
  );
}
