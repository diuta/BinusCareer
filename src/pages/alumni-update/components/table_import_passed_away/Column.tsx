import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { Control, Controller, FormState } from 'react-hook-form';

import { themes } from '../../../../styles/mui/theme';
import { UpdateAlumniPassedAwayImport } from '../../interface/Alumni';
import { ImportFormValues } from '../../interface/Form';

const inputStyling: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '6px',
  fontSize: '14px',
  border: '1px solid #CCCCCC',
  width: '100%',
  maxWidth: '100%',
  height: '1.4375em',
  boxSizing: 'content-box',
};

export default function generateColumnPayload(
  control: Control<any, any>,
  remove: (index) => void,
  refetchAlumni: (
    newValue: string,
    rowIdentifier: 'alumniAlive' | 'alumniPassedAway',
    rowIndex: number
  ) => void,
  formState: FormState<ImportFormValues>
): ColumnDef<UpdateAlumniPassedAwayImport>[] {
  return [
    {
      accessorKey: 'alumniNIM',
      header: 'NIM',
      cell: info => (
        <>
          <Controller
            control={control}
            name={`alumniPassedAway[${info.row.index}].alumniNIM`}
            defaultValue={info.getValue()}
            render={({ field }) => (
              <div style={{ display: 'inline-flex' }}>
                <input
                  style={inputStyling}
                  {...field}
                  onChange={e => {
                    field.onChange(e);

                    const newValue = e.target.value;

                    if (newValue !== field.value) {
                      refetchAlumni(
                        newValue,
                        'alumniPassedAway',
                        info.row.index
                      );
                    }
                  }}
                />
              </div>
            )}
          />

          {formState.errors.alumniPassedAway?.[info.row.index]?.alumniNIM
            ?.message && (
            <Typography
              variant="label"
              color={themes.palette.error.main}
              display="block"
            >
              {
                formState.errors.alumniPassedAway?.[info.row.index]?.alumniNIM
                  ?.message
              }
            </Typography>
          )}
        </>
      ),
    },
    {
      accessorKey: 'alumniName',
      header: 'Name',
      cell: info => (
        <Controller
          control={control}
          name={`alumniPassedAway[${info.row.index}].alumniName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input
                style={{ ...inputStyling, background: '#D6D6D6' }}
                {...field}
                disabled
              />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'campusName',
      header: 'Campus',
      cell: info => (
        <Controller
          control={control}
          name={`alumniPassedAway[${info.row.index}].campusName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input
                style={{ ...inputStyling, background: '#D6D6D6' }}
                {...field}
                disabled
              />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'facultyName',
      header: 'Faculty',
      cell: info => (
        <Controller
          control={control}
          name={`alumniPassedAway[${info.row.index}].facultyName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input
                style={{ ...inputStyling, background: '#D6D6D6' }}
                {...field}
                disabled
              />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'programName',
      header: 'Program',
      cell: info => (
        <Controller
          control={control}
          name={`alumniPassedAway[${info.row.index}].programName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input
                style={{ ...inputStyling, background: '#D6D6D6' }}
                {...field}
                disabled
              />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'degreeName',
      header: 'Degree',
      cell: info => (
        <Controller
          control={control}
          name={`alumniPassedAway[${info.row.index}].degreeName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input
                style={{ ...inputStyling, background: '#D6D6D6' }}
                {...field}
                disabled
              />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'evidence',
      header: 'Evidence',
      cell: info => (
        <>
          <Controller
            control={control}
            name={`alumniPassedAway[${info.row.index}].evidence`}
            defaultValue={info.getValue()}
            render={({ field }) => (
              <div style={{ display: 'inline-flex' }}>
                <input style={{ ...inputStyling }} {...field} />
              </div>
            )}
          />
          {formState.errors.alumniPassedAway?.[info.row.index]?.evidence
            ?.message && (
            <Typography
              variant="label"
              color={themes.palette.error.main}
              display="block"
            >
              {
                formState.errors.alumniPassedAway?.[info.row.index]?.evidence
                  ?.message
              }
            </Typography>
          )}
        </>
      ),
    },
    {
      accessorKey: '',
      header: 'Action',
      cell: info => (
        <Button
          variant="contained"
          sx={{
            borderRadius: '999px',
            minWidth: 'fit-content',
            width: '36px',
            height: '36px',
            padding: 0,
          }}
          size="small"
          onClick={() => {
            remove(info.row.index);
          }}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
      size: 1,
    },
  ];
}
