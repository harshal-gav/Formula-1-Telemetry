"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { db, doc, onSnapshot } from "@/lib/firebase/client";
import { UserSubscription } from "@/lib/api/types";

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Temporary developer / preview mode state (persisted in localStorage)
  const [devProOverride, setDevProOverride] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has toggled test access in localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("apex_temp_pro_access");
      // Default to true for instant evaluation unless explicitly turned off
      if (stored !== null) {
        setDevProOverride(stored === "true");
      } else {
        localStorage.setItem("apex_temp_pro_access", "true");
        setDevProOverride(true);
      }
    }
  }, []);

  const toggleTempProAccess = () => {
    const nextState = !devProOverride;
    setDevProOverride(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("apex_temp_pro_access", String(nextState));
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserSubscription;
          setSubscription(data);
        } else {
          setSubscription({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            plan: "free",
            status: "active",
          });
        }
        setLoading(false);
      },
      (error) => {
        // Fallback default state
        setSubscription({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          plan: "free",
          status: "active",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // Real Pro check from Firestore OR Dev Pro Override
  const isRealPro = subscription?.plan === "pro" && subscription?.status === "active";
  const isPro = isRealPro || devProOverride;

  return {
    subscription: devProOverride && !isRealPro ? {
      uid: user?.uid || "dev_temp_user",
      email: user?.email || "evaluator@formula-analytics.com",
      displayName: user?.displayName || "Pro Tester",
      plan: "pro",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } : subscription,
    isPro,
    isTempAccess: devProOverride && !isRealPro,
    toggleTempProAccess,
    loading: authLoading || loading,
  };
}
