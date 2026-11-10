"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GRAND_PRIX_LIST, GrandPrixCircuit } from "@/lib/grand-prix";

interface GPContextType {
  selectedGP: GrandPrixCircuit;
  setSelectedGPId: (id: string) => void;
  allGPs: GrandPrixCircuit[];
}

const GPContext = createContext<GPContextType>({
  selectedGP: GRAND_PRIX_LIST[0],
  setSelectedGPId: () => {},
  allGPs: GRAND_PRIX_LIST,
});

export function GPProvider({ children }: { children: ReactNode }) {
  const [selectedGPId, setSelectedGPIdState] = useState<string>("sakhir");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("f1_selected_gp") || localStorage.getItem("apex_selected_gp");
      if (saved && GRAND_PRIX_LIST.some((gp) => gp.id === saved)) {
        setSelectedGPIdState(saved);
      }
    }
  }, []);

  const setSelectedGPId = (id: string) => {
    setSelectedGPIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("f1_selected_gp", id);
    }
  };

  const selectedGP = GRAND_PRIX_LIST.find((gp) => gp.id === selectedGPId) || GRAND_PRIX_LIST[0];

  return (
    <GPContext.Provider
      value={{
        selectedGP,
        setSelectedGPId,
        allGPs: GRAND_PRIX_LIST,
      }}
    >
      {children}
    </GPContext.Provider>
  );
}

export function useGP() {
  return useContext(GPContext);
}

