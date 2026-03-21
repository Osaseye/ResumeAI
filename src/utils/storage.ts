import { auth } from '@/lib/firebase';

export const storage = {
    getKey: (key: string) => {
        const uid = auth.currentUser?.uid;
        return uid ? `${key}_${uid}` : key;
    },
    getItem: (key: string) => {
        return localStorage.getItem(storage.getKey(key));
    },
    getRawItem: (key: string) => {
        return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        localStorage.setItem(storage.getKey(key), value);
    },
    removeItem: (key: string) => {
        localStorage.removeItem(storage.getKey(key));
    },
    clearUserStorage: () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.endsWith(`_${uid}`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    },
    get length() {
        return localStorage.length;
    },
    key: (index: number) => {
        return localStorage.key(index);
    },
    isKeyForCurrentUser: (key: string | null) => {
        if (!key) return false;
        const uid = auth.currentUser?.uid;
        if (!uid) {
            // If not logged in, user storage isn't properly defined, but fallback to no-suffix check
            return !key.includes('_'); 
        }
        return key.endsWith(`_${uid}`);
    }
};