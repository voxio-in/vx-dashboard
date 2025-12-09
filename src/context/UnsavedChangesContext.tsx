"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UnsavedChangesModal } from "@/components/modals/UnsavedChangesModal";

interface UnsavedChangesContextType {
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;

  proceedWithAction: (action: () => void) => void;
}

const UnsavedChangesContext = createContext<
  UnsavedChangesContextType | undefined
>(undefined);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const proceedWithAction = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setPendingAction(() => action);
        setShowModal(true);
      } else {
        action();
      }
    },
    [isDirty]
  );

  const handleContinue = () => {
    setShowModal(false);
    setIsDirty(false); 
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingAction(null);
  };

  return (
    <UnsavedChangesContext.Provider
      value={{ isDirty, setIsDirty, proceedWithAction }}
    >
      {children}
      <UnsavedChangesModal
        isOpen={showModal}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesContext() {
  const context = useContext(UnsavedChangesContext);
  if (!context)
    throw new Error("useUnsavedChangesContext must be used within provider");
  return context;
}
