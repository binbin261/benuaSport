"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import type { AppUser } from "@/lib/types";

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ firebaseUser: null, appUser: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        setAppUser(null);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    const unsubDoc = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
      const data = snap.data();
      setAppUser({
        uid: firebaseUser.uid,
        name: data?.name ?? firebaseUser.displayName ?? "Pengguna",
        email: firebaseUser.email,
        phone: data?.phone ?? firebaseUser.phoneNumber ?? null,
        isAdmin: data?.isAdmin === true,
      });
      setLoading(false);
    });
    return () => unsubDoc();
  }, [firebaseUser]);

  return <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
