import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-sage-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isDestructive ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal-900">{title}</h3>
              <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-sage-100">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-charcoal-600 hover:bg-cream-200 rounded-xl transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm transition-colors ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-forest-900 hover:bg-forest-800'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
