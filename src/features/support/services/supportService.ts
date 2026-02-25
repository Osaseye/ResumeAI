import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface SupportTicket {
    userId: string;
    userEmail: string;
    subject: string;
    message: string;
    status: 'new' | 'assigned' | 'resolved';
    createdAt: string;
}

const COLLECTION_NAME = 'support_tickets';

export const supportService = {
    createTicket: async (ticket: Omit<SupportTicket, 'createdAt' | 'status'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...ticket,
                status: 'new',
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating support ticket:', error);
            throw error;
        }
    }
};
