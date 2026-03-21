// src/features/resumes/types/index.ts

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  template?: 'professional' | 'modern' | 'creative' | 'simple' | 'tech';
  headline?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  
  contact: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };

  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects?: {
      id: string;
      name: string;
      description: string;
      url?: string;
  }[];
  atsScore?: number;
}

export type ResumeFormData = Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
