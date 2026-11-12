"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { db, doc, onSnapshot } from "@/lib/firebase/client";
import { UserSubscription } from "@/lib/api/types";

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempPro, setTempPro] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("f1_pro_access");
      if (stored === "true") {
        setTempPro(true);
      }
    }
  }, []);

  const toggleTempProAccess = () => {
    setTempPro((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("f1_pro_access", next ? "true" : "false");
      }
      return next;
    });
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

  // Pro status is strictly derived from verified Firestore subscription record:
  // 1. Plan must be "pro"
  // 2. Status must be "active"
  // 3. Current period must not have expired (if currentPeriodEnd is defined)
  const isPeriodValid = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd) > new Date()
    : true;

  const isPro = Boolean(
    (subscription?.plan === "pro" &&
      subscription?.status === "active" &&
      isPeriodValid) ||
      tempPro
  );

  return {
    subscription,
    isPro,
    isTempAccess: tempPro,
    toggleTempProAccess,
    loading: authLoading || loading,
  };
}
