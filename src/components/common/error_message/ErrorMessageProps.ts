import { TypographyProps } from "@mui/material";
import { FormikProps } from "formik";

export interface ErrorMessageProps<T> extends TypographyProps {
  name: string;
  formik: FormikProps<T>;
}
