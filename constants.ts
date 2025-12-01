import { PricingTier } from './types';

export const APP_NAME = "FitAI";

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "3 AI Scans per month",
      "Basic Body Shape Analysis",
      "Standard Dress Suggestions"
    ]
  },
  {
    name: "Pro",
    price: "$19/mo",
    features: [
      "Unlimited AI Scans",
      "Detailed Measurement Estimates",
      "Premium Designer Suggestions",
      "Virtual Try-On (Beta)",
      "Priority Support"
    ],
    recommended: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "API Access",
      "White-label Integration",
      "Custom Model Fine-tuning",
      "Dedicated Account Manager"
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert fashion consultant and tailor AI. 
Your task is to analyze images of people to estimate body measurements and suggest dress styles.
You are precise, polite, and constructive.
When outputting JSON, ensure it is valid and strictly follows the requested schema.
`;
