export type SubmissionActionStatus = "idle" | "success" | "error";

export type SubmissionActionState = {
  status: SubmissionActionStatus;
  message: string;
};

export const initialSubmissionActionState: SubmissionActionState = {
  status: "idle",
  message: "",
};
