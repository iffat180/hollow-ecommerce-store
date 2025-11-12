"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 2500);
  };

  return (
    <div className="py-16 md:py-20">
      <div className="px-6 sm:px-10 md:px-20 lg:px-28 max-w-[1400px] mx-auto">
        {/* Header */}
        <section className="pb-12 text-center">
          <span className="text-sm uppercase tracking-widest text-primary font-semibold">
            Contact Us
          </span>
          <h1 className="font-roboto-slab text-4xl md:text-5xl font-bold text-text pt-3 pb-4">
            Let’s Talk About <br />
            <span className="text-primary">Your Safety Needs</span>
          </h1>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            Reach out to our team for inquiries, product info, or support. We’ll
            respond within 24 hours.
          </p>
        </section>

        {/* Info + Form */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Info Cards */}
          <div className="space-y-6 flex flex-col gap-2.5">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-sm">
              <Mail className="w-6 h-6 text-primary hrink-0" />
              <div>
                <h3 className="font-semibold text-text pb-1">Email Us</h3>
                <p className="text-text/70 text-sm">
                  support@hollow.com <br /> sales@hollow.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-sm">
              <Phone className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-text pb-1">Call Us</h3>
                <p className="text-text/70 text-sm">
                  +1 (555) 123-4567 <br /> +1 (555) 765-4321
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-sm">
              <MapPin className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-text pb-1">Visit Us</h3>
                <p className="text-text/70 text-sm">
                  123 Safety Street, Cleveland Heights, OH
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-sm">
              <Clock className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-text pb-1">Business Hours</h3>
                <p className="text-text/70 text-sm">
                  Mon–Fri: 9am–6pm <br /> Sat: 10am–4pm
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 md:p-10 shadow-xl">
            <h2 className="font-roboto-slab text-2xl md:text-3xl font-bold text-text pb-3">
              Send Us a Message
            </h2>
            <p className="text-text/60 pb-6 text-sm md:text-base">
              Fill out the form and we’ll get back to you shortly.
            </p>

            {isSubmitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-800 pb-1">
                  Message Sent!
                </h3>
                <p className="text-green-700 text-sm">
                  We’ll reply as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent focus:border-primary focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent focus:border-primary focus:outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent focus:border-primary focus:outline-none"
                />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent focus:border-primary focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Your Message *"
                  className="w-full px-4 py-3 rounded-lg border border-text/20 bg-transparent focus:border-primary focus:outline-none resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3.5 rounded-full font-semibold hover:bg-[#a85a38] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
