import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";

import HeroSection from "@/components/hero";

export default function Home() {
  return (
    <div className="mt-40">

      {/* HERO */}
      <HeroSection />

      {/* TRUSTED BY */}
      <section className="py-10 fade-in">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 mb-6">
            Trusted by professionals from
          </p>

          <div className="flex justify-center items-center gap-12 opacity-70 text-xl font-semibold">
            <span>Google</span>
            <span>Amazon</span>
            <span>Stripe</span>
            <span>Notion</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-blue-50 fade-in">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsData.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
<section id="features" className="py-20 fade-in">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      Powerful Features for Smarter Finance
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuresData.map((feature, index) => (
        <Card key={index} className="p-6 card-hover">
          <CardContent className="space-y-4 pt-4">
            {feature.icon}
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


      {/* HOW IT WORKS */}
      <section className="py-20 bg-blue-50 fade-in">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            How Spendora Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center px-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
<section id="testimonials" className="py-20 fade-in">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      What Our Users Say
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonialsData.map((testimonial, index) => (
        <Card key={index} className="p-6 card-hover">
          <CardContent className="pt-4">
            <div className="flex items-center mb-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="rounded-full"
              />

              <div className="ml-4">
                <div className="text-sm font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.role}
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              "{testimonial.quote}"
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="py-20 bg-blue-700 fade-in">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>

          <p className="text-lg text-gray-200 mb-8">
            Join thousands of users managing their finances smarter with Spendora.
          </p>

          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-purple-700 px-6 py-3 rounded-md hover:bg-gray-100 transition animate-bounce"
            >
              Get Started
            </Button>
          </Link>

        </div>
      </section>

    </div>
  );
}