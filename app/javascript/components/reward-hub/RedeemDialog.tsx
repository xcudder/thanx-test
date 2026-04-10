import { useEffect } from "react";
import type { RedeemDialogProps } from "@/types/reward-hub";

const RedeemDialog = ({ reward, open, isSubmitting = false, onConfirm, onCancel }: RedeemDialogProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isSubmitting, onCancel]);

  if (!open || !reward) return null;

  return (
    <div className="rh-modal-backdrop" role="presentation" onClick={() => !isSubmitting && onCancel()}>
      <div
        className="rh-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rh-redeem-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rh-redeem-title" className="rh-modal__title">
          Redeem {reward.name}?
        </h2>
        <p className="rh-modal__text">
          This will deduct <strong>{reward.point_cost.toLocaleString()} pts</strong> from your balance. This cannot be
          undone.
        </p>
        <div className="rh-modal__actions">
          <button type="button" className="rh-btn rh-btn--secondary" disabled={isSubmitting} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="rh-btn rh-btn--primary" disabled={isSubmitting} onClick={() => void onConfirm()}>
            {isSubmitting ? "Working…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemDialog;
