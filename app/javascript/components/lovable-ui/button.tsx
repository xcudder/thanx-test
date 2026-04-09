import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cx } from "@/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClass: Record<ButtonVariant, string> = {
  default: "ui-button--default",
  destructive: "ui-button--destructive",
  outline: "ui-button--outline",
  secondary: "ui-button--secondary",
  ghost: "ui-button--ghost",
  link: "ui-button--link",
};

const sizeClass: Record<ButtonSize, string> = {
  default: "ui-button--default-size",
  sm: "ui-button--sm",
  lg: "ui-button--lg",
  icon: "ui-button--icon",
};

export function buttonClassNames(
  variant: ButtonVariant = "default",
  size: ButtonSize = "default",
  className?: string,
) {
  return cx("ui-button", variantClass[variant], sizeClass[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={buttonClassNames(variant, size, className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button };
