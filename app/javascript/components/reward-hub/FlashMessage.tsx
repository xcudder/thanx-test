import { useEffect } from "react";
import type { FlashMessageProps } from "@/types/reward-hub";

const FlashMessage = ({ flash, onDismiss }: FlashMessageProps) => {
  useEffect(() => {
    if (!flash) return;
    const id = window.setTimeout(onDismiss, 8000);
    return () => window.clearTimeout(id);
  }, [flash, onDismiss]);

  if (!flash) return null;

  return (
    <div role="status" className={`rh-flash rh-flash--${flash.variant}`}>
      <div className="rh-flash__body">
        <strong className="rh-flash__title">{flash.title}</strong>
        {flash.description ? <p className="rh-flash__desc">{flash.description}</p> : null}
      </div>
      <button type="button" className="rh-flash__close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

export default FlashMessage;
