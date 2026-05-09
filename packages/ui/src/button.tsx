"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant: "primary" | "secondary";
}
let styles = {
  primary: "bg-blue-500 text-white ",
  secondary: "",
  default: "p-2 rounded",
};
export const Button = ({
  children,
  className,
  variant,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles[variant]} ${className} ${styles["default"]}`}
      {...props}
    >
      {children}
    </button>
  );
};
