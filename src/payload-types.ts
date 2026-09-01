export interface Media {
  id: string;
  alt?: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  featuredImage?: Media | string;
  gallery?: { image?: Media | string; id?: string }[];
  shortDescription?: string;
  fullDescription?: Record<string, unknown>;
  category?: "centrifugal" | "piston" | "gear" | "multistage" | "other" | string;
  specifications?: {
    standardFeature?: string;
    customLabel?: string;
    label?: string;
    value: string;
    unit?: string;
    isNumeric?: boolean;
    id?: string;
  }[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  isFeatured?: boolean;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  heroImage?: Media | string;
  heroVideo?: Media | string | null;
  heroSlides?: {
    image?: Media | string;
    video?: Media | string | null;
    title?: string;
    id?: string;
  }[];
  content?: Record<string, unknown>;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  introSection?: {
    badge?: string;
    title?: string;
    story?: Record<string, unknown>;
    highlights?: { text: string; id?: string }[];
  };
  credentials?: {
    boxTitle?: string;
    companyType?: string;
    registeredName?: string;
    registrationNumber?: string;
    nationalId?: string;
    economicCode?: string;
    ceo?: string;
    location?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  stats?: {
    id?: string;
    number: string;
    label: string;
    description?: string;
  }[];
  strategicGoals?: {
    id?: string;
    title: string;
    description: string;
    icon?: string;
  }[];
  workstations?: {
    id?: string;
    title: string;
    description: string;
    equipment?: string;
    capacity?: string;
    image?: Media | string;
    icon?: string;
  }[];
  companyGrounds?: {
    id?: string;
    title?: string;
    image: Media | string;
    description?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: Media | string;
  author?: string;
  category?: "centrifugal" | "piston" | "gear" | "maintenance" | "news" | "technical" | string;
  content?: Record<string, unknown>;
  isPublished?: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  id: string;
  siteName?: string;
  siteDescription?: string;
  logo?: Media | string;
  logoDark?: Media | string;
  phone?: string;
  email?: string;
  address?: string;
  aboutText?: string;
  certificates?: {
    image?: Media | string;
    title?: string;
    link?: string;
    id?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  fullName: string;
  company?: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  client?: string;
  location?: string;
  completionDate?: string;
  description?: string;
  featuredImage?: Media | string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  image: Media | string;
  category?: string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo?: Media | string;
  bio?: string;
  linkedin?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhyUsCard {
  id?: string;
  title: string;
  description: string;
  icon: 'engineering' | 'quality' | 'speed' | 'support';
}

export interface CapabilityItem {
  id?: string;
  title: string;
  description: string;
  icon: 'design' | 'manufacturing' | 'testing' | 'quality-ctrl' | 'installation' | 'service';
  size: 'normal' | 'large' | 'tall';
  image?: Media | string;
}

export interface ProcessStep {
  id?: string;
  title: string;
  description: string;
  stepNumber: number;
  icon: 'analysis' | 'design' | 'build' | 'test' | 'deliver';
  duration?: string;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle?: string;
  sectionKey: 'why-us' | 'capabilities' | 'process';
  theme: 'dark' | 'light';
  backgroundImage?: Media | string;
  isActive?: boolean;
  order?: number;
  whyUsCards?: WhyUsCard[];
  capabilityItems?: CapabilityItem[];
  processSteps?: ProcessStep[];
  createdAt?: string;
  updatedAt?: string;
}