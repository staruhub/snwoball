// Utility exports
export * from "./cache";
export * from "./accessibility";
export * from "./apiLogger";

// Classnames utility for Tailwind CSS
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
