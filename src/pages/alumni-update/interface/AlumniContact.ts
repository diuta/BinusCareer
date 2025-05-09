import { FormikProps } from "formik";

import { UpdateAlumniAlive } from "./Alumni";

export interface AlumniContactTableRowProps {
  editable: boolean;
  formik: FormikProps<UpdateAlumniAlive>;
  formikKey: string;
}
