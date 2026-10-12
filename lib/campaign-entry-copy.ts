export type CampaignAngle = "acquisition" | "capacity" | "ownership";
export type WalkthroughDestination = "/acquisition/review" | "/deal/review" | "/underwriting-support/review" | "/ownership-waterfall/review";

export const campaignEntryCopy: Record<CampaignAngle, { eyebrow: string; headline: string; emphasis: string; description: string; destination: WalkthroughDestination }> = {
  acquisition: {
    eyebrow: "FOR ACQUISITION DEAL TEAMS",
    headline: "Inherited a model?",
    emphasis: "Know what’s in it before IC.",
    description: "See the hidden assumptions and formula problems we look for, so you can explain the numbers even when the person who built it has moved on.",
    destination: "/acquisition/review",
  },
  capacity: {
    eyebrow: "FOR CRE DEAL TEAMS",
    headline: "Underwriting support for a live deal.",
    emphasis: "Work through it together or hand it over.",
    description: "See how we work through a CRE underwriting assignment, with your team or on a defined scope. Start with the deal, the question and the deadline.",
    destination: "/underwriting-support/review",
  },
  ownership: {
    eyebrow: "FOR GP / LP OWNERSHIP STRUCTURES",
    headline: "How does the deal split?",
    emphasis: "Work through the ownership waterfall.",
    description: "See how an old preferred-return hurdle changed a sponsor’s modeled allocation, and how we brought the workbook back to the agreed split.",
    destination: "/ownership-waterfall/review",
  },
};
