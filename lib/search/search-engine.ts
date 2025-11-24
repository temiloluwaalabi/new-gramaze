// lib/search/search-engine.ts
import { format } from "date-fns";

import { allRoutes } from "@/config/routes";

import { SearchableData, SearchResult, SearchResultType } from "./search-types";

// Define searchable pages
const SEARCHABLE_PAGES = [
  {
    title: "Dashboard",
    description: "View your dashboard overview",
    url: allRoutes.user.dashboard.home.url,
    keywords: ["home", "overview", "main"],
  },
  {
    title: "Appointments",
    description: "View and manage your appointments",
    url: allRoutes.user.dashboard.appointment.url,
    keywords: ["booking", "schedule", "visit"],
  },
  {
    title: "Schedule Appointment",
    description: "Book a new appointment",
    url: allRoutes.user.dashboard.scheduleAppointment.url,
    keywords: ["book", "new", "create"],
  },
  {
    title: "Billing",
    description: "View payments and billing history",
    url: allRoutes.user.dashboard.billing.url,
    keywords: ["payment", "invoice", "subscription"],
  },
  {
    title: "Caregiver History",
    description: "View your caregiver history",
    url: allRoutes.user.dashboard.caregiverHistory.url,
    keywords: ["nurse", "doctor", "provider"],
  },
  {
    title: "Health Tracker",
    description: "Track your health metrics",
    url: allRoutes.user.dashboard.healthTracker.url,
    keywords: ["vitals", "blood pressure", "glucose", "weight"],
  },
  {
    title: "Messages",
    description: "View your messages",
    url: allRoutes.user.dashboard.message.url,
    keywords: ["chat", "conversation", "inbox"],
  },
  {
    title: "Help Center",
    description: "Get help and support",
    url: allRoutes.user.dashboard.helpCenter.url,
    keywords: ["support", "faq", "assistance"],
  },
  {
    title: "Settings",
    description: "Manage your account settings",
    url: allRoutes.user.dashboard.settings.url,
    keywords: ["profile", "preferences", "account"],
  },
];

export class SearchEngine {
  private data: SearchableData;

  constructor(data: SearchableData) {
    this.data = data;
  }

  search(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search appointments
    results.push(...this.searchAppointments(normalizedQuery));

    // Search messages
    results.push(...this.searchMessages(normalizedQuery));

    // Search caregivers
    results.push(...this.searchCaregivers(normalizedQuery));

    // Search health trackers
    results.push(...this.searchHealthTrackers(normalizedQuery));

    // Search health reports
    results.push(...this.searchHealthReports(normalizedQuery));

    // Search health notes
    results.push(...this.searchHealthNotes(normalizedQuery));

    // Search payments
    results.push(...this.searchPayments(normalizedQuery));

    // Search pages
    results.push(...this.searchPages(normalizedQuery));

    // Sort by match score and return top results
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
  }

  private calculateMatchScore(text: string, query: string): number {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    let score = 0;

    // Exact match
    if (normalizedText === normalizedQuery) {
      score += 100;
    }

    // Starts with query
    if (normalizedText.startsWith(normalizedQuery)) {
      score += 50;
    }

    // Contains query
    if (normalizedText.includes(normalizedQuery)) {
      score += 25;
    }

    // Word match
    const queryWords = normalizedQuery.split(/\s+/);
    const textWords = normalizedText.split(/\s+/);

    queryWords.forEach((queryWord) => {
      textWords.forEach((textWord) => {
        if (textWord === queryWord) {
          score += 15;
        } else if (textWord.includes(queryWord)) {
          score += 5;
        }
      });
    });

    return score;
  }

