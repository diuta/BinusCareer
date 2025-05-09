import { useFormik } from 'formik';
import { FindAlumniDataForm } from '../Interface/FindAlumniDataInterface';


export interface AccordionProps {
  formik: ReturnType<typeof useFormik<FindAlumniDataForm>>;
  checked: boolean | undefined;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}