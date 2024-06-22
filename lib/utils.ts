import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
export type MakeOptional<T, K extends keyof T> = Expand<Omit<T, K> & Partial<Pick<T, K>>>;