  private searchAppointments(query: string): SearchResult[] {
    return this.data.appointments
      .map((apt) => {
        const name =
          apt.name ||
          `${apt.caregiver?.first_name || ""} ${apt.caregiver?.last_name || ""}`.trim() ||
          "Unknown";
        const type =
          apt.appointment_type === "virtual" ? "Virtual" : "Physical";
        const date = format(new Date(apt.date), "MMM dd, yyyy");

        const searchableText = `${name} ${type} ${date} ${apt.status} ${apt.location || ""} ${apt.additional_note || ""}`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        return {
          id: `appointment-${apt.id}`,
          type: "appointment" as SearchResultType,
          title: `${type} Appointment with ${name}`,
          description: `${date} at ${apt.time} • ${apt.status}`,
          url: `${allRoutes.user.dashboard.appointment.url}?id=${apt.id}`,
          metadata: {
            date: apt.date,
            status: apt.status,
            avatar: apt.avatar,
            type: apt.appointment_type,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchMessages(query: string): SearchResult[] {
    return this.data.messages
      .map((msg) => {
        const searchableText = `${msg.name} ${msg.message}`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        return {
          id: `message-${msg.id}`,
          type: "message" as SearchResultType,
          title: msg.name,
          description:
            msg.message.length > 100
              ? `${msg.message.substring(0, 100)}...`
              : msg.message,
          url: `${allRoutes.user.dashboard.messageChat.url}?id=${msg.id}`,
          metadata: {
            date: msg.timestamp,
            avatar: msg.avatar,
            unreadCount: msg.unreadCount,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchCaregivers(query: string): SearchResult[] {
    return this.data.caregivers
      .map((cg) => {
        const name =
          `${cg.caregiver.first_name} ${cg.caregiver.last_name}`.trim();
        const searchableText = `${name} caregiver`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        return {
          id: `caregiver-${cg.id}`,
          type: "caregiver" as SearchResultType,
          title: name,
          description: `Caregiver • Active from ${format(new Date(cg.start_date), "MMM dd, yyyy")}`,
          url: `${allRoutes.user.dashboard.caregiverUserHistory.url.replace("/1", `/${cg.caregiver_id}`)}`,
          metadata: {
            date: cg.start_date,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchHealthTrackers(query: string): SearchResult[] {
    return this.data.healthTrackers
      .map((tracker) => {
        const metricsText = tracker.metrics
          .map((m) => `${m.name} ${m.value}`)
          .join(" ");
        const searchableText = `health tracker ${metricsText} ${tracker.blood_glucose} ${tracker.blood_pressure} ${tracker.weight} ${tracker.pulse}`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        const metricsSummary = tracker.metrics
          .slice(0, 2)
          .map((m) => `${m.name}: ${m.value}`)
          .join(", ");

        return {
          id: `tracker-${tracker.id}`,
          type: "health-tracker" as SearchResultType,
          title: "Health Tracker Entry",
          description: `${metricsSummary} • ${format(new Date(tracker.created_at), "MMM dd, yyyy")}`,
          url: `${allRoutes.user.dashboard.healthTracker.url}?id=${tracker.id}`,
          metadata: {
            date: tracker.created_at,
            status: tracker.status,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchHealthReports(query: string): SearchResult[] {
    return this.data.healthReports
      .map((report) => {
        const searchableText = `${report.report_name} ${report.report_type} ${report.summary || ""} ${report.created_by_name}`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        return {
          id: `report-${report.id}`,
          type: "health-report" as SearchResultType,
          title: report.report_name,
          description: `${report.report_type} • by ${report.created_by_name} • ${format(new Date(report.created_at), "MMM dd, yyyy")}`,
          url: report.report_file || allRoutes.user.dashboard.healthTracker.url,
          metadata: {
            date: report.created_at,
            type: report.report_type,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchHealthNotes(query: string): SearchResult[] {
    return this.data.healthNotes
      .map((note) => {
        const searchableText = `${note.title} ${note.notes} ${note.created_by_name}`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        return {
          id: `note-${note.id}`,
          type: "health-note" as SearchResultType,
          title: note.title,
          description: `${note.notes.length > 100 ? note.notes.substring(0, 100) + "..." : note.notes} • by ${note.created_by_name}`,
          url: `${allRoutes.user.dashboard.healthTracker.url}?noteId=${note.id}`,
          metadata: {
            date: note.created_at,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchPayments(query: string): SearchResult[] {
    return this.data.paymentNotifications
      .map((payment) => {
        const searchableText = `${payment.pay_reference} ${payment.amount} ${payment.status} ${payment.message} ${payment.plan_code}`;
        const matchScore = this.calculateMatchScore(searchableText, query);

        if (matchScore === 0) return null;

        return {
          id: `payment-${payment.id}`,
          type: "payment" as SearchResultType,
          title: `Payment ${payment.pay_reference}`,
          description: `₦${payment.amount} • ${payment.status} • ${format(new Date(payment.created_at), "MMM dd, yyyy")}`,
          url: allRoutes.user.dashboard.billing.url,
          metadata: {
            date: payment.created_at,
            status: payment.status,
            amount: payment.amount,
          },
          matchScore,
        };
      })
      .filter(Boolean) as SearchResult[];
  }

  private searchPages(query: string): SearchResult[] {
    return SEARCHABLE_PAGES.map((page) => {
      const searchableText = `${page.title} ${page.description} ${page.keywords.join(" ")}`;
      const matchScore = this.calculateMatchScore(searchableText, query);

      if (matchScore === 0) return null;

      return {
        id: `page-${page.url}`,
        type: "page" as SearchResultType,
        title: page.title,
        description: page.description,
        url: page.url,
        matchScore,
      };
    }).filter(Boolean) as SearchResult[];
  }
}
