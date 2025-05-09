export type ErrorSlice = {
  title: string;
  type: "success" | "failed" | "info";
  message: string;
};