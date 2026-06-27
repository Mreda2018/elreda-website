export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Locale = "ar" | "en";

export type SubmissionType = "quote" | "contact" | "consultation";

export type SubmissionInsert = {
  type: SubmissionType;
  data: Json;
  locale: Locale;
  email_sent?: boolean | null;
  email_error?: string | null;
};

export type SubmissionRow = {
  id: string;
  type: SubmissionType;
  data: Json;
  locale: Locale;
  email_sent: boolean | null;
  email_error: string | null;
  created_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: SubmissionRow;
        Insert: SubmissionInsert;
        Update: Partial<
          Pick<SubmissionRow, "data" | "email_sent" | "email_error" | "locale" | "type">
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
