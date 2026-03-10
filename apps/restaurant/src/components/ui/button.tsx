"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background hover:bg-primary-hover",
        gold:
          "bg-gold text-background hover:bg-gold-muted",
        outline:
          "border-primary text-primary hover:bg-primary/10",
        ghost:
          "text-muted hover:text-foreground hover:bg-surface",
        destructive:
          "bg-destructive text-background hover:bg-destructive/90",
        link:
          "text-primary underline-offset-4 hover:underline",
        secondary:
          "bg-surface text-foreground hover:bg-surface-elevated",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4",
        xs: "h-6 gap-1 rounded-[min(var(--radius),10px)] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius),12px)] px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-6 text-base",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius),12px)]",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
