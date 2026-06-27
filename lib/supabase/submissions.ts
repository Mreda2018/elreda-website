import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type {
  Locale,
  SubmissionInsert,
  SubmissionRow,
  SubmissionType,
} from "@/lib/supabase/types";

type CreateSubmissionInput = {
  type: SubmissionType;
  data: SubmissionInsert["data"];
  locale: Locale;
};

type UpdateSubmissionEmailStatusInput =
  | {
      id: string;
      emailSent: true;
      emailError?: null;
    }
  | {
      id: string;
      emailSent: false;
      emailError: string;
    };

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<SubmissionRow> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      type: input.type,
      data: input.data,
      locale: input.locale,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to persist submission: ${error.message}`);
  }

  return data;
}

export async function updateSubmissionEmailStatus(
  input: UpdateSubmissionEmailStatusInput,
): Promise<void> {
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from("submissions")
    .update({
      email_sent: input.emailSent,
      email_error: input.emailError ?? null,
    })
    .eq("id", input.id);

  if (error) {
    throw new Error(`Failed to update submission email status: ${error.message}`);
  }
}
