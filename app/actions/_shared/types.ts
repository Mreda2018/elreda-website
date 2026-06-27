import type { Locale } from "@/lib/supabase/types";

export type ActionErrorCode =
  | "VALIDATION_ERROR"
  | "BOT_VERIFICATION_FAILED"
  | "RATE_LIMITED"
  | "STORAGE_ERROR"
  | "EMAIL_ERROR"
  | "UNKNOWN_ERROR";

export type ActionResult<TData = undefined> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      error: string;
      code: ActionErrorCode;
    };

export type FormActionContext = {
  locale: Locale;
  ipAddress: string;
};
