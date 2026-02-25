export interface CoverLetter {
  id: string;
  userId: string;
  title: string; // e.g., "Cover Letter for Google"
  jobTitle: string;
  company: string;
  jobDescription?: string;
  recipientName?: string;
  recipientRole?: string;
  content: {
    intro: string;
    body: string;
    conclusion: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type CoverLetterFormData = Omit<CoverLetter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
