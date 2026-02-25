import { db } from '@/lib/firebase';
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    query, 
    where
} from 'firebase/firestore';
import type { Resume, ResumeFormData } from '../types';

const RESUMES_COLLECTION = 'resumes';

export const resumeService = {
    // Create a new resume
    createResume: async (userId: string, data: ResumeFormData): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, RESUMES_COLLECTION), {
                userId,
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating resume:', error);
            throw error;
        }
    },

    // Get all resumes for a user
    getUserResumes: async (userId: string): Promise<Resume[]> => {
        try {
            const q = query(
                collection(db, RESUMES_COLLECTION), 
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Resume));
        } catch (error) {
            console.error('Error fetching user resumes:', error);
            throw error;
        }
    },

    // Get a single resume by ID
    getResumeById: async (resumeId: string): Promise<Resume | null> => {
        try {
            const docRef = doc(db, RESUMES_COLLECTION, resumeId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Resume;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching resume:', error);
            throw error;
        }
    },

    // Update an existing resume
    updateResume: async (resumeId: string, data: Partial<ResumeFormData>): Promise<void> => {
        try {
            const docRef = doc(db, RESUMES_COLLECTION, resumeId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating resume:', error);
            throw error;
        }
    },

    // Delete a resume
    deleteResume: async (resumeId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, RESUMES_COLLECTION, resumeId));
        } catch (error) {
            console.error('Error deleting resume:', error);
            throw error;
        }
    }
};
