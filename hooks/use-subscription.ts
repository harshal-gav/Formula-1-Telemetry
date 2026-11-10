"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { db, doc, onSnapshot } from "@/lib/firebase/client";
import { UserSubscription } from "@/lib/api/types";

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    subscription?.plan === "pro" &&
    subscription?.status === "active" &&
    isPeriodValid
  );

  return {
    subscription,
    isPro,
    isTempAccess: false,
    toggleTempProAccess: () => {},
    loading: authLoading || loading,
  };
}
