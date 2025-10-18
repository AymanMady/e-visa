import { ReactElement } from "react";
import { Feature } from "@/types/feature";
import { ShieldCheck, CreditCard, Bell, Globe, User } from "lucide-react";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-9 h-9 text-white"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} stroke="currentColor" />
        <circle cx="12" cy="10.5" r="2.5" strokeWidth={2} stroke="currentColor" />
        <path d="M8 17s1.5-1 4-1 4 1 4 1" strokeWidth={2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    titleKey: "feature_visa_title",
    descKey: "feature_visa_desc",
  },
  {
    id: 2,
    icon: <ShieldCheck className="w-9 h-9 text-white" />,
    titleKey: "feature_security_title",
    descKey: "feature_security_desc",
  },
  {
    id: 3,
    icon: <CreditCard className="w-9 h-9 text-white" />,
    titleKey: "feature_payment_title",
    descKey: "feature_payment_desc",
  },
  {
    id: 4,
    icon: <Bell className="w-9 h-9 text-white" />,
    titleKey: "feature_tracking_title",
    descKey: "feature_tracking_desc",
  },
  {
    id: 5,
    icon: <Globe className="w-9 h-9 text-white" />,
    titleKey: "feature_multilang_title",
    descKey: "feature_multilang_desc",
  },
  {
    id: 6,
    icon: <User className="w-9 h-9 text-white" />,
    titleKey: "feature_support_title",
    descKey: "feature_support_desc",
  },
];

export default featuresData;
