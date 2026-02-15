import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0f1d3a] text-white shadow-lg shadow-[#0f1d3a]/20 hover:bg-[#1a2d52] hover:shadow-xl hover:shadow-[#0f1d3a]/25",
        destructive:
          "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25",
        outline:
          "border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-sm",
        secondary:
          "bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/20 hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-400/25",
        ghost: "hover:bg-gray-100 text-gray-700",
        link: "text-[#0f1d3a] underline-offset-4 hover:underline",
        survey:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30",
        complaint:
          "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30",
        guest:
          "bg-teal-600 text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs",
        sm: "h-8 rounded-lg gap-1.5 px-3.5",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
