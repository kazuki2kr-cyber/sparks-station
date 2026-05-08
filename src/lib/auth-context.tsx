"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    signInAnonymously,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginAnonymously: () => Promise<void>;
    loginWithGoogle: () => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginAnonymously = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            return true;
        } catch (error) {
            const code = typeof error === "object" && error && "code" in error
                ? String((error as { code?: unknown }).code)
                : "";
            if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
                await signInWithRedirect(auth, provider);
                return false;
            }
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginAnonymously, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
