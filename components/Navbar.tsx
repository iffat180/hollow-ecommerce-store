"use client";

import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-background sticky top-0 z-50 border-b border-text/10">
      <div className="flex items-center justify-between py-4 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link href="/" className="font-roboto-slab text-lg font-medium cursor-pointer">  
            Hollow
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

       {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <button
              className="p-2 hover:bg-primary/10 rounded-full transition-colors relative group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6 text-text group-hover:text-primary transition-colors" />
              {/* Cart badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-text" />
            ) : (
              <Menu className="w-6 h-6 text-text" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-4 px-8 py-6 bg-background border-t border-text/10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-text hover:text-primary transition-colors font-medium block"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}