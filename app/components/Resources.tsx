"use client";

import { Phone, BookOpen, Heart, Users, ExternalLink, HelpCircle } from "lucide-react";

const resources = [
  {
    id: "alz-helpline",
    title: "Alzheimer's Helpline",
    subtitle: "24/7 support & information",
    icon: Phone,
    color: "bg-red-100 text-red-700",
    action: "tel:1-800-272-3900",
    actionLabel: "Call 1-800-272-3900",
  },
  {
    id: "caregiver-guide",
    title: "Caregiver Guide",
    subtitle: "Practical tips for families",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700",
    action: "https://www.alz.org/help-support/caregiving",
    actionLabel: "Read Online",
  },
  {
    id: "support-groups",
    title: "Support Groups",
    subtitle: "Connect with others",
    icon: Users,
    color: "bg-green-100 text-green-700",
    action: "https://www.alz.org/help-support/support_groups",
    actionLabel: "Find a Group",
  },
  {
    id: "what-is-alz",
    title: "What is Alzheimer's?",
    subtitle: "Simple, clear explanation",
    icon: HelpCircle,
    color: "bg-purple-100 text-purple-700",
    action: "https://www.alz.org/alzheimers-dementia/what-is-alzheimers",
    actionLabel: "Learn More",
  },
  {
    id: "self-care",
    title: "Caregiver Self-Care",
    subtitle: "Taking care of yourself",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
    action: "https://www.alz.org/help-support/caregiving/caregiver-health",
    actionLabel: "Read Guide",
  },
];

export function Resources() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-anchor-700">Resources</h2>
        <p className="text-sage-600">Helpful information & support</p>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => {
          const Icon = resource.icon;
          const isPhone = resource.action.startsWith("tel:");
          
          return (
            <a
              key={resource.id}
              href={resource.action}
              target={isPhone ? undefined : "_blank"}
              rel={isPhone ? undefined : "noopener noreferrer"}
              className="card flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              <div className={`p-4 rounded-2xl ${resource.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-sage-700">{resource.title}</h3>
                <p className="text-sage-500">{resource.subtitle}</p>
              </div>

              <div className="text-anchor-500 font-semibold flex items-center gap-1">
                {isPhone ? (
                  <span className="text-lg">Call</span>
                ) : (
                  <>
                    <span className="hidden sm:inline">{resource.actionLabel}</span>
                    <ExternalLink className="w-5 h-5" />
                  </>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <div className="card bg-anchor-50 border-2 border-anchor-200">
        <h3 className="text-xl font-bold text-anchor-700 mb-3">Emergency?</h3>
        <p className="text-lg text-sage-700 mb-4">
          If you or someone you care for needs immediate help:
        </p>
        <a 
          href="tel:911" 
          className="btn-primary w-full block text-center"
        >
          Call 911
        </a>
      </div>
    </div>
  );
}
