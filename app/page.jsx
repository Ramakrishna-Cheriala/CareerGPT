"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>
      <section className="w-full pt-36 md:pt-48 pb-10">
        <div className="space-y-6 text-center">
          <div className="space-y-6 mx-auto">
            <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
              Your AI Career Coach for
              <br />
              Professional Success
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Advance your career with personalized guidance, interview prep,
              and AI-powered tools for job success.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard" className="">
              <Button
                size="lg"
                className="px-8 animate-bounce flex justify-between"
              >
                Start Your Journey Today <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
