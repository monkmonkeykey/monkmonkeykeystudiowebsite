import type { HTMLAttributes } from "react";

type WordmarkVariant = "color" | "light" | "dark";

type WordmarkProps = Omit<HTMLAttributes<HTMLSpanElement>, "aria-label"> & {
  variant?: WordmarkVariant;
};

const variantClasses: Record<WordmarkVariant, string> = {
  color: "wordmark--color",
  light: "wordmark--light",
  dark: "wordmark--dark",
};

export function Wordmark({
  variant = "color",
  className = "",
  ...props
}: WordmarkProps) {
  return (
    <span
      {...props}
      className={`wordmark ${variantClasses[variant]} ${className}`.trim()}
      aria-label="monkmonkeykey"
    >
      <span aria-hidden="true">monk</span>
      <span aria-hidden="true">monkey</span>
      <span aria-hidden="true">key</span>
    </span>
  );
}
