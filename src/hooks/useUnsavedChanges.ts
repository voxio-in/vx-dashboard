import { useEffect } from "react";
import { useUnsavedChangesContext } from "@/context/UnsavedChangesContext";

export function useUnsavedChanges(isDirty: boolean) {
  const { setIsDirty } = useUnsavedChangesContext();

  useEffect(() => {
    setIsDirty(isDirty);
    return () => setIsDirty(false);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
