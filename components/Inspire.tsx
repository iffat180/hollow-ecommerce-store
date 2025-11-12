"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Inspire() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 md:py-20">
      <div>
        {/* Instagram Section - Full Width Background Image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden ">
          {/* Background Image */}
          <Image
            src="/images/inspire.png"
            alt="Team with safety equipment"
            sizes="100vw"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-start px-8 sm:px-12 md:px-16 lg:px-24 md:pt-15 md:max-w-md pt-5 max-w-xs">
            <h2 className="font-roboto-slab text-xl md:text-3xl font-bold mb-6 leading-tight">
              Get inspired from our Instagram
            </h2>
            <p className="text-sm not-only:md:text-md">
              If you use the hashtag #bloomey on Instagram, we'll spotlight you.
            </p>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold hover:text-primary transition-colors group w-fit"
            >
              Check it out
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
        </div>

        {/* Newsletter Section */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center pt-7">
            {/* Left Content */}
            <div>
              <h2 className="font-roboto-slab text-xl md:text-2xl font-bold text-text mb-6 leading-tight">
                Stay updated with special offers, safety insights, and industry news.
              </h2>
            </div>

            {/* Right - Email Subscription */}
            <div>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 border-b-2 border-text/30 bg-transparent focus:border-primary outline-none transition-colors text-text placeholder:text-text/50"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-background rounded-full font-semibold hover:bg-primary transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>

              {/* Success Message */}
              {isSubscribed && (
                <p className="pt-3 text-primary font-semibold">
                  Thanks for subscribing! Check your email.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
