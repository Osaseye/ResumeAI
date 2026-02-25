import { db } from '@/lib/firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    getDoc, 
    query, 
    where
} from 'firebase/firestore';
import type { CoverLetter, CoverLetterFormData } from '../types';

const COLLECTION_NAME = 'coverLetters';

export const coverLetterService = {
    // Create new cover letter
    createCoverLetter: async (userId: string, data: CoverLetterFormData): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                userId,
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating cover letter:', error);
            throw error;
        }
    },

    // Get all cover letters for a user
    getUserCoverLetters: async (userId: string): Promise<CoverLetter[]> => {
        try {
            const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CoverLetter));
        } catch (error) {
            console.error('Error getting cover letters:', error);
            throw error;
        }
    },

    // Get single cover letter
    getCoverLetterById: async (id: string): Promise<CoverLetter | null> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as CoverLetter;
            }
            return null;
        } catch (error) {
            console.error('Error getting cover letter:', error);
            throw error;
        }
    },

    // Update cover letter
    updateCoverLetter: async (id: string, data: Partial<CoverLetterFormData>): Promise<void> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating cover letter:', error);
            throw error;
        }
    },

    // Delete cover letter
    deleteCoverLetter: async (id: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error('Error deleting cover letter:', error);
            throw error;
        }
    }
};
