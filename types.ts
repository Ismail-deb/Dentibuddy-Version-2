import type React from 'react';

export type Language = 'en' | 'af' | 'xh' | 'zu';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored for fake auth, not for production
}

export type Page =
  | "home"
  | "chat"
  | "learn"
  | "directory"
  | "tracker"
  | "community"
  | "profile"
  | "auth";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface SymptomLog {
  id: string;
  userId: string;
  date: string;
  symptoms: string[];
  severity: number;
  notes?: string;
}

export interface Article {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: number;
  image: string;
  content: string;
  infographic?: React.FC;
}

export interface DirectoryResource {
  id: string;
  name: string;
  address: string;
  province: 'Western Cape' | 'Gauteng' | 'KwaZulu-Natal' | 'Eastern Cape' | 'Free State' | 'Limpopo' | 'Mpumalanga' | 'North West' | 'Northern Cape' | 'Nationwide';
  category: 'Public Dental Clinic' | 'Community Health Center' | 'Emergency Dental Service' | 'NGO Healthcare Provider' | 'Crisis Helpline';
  type: string;
  hours?: string;
  services: string;
  phone: string;
  image: string;
  isHelpline?: boolean;
}

export interface CommunityReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  replies: CommunityReply[];
}