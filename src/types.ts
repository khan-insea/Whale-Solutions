/**
 * Types and interfaces for whale sea
 */

export type ServiceStatus = 'available' | 'coming_soon';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  status: ServiceStatus;
  isComingSoonNote?: string;
}

export interface ServiceGroup {
  id: string;
  title: string;
  status: ServiceStatus | 'hybrid';
  badgeText: string;
  services: ServiceItem[];
  ctaText: string;
  note?: string; // Special display note for group
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  ctaText: string;
  badge?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  websiteUrl?: string;
  gallery?: string[];
  challenge?: string;
  solution?: string;
  results?: string[];
  details?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
  image: string;
}

export interface SubmissionRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  requestType: 'quote' | 'interest' | 'consult';
  serviceOfInterest: string;
  budget: string;
  timeline: string;
  message: string;
  submittedAt: string;
  pageSource: string;
}
