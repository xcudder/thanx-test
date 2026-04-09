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
  onConfirm: () => void;
  onCancel: () => void;
}

const RedeemDialog = ({ reward, open, onConfirm, onCancel }: RedeemDialogProps) => (
  <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
    <AlertDialogContent className="ui-alert-content--rounded">
      <AlertDialogHeader>
        <AlertDialogTitle className="ui-alert-title--xl">Redeem {reward?.name}?</AlertDialogTitle>
        <AlertDialogDescription>
          This will deduct <strong>{reward?.cost.toLocaleString()} pts</strong> from your balance. This action cannot be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="ui-button--pill">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="ui-button--pill">
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default RedeemDialog;
