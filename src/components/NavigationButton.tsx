import Link from "next/link";
import { ReactNode } from "react";

const style = {
  primary: "bg-light-primary border-light-primary text-light-on-primary",
  "primary-border": "bg-light-surface border-light-outline text-light-primary",
  error: "bg-light-error border-light-error text-light-on-error",
};

interface NavigationButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "primary-border" | "error";
  additionalClasses?: string;
}

const NavigationButton = ({
  children,
  href,
  variant = "primary",
  additionalClasses,
}: NavigationButtonProps) => {
  return (
    <Link
      href={href}
      className={`flex rounded-full  items-center justify-center w-full duration-200 border text-sm cursor-pointer hover:brightness-90 whitespace-nowrap p-2 my-2 font-medium  ${style[variant]} ${additionalClasses}`}
    >
      {children}
    </Link>
  );
};

export { NavigationButton };
