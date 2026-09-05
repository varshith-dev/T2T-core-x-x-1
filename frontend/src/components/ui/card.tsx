import * as React from "react";
import { cn } from "@/lib/utils";

type Div = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, Div>(({ className, ...p }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...p} />
));
Card.displayName = "Card";

export const CardHeader = ({ className, ...p }: Div) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...p} />
);
export const CardTitle = ({ className, ...p }: Div) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...p} />
);
export const CardDescription = ({ className, ...p }: Div) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...p} />
);
export const CardContent = ({ className, ...p }: Div) => (
  <div className={cn("p-6 pt-0", className)} {...p} />
);
export const CardFooter = ({ className, ...p }: Div) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...p} />
);
