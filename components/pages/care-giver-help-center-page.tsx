// HelpCenter.tsx
"use client";

import { Search, FileText, FolderOpen, Lock, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";

import { PageTitleHeader } from "../shared/widget/page-title-header";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function CaregiverHelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const categories: HelpCategory[] = [
    {
      id: "general-faqs",
      title: "General FAQs",
      description:
        "General information and questions about the types of caregiving services we offer, personalized care plans, caregiver support, emergency procedures, and service overview",
      icon: <FileText className="h-5 w-5 text-gray-500" />,
    },
    {
      id: "caregiving-management",
      title: "Caregiving Management",
      description:
        "Get answers to your questions regarding medical care at home, including how caregivers manage medications, monitor health conditions, and assist with specific health needs or physical therapy sessions",
      icon: <FolderOpen className="h-5 w-5 text-gray-500" />,
    },
    {
      id: "privacy-security",
      title: "Privacy & Security",
      description:
        "We take your privacy seriously. Explore how we protect your personal and medical information, ensuring confidentiality while caregivers provide the best care in your home",
      icon: <Lock className="h-5 w-5 text-gray-500" />,
    },
    {
      id: "billing-payments",
      title: "Billings & Payments",
      description:
        "Understand your billing cycle, payment methods, and insurance coverage, and clarify any billing-related questions",
      icon: <CreditCard className="h-5 w-5 text-gray-500" />,
    },
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/caregiver/help-center/${categoryId}`);
  };
  return (
    <section className="space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <PageTitleHeader
        title="How can we help you?"
        description=" Our Help Center is your go-to resource for all things related to our home caregiving services."
      />

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute top-4 left-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search"
          className="no-focus w-full rounded-md border border-gray-200 py-6 pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="cursor-pointer rounded-[6px] border border-[#E8E8E8] transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <div className="p-6">
              <div className="mb-4">{category.icon}</div>
              <h2 className="mb-2 text-lg font-medium">{category.title}</h2>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No help topics match your search. Please try different keywords.
        </div>
      )}
    </section>
  );
}
