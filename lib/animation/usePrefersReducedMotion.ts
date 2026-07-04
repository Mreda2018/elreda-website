"use client";

import { useSyncExternalStore } from "react";

import {
  createReducedMotionListener,
  prefersReducedMotion,
} from "./preferences";

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    createReducedMotionListener,
    prefersReducedMotion,
    () => true,
  );
}
