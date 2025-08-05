// FAQPage.tsx
"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

import { PageTitleHeader } from "../shared/widget/page-title-header";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQ[] = [
    {
      id: "faq-1",
      question:
        "Do you accept insurance? What insurance plans do you work with?",
      answer:
        "We accept a variety of insurance plans to help cover the cost of caregiving services. To confirm if your specific plan is accepted, please contact us at (phone number) or (email address)",
    },
    {
      id: "faq-2",
      question:
        "Are your caregivers trained in specialized care (e.g., dementia, etc.)?",
      answer:
        "Yes, our caregivers receive specialized training for various conditions including dementia, Alzheimer's, Parkinson's, and other specialized care needs. We ensure all caregivers are properly certified and undergo regular training updates.",
    },
    {
      id: "faq-3",
      question:
        "How can my family members stay informed about my caregiving schedule?",
      answer:
        "Family members can access our secure online portal where caregiving schedules, notes, and updates are shared. We also provide regular email updates and can set up text notifications for schedule changes or important updates.",
    },
    {
      id: "faq-4",
      question: "How do you protect my personal and medical information?",
      answer:
        "We take your privacy seriously. All data is encrypted and stored securely according to HIPAA regulations. We maintain strict confidentiality protocols, and only authorized personnel have access to your information on a need-to-know basis.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="max-w-5xl space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <PageTitleHeader
        title="How can we help you?"
        description=" Our Help Center is your go-to resource for all things related to our home caregiving services."
      />

      <div className="relative mb-10">
        <Search className="absolute top-4 left-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search"
          className="w-full rounded-md border border-gray-200 py-6 pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-xl font-medium">Frequently asked questions</h2>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg bg-[#F1F5F9]"
        >
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <AccordionTrigger className="cursor-pointer px-6 py-4 text-lg font-normal text-[#303030] hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-base font-normal text-[#66666B]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
