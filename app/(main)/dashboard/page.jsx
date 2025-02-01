import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingDate } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingDate();

  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const insights = await getIndustryInsights();
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;
