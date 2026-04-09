"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

export function Progress({ className, indicatorClassName, value, ...props }) {
  return (
    <ProgressPrimitive.Root
      className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 transition-all ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}