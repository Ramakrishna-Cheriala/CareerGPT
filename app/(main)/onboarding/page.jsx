import React from "react";
import OnboardingForm from "./_components/onboarding-form";
import { industries } from "@/data/industries";
import { getUserOnboardingDate } from "@/actions/user";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const { isOnboarded } = await getUserOnboardingDate();

  if (isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default OnboardingPage;
