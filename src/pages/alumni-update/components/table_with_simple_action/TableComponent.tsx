import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { themes } from '../../../../styles/mui/theme';
import { AlumniContactTableRowProps } from '../../interface/AlumniContact';

export default function TableComponent({
  formik,
  formikKey,
  editable,
}: AlumniContactTableRowProps) {
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleDelete = (id: string) => {
    const contactRow = formik.values[formikKey];
    const deleteIndex = contactRow.findIndex(row => row.id === id);

    const updatedRows = contactRow.map((row, index) => {
      if (index >= deleteIndex && index < contactRow.length - 1) {
        return {
          ...row,
          data: contactRow[index + 1].data,
          shown: contactRow[index + 1].shown,
        };
      }

      if (index === contactRow.length - 1) {
        return { ...row, data: '', shown: false };
      }

      return row;
    });

    formik.setFieldValue(formikKey, updatedRows);
  };

  const debounce = useDebouncedCallback((field, value) => {
    formik.setFieldValue(formikKey,
      formik.values[formikKey].map(row =>
        row.id === field ? { ...row, data: value, generatedBySystem: false } : row
      )
    );
  }, 250);

  const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const { name, value } = e.target;
    debounce(name, value);
  };

  const renderedRow = useMemo(
    () => formik.values[formikKey].filter(row => row.shown),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formik.values[formikKey]]
  );

  useEffect(() => {
    Object.keys(inputRefs.current).forEach(key => {
      const inputRef = inputRefs.current[key];
      if (inputRef) {
        inputRef.value = String(formik.values[formikKey][key].data);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[formikKey]]);

  return (
    <>
      {renderedRow.map((row, index) => (
        <TableRow key={row.id} sx={{ 'td, th': { border: 0 } }}>
          <TableCell>
            <TextField
              inputRef={el => (inputRefs.current[index] = el)}
              name={row.id}
              sx={{
                '& .binus-OutlinedInput-root': {
                  color: row.generatedBySystem
                    ? themes.palette.primary.main
                    : '',
                },
              }}
              fullWidth
              onChange={textFieldChangeHandler}
              disabled={!editable}
              error={Boolean(
                formik.errors[formikKey]?.[index]?.data &&
                  formik.touched[formikKey]?.[index]
              )}
            />

            {formik.touched[formikKey]?.[index] &&
              formik.errors[formikKey]?.[index] && (
                <Typography marginTop={1} fontSize={14} color="#9F041B">
                  {formik.errors[formikKey]?.[index].data}
                </Typography>
              )}
          </TableCell>
          {editable && (
            <TableCell width="10%">
              <Button
                variant="contained"
                sx={{
                  borderRadius: '999px',
                  width: '36px',
                  height: '36px',
                  minWidth: 'fit-content',
                  padding: 0,
                }}
                onClick={() => handleDelete(row.id)}
              >
                <DeleteIcon />
              </Button>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
