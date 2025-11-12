"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-text/10">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto py-4 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <span className="font-roboto-slab text-lg font-medium cursor-pointer">Hollow</span>
          </div>

          {/* Center - Links */}
          <div className="flex gap-8 md:gap-12">
            <Link
              href="/help"
              className="text-text hover:text-primary transition-colors font-medium"
            >
              Help
            </Link>
            <Link
              href="/contact"
              className="text-text hover:text-primary transition-colors font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="text-text hover:text-primary transition-colors font-medium"
            >
              Privacy & Terms
            </Link>
          </div>

          {/* Right - Social Icons */}
          <div className="flex gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}