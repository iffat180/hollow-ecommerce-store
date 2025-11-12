import Image from "next/image";
import Button from "@/components/ui/Button";
import { ShieldCheck, Award, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-center md:text-left">
        {/* Left Content */}
        <div className="flex flex-col justify-center gap-4">
          {/* Main Heading */}
          <h1 className="font-roboto-slab text-6xl md:text-7xl font-bold leading-tight mb-6">
            Safety Meets
            <br />
            Precision
          </h1>

          {/* Button */}
          <div className="flex gap-3 justify-center md:justify-start">
            <div>
              <Link href="/shop">
              <Button>Show Catalog</Button>
              </Link>
            </div>
            <div>
              <Link href="/about">
              <Button variant="outline">
                <span className="flex items-center gap-2">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
              </Link>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg font-medium">
            Certified protection that meets or exceeds ANSI/OSHA standards.
          </p>
          <p className="text-text/80 mb-8">
            Trusted by industry leaders in Chemical, Manufacturing, and
            Construction.
          </p>

          {/* Features/Icons Row */}
          <div className="flex flex-wrap gap-3 md:gap-8">
            {/* OSHA Compliant */}
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-primary shrink-0" />
              <span className="text-sm md:text-base font-medium text-text">
                OSHA Compliant
              </span>
            </div>

            {/* ISO 9001 Certified */}
            <div className="flex items-center gap-1">
              <Award className="w-6 h-6 md:w-7 md:h-7 text-primary shrink-0" />
              <span className="text-sm md:text-base font-medium text-text">
                ISO 9001 Certified
              </span>
            </div>

            {/* Free Shipping */}
            <div className="flex items-center gap-1">
              <Truck className="w-6 h-6 md:w-7 md:h-7 text-primary shrink-0" />
              <span className="text-sm md:text-base font-medium text-text">
                Free Shipping
              </span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden relative lg:block lg:min-h-[700px] lg:w-[420px] lg:justify-self-end">
          <Image
            src="/images/hero-img.png"
            alt="Construction worker in protective gear"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
