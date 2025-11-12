"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { reviews } from "@/lib/constants";

interface ReviewsCarouselProps {
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function ReviewsSection({
  autoplay = true,
  autoplayInterval = 7000,
}: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-16 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side - Header & Stats */}
        <div>
          <p className="text-sm uppercase tracking-widest text-text/60 font-semibold pb-4">
            Reviews
          </p>
          <h2 className="font-roboto-slab text-4xl md:text-5xl font-bold text-text pb-4 leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-lg text-text/80 pb-2 leading-relaxed">
            Shop with confidence by reading customer reviews given by
            individuals who have used our products. Excellent quality and
            streamlined service are both offered here.
          </p>
          {/* Rating Stats */}
          <div className="flex items-center gap-4 pb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-text">5/5</span>
          </div>
          <p className="text-lg text-text font-semibold">
            {reviews.length.toLocaleString()} reviews
          </p>
        </div>

        {/* Right Side - Review Carousel with Arrows */}
        <div>
          {/* Review Card */}
          <div className="p-8 md:p-12 min-h-96 flex flex-col justify-between shadow-lg">
            {/* Review Text */}
            <p className="font-roboto-slab leading-relaxed mb-8">
              {currentReview.text}
            </p>
            {/* Review Meta */}
            <div className="border-t border-text/10 pt-5">
              <p className="text-sm text-text/60 mb-3">
                {currentReview.location}
              </p>
              <p className="text-l font-bold">{currentReview.author}</p>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}