import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Reward } from "@/lib/rewards-data";

interface RedeemDialogProps {
  reward: Reward | null;
  open: boolean;
  isSubmitting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const RedeemDialog = ({ reward, open, isSubmitting = false, onConfirm, onCancel }: RedeemDialogProps) => (
  <AlertDialog
    open={open}
    onOpenChange={(o) => {
      if (!o && !isSubmitting) onCancel();
    }}
  >
    <AlertDialogContent className="ui-alert-content--rounded">
      <AlertDialogHeader>
        <AlertDialogTitle className="ui-alert-title--xl">Redeem {reward?.name}?</AlertDialogTitle>
        <AlertDialogDescription>
          This will deduct <strong>{reward?.cost.toLocaleString()} pts</strong> from your balance. This action cannot be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="ui-button--pill" disabled={isSubmitting}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            void onConfirm();
          }}
          className="ui-button--pill"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Working…" : "Confirm"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default RedeemDialog;
