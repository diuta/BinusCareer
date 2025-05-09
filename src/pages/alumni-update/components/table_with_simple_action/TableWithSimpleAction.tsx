import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { AnyObject, object, ObjectSchema, string } from 'yup';

import { AlumniContactTableRowProps } from '../../interface/AlumniContact';
import TableComponent from './TableComponent';

interface IIdentityData {
  contact: string;
}

interface TableWithSimpleActionProps extends AlumniContactTableRowProps {
  label: string;
  maxRow: number;
  customValidationSchema?: ObjectSchema<
    { contact: string },
    AnyObject,
    { contact: undefined },
    ''
  >;
  additionalFooterElement?: JSX.Element;
}

export default function TableWithSimpleAction({
  label,
  formikKey,
  maxRow,
  editable,
  formik,
  customValidationSchema,
  additionalFooterElement
}: TableWithSimpleActionProps) {
  const [disabledButton, setDisabledButton] = useState(false);

  const renderedRow = useMemo(
    () => formik.values[formikKey].filter(row => row.shown),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formik.values[formikKey]]
  );

  const contactFormik = useFormik<IIdentityData>({
    initialValues: {
      contact: '',
    },
    onSubmit: values => {
      let updated = false;
      formik.setFieldValue(
        formikKey,
        formik.values[formikKey].map(row => {
          if (row.shown === false && !updated) {
            updated = true;
            return { ...row, data: values.contact, shown: true };
          }
          return row;
        })
      );
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      contactFormik.resetForm();
    },
    validationSchema:
      customValidationSchema ||
      object().shape({
        contact: string().trim().required(`${label} is required`),
      }),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const debounce = useDebouncedCallback((field, value) => {
    contactFormik.setFieldValue(field, value);
    setDisabledButton(false);
  }, 250);

  const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setDisabledButton(true);
    const { name, value } = e.target;
    debounce(name, value);
  };

  return (
    <TableContainer component={Paper} sx={{ paddingBottom: '16px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                variant="label"
                fontWeight={600}
                sx={{ marginBottom: '0 !important' }}
              >
                {label}
              </Typography>
            </TableCell>
            {editable && (
              <TableCell>
                <Typography
                  variant="label"
                  fontWeight={600}
                  sx={{ marginBottom: '0 !important' }}
                >
                  Action
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody sx={{ border: 0 }}>
          <TableComponent
            formik={formik}
            formikKey={formikKey}
            editable={editable}
          />
          {renderedRow.length < maxRow && (
            <TableRow sx={{ 'td, th': { border: 0 } }}>
              <TableCell>
                <TextField
                  name="contact"
                  fullWidth
                  onChange={textFieldChangeHandler}
                  disabled={!editable}
                  error={
                    contactFormik.touched.contact &&
                    Boolean(contactFormik.errors.contact)
                  }
                  inputRef={inputRef}
                  inputProps={{ style: { fontSize: '14px' } }}
                />
                {contactFormik.touched.contact &&
                  contactFormik.errors.contact && (
                    <Typography marginTop={1} variant="label" color="#9F041B">
                      {contactFormik.errors.contact}
                    </Typography>
                  )}
              </TableCell>
              {editable && (
                <TableCell width="10%">
                  <Button
                    variant="contained"
                    onClick={() => {
                      contactFormik.handleSubmit();
                    }}
                    disabled={disabledButton}
                  >
                    <AddCircleOutlineIcon fontSize="small" />
                    <Typography
                      variant="label"
                      sx={{ marginBottom: '0 !important' }}
                      color="white"
                      marginLeft={1}
                    >
                      Add
                    </Typography>
                  </Button>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Box
        component="div"
        paddingLeft={2}
        display="flex"
        flexDirection="column"
      >
        <Typography variant="label" fontWeight={600}>
          *The first {label.toLowerCase()} will be set as your primary{' '}
          {label.toLowerCase()}
        </Typography>
        <Typography variant="label" fontWeight={600}>
          *{label} data will only be saved to the system after the
          &quot;Add&quot; button is clicked
        </Typography>
        {additionalFooterElement}
      </Box>
    </TableContainer>
  );
}
