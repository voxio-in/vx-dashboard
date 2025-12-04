import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  onContinue,
  onCancel,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-full bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400 flex items-center justify-center mb-1">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Unsaved Changes
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You have unsaved changes. If you leave this page now, your changes
              will be lost.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-11 font-semibold border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Stay
            </Button>
            <Button
              onClick={onContinue}
              className="h-11 font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
            >
              Discard & Leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
