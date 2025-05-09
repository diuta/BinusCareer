import { Typography } from '@mui/material';

import { themes } from '../../../styles/mui/theme';
import { ErrorMessageProps } from './ErrorMessageProps';

function ErrorMessage<T>({ name, formik, ...props }: ErrorMessageProps<T>) {
  const showError = formik.touched[name] && formik.errors[name];

  return showError ? (
    <Typography
      variant="label"
      marginTop={1}
      color={themes.palette.error.main}
      {...props}
    >
      {formik.errors[name] as string}
    </Typography>
  ) : null;
}

export default ErrorMessage;
