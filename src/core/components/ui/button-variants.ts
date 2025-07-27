import { cva } from "class-variance-authority";
import * as React from "react";
import { type VariantProps } from "class-variance-authority";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input text-primary bg-background hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-[image:var(--primary-gradient-horizontal)] text-primary-foreground hover:opacity-90",
        gradientVertical: "bg-[image:var(--primary-gradient-vertical)] text-primary-foreground hover:opacity-90",
        inputStyle:
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        concertPageTab: [
          "bg-transparent",
          "font-normal",
          "text-[24px]",
          "leading-[120%]",
          "tracking-[0.05em]",
          "text-[#262626]",
          "text-center",
          "px-6",
          "py-2",
          "rounded",
          "hover:bg-white",
          "hover:shadow-sm",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-blue-200",
          "font-['Noto_Sans_TC']",
        ].join(" "),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-11 rounded-md px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
