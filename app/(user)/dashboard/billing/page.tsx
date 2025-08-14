import React from "react";

import { getUserBillHistory } from "@/app/actions/services/caregiver.actions";
import { BillingPage } from "@/components/pages/billing-page";
export const dynamic = "force-dynamic";

export default async function BillingDashboard() {
  const billingHistory = await getUserBillHistory();
  console.log("BILLIN", billingHistory.payments?.data);
  return <BillingPage payments={billingHistory.payments.data} />;
}
