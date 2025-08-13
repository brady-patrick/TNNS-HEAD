import React from "react";
import { X } from "lucide-react";
import { Button } from "./base";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function FullScreenModal({ isOpen, onClose, children, title, showHeader = true }: FullScreenModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background w-[90vw] h-[90vh] rounded-lg shadow-2xl flex flex-col relative">
        {/* Close button - always visible in top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 p-0 z-10 bg-white/90 hover:bg-white shadow-sm border border-gray-200"
        >
          <X className="h-5 w-5" />
        </Button>
        
        {/* Optional Header */}
        {showHeader && (
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-2xl font-semibold text-gray-900">{title || "Modal"}</h1>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
