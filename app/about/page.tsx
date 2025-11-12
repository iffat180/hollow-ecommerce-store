import Image from "next/image";
import Link from "next/link";
import { Shield, Award, Users, CheckCircle, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        
        {/* Hero Section */}
        <section className="pb-16 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block pb-4">
              <span className="text-sm uppercase tracking-widest text-primary font-semibold">
                About Us
              </span>
            </div>
            <h1 className="font-roboto-slab text-5xl md:text-6xl font-bold pb-6 text-text">
              Building a Safer <br />
              <span className="text-primary">Workplace Together</span>
            </h1>
            <p className="text-xl text-text/70 leading-relaxed">
              Your trusted partner in workplace safety and protection equipment.
              Since our founding, we've been committed to providing high-quality
              safety gear that meets the highest industry standards.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pb-16 md:pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Years Experience", value: "15+" },
              { label: "Happy Customers", value: "50K+" },
              { label: "Products", value: "500+" },
              { label: "Satisfaction Rate", value: "99%" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary pb-2">
                  {item.value}
                </div>
                <div className="text-text/60 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-img.png"
                  alt="Safety professional"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-text/70 leading-relaxed pb-6">
                We believe that everyone deserves to work in a safe environment.
                Our mission is to provide top-quality safety equipment that
                protects workers across construction, manufacturing, and
                industrial sectors.
              </p>
              <p className="text-lg text-text/70 leading-relaxed pb-8">
                Every product we offer is carefully selected to meet or exceed
                ANSI/OSHA standards, ensuring maximum protection and peace of
                mind for our customers.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Quality Assurance",
                    desc: "All products tested and certified to industry standards",
                  },
                  {
                    title: "Expert Support",
                    desc: "Knowledgeable team ready to help you choose the right gear",
                  },
                  {
                    title: "Fast Delivery",
                    desc: "Quick shipping to get protection where it's needed most",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-text pb-1">{item.title}</h3>
                      <p className="text-text/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="pb-16 md:pb-24">
          <div className="text-center pb-12">
            <h2 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text pb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Safety First",
                desc: "We prioritize safety above all else, ensuring every product meets the highest standards of protection and reliability.",
              },
              {
                icon: <Award className="w-8 h-8 text-primary" />,
                title: "Excellence",
                desc: "We're committed to excellence in product quality, customer service, and continuous improvement in everything we do.",
              },
              {
                icon: <Heart className="w-8 h-8 text-primary" />,
                title: "Customer Care",
                desc: "Your safety and satisfaction are our top priorities. We're here to support you every step of the way.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center pb-6">
                  {item.icon}
                </div>
                <h3 className="font-roboto-slab text-2xl font-bold text-text pb-4">
                  {item.title}
                </h3>
                <p className="text-text/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="pb-16 md:pb-24 bg-linear-to-br from-primary/5 to-transparent rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text">
                Why Choose Hollow?
              </h2>
            </div>
            <p className="text-xl text-text/70 leading-relaxed pb-10">
              We're not just another safety equipment supplier. We're your partners
              in creating safer workplaces through quality products, expert guidance,
              and unwavering commitment to your protection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                { title: "Industry Expertise", desc: "15+ years of experience in workplace safety solutions" },
                { title: "Certified Products", desc: "All equipment meets or exceeds safety certifications" },
                { title: "Competitive Pricing", desc: "Premium quality without the premium price tag" },
                { title: "24/7 Support", desc: "Expert guidance whenever you need it" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-white rounded-xl p-6">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-text pb-2">{item.title}</h3>
                    <p className="text-text/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="pb-16 md:pb-24">
          <div className="text-center">
            <h2 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text pb-4">
              Certifications & Compliance
            </h2>
            <p className="text-lg text-text/70 pb-12 max-w-2xl mx-auto">
              Our commitment to quality is backed by industry-leading certifications
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "ANSI", desc: "OSHA Certified" },
                { label: "ISO", desc: "9001 Certified" },
                { label: "CE", desc: "Marked" },
                { label: "CSA", desc: "Approved" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl font-bold text-primary pb-2">{item.label}</div>
                  <div className="text-text/60 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-linear-to-br from-primary to-[#a85a38] rounded-3xl p-12 md:p-16 text-white">
          <h2 className="font-roboto-slab text-3xl md:text-4xl font-bold pb-4">
            Ready to Prioritize Safety?
          </h2>
          <p className="text-xl pb-8 opacity-90">
            Explore our full range of certified safety equipment today
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-background transition-colors duration-200"
          >
            Shop Now
          </Link>
        </section>
      </div>
    </div>
  );
}
