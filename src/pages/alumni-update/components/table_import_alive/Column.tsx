import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Link, Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FormState,
} from 'react-hook-form';

import SingleSelect from '../../../../components/common/singleselect/SingleSelect';
import { Option } from '../../../../interfaces/ITypes';
import { themes } from '../../../../styles/mui/theme';
import { UpdateAlumniAliveImport } from '../../interface/Alumni';
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
  companyCategory: Option[],
  sector: Option[],
  jobCategory: Option[],
  positionLevel: Option[],
  country: Option[],
  province: Option[],
  city: Option[],
  control: Control<any, any>,
  remove: (index) => void,
  refetchAlumni: (
    newValue: string,
    rowIdentifier: 'alumniAlive' | 'alumniPassedAway',
    rowIndex: number
  ) => void,
  formState: FormState<ImportFormValues>,
  setIsModalCityOpen: (value) => void,
  setValue: (index: number, value: UpdateAlumniAliveImport) => void,
  setSelectedCountryId: (value: string) => void,
  fields: FieldArrayWithId<ImportFormValues, 'alumniAlive', 'id'>[]
): ColumnDef<UpdateAlumniAliveImport>[] {
  return [
    {
      accessorKey: 'alumniNIM',
      header: 'NIM',
      size: 200,
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].alumniNIM`}
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
                    refetchAlumni(newValue, 'alumniAlive', info.row.index);
                  }
                }}
              />

              {formState.errors.alumniAlive?.[info.row.index]?.alumniNIM
                ?.message && (
                <Typography variant="label" color={themes.palette.error.main}>
                  {
                    formState.errors.alumniAlive?.[info.row.index]?.alumniNIM
                      ?.message
                  }
                </Typography>
              )}
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'alumniName',
      size: 200,
      header: 'Name',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].alumniName`}
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
      size: 200,
      header: 'Campus',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].campusName`}
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
      size: 200,
      header: 'Faculty',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].facultyName`}
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
      size: 200,
      header: 'Program',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].programName`}
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
      size: 200,
      header: 'Degree',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].degreeName`}
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
      accessorKey: 'email',
      size: 200,
      id: 'email_1',
      header: 'Email 1',
      cell: info => {
        const errorEmailMessage =
          formState.errors.alumniAlive?.[info.row.index]?.email?.message ||
          formState.errors.alumniAlive?.[info.row.index]?.email?.[0]?.data
            ?.message;

        return (
          <div>
            <Controller
              control={control}
              name={`alumniAlive[${info.row.index}].email[0].data`}
              defaultValue={info.getValue()}
              render={({ field }) => (
                <div style={{ display: 'inline-flex' }}>
                  <input style={inputStyling} {...field} />
                </div>
              )}
            />

            {errorEmailMessage && (
              <Typography variant="label" color={themes.palette.error.main}>
                {errorEmailMessage}
              </Typography>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      size: 200,
      id: 'email_2',
      header: 'Email 2',
      cell: info => {
        const errorEmailMessage =
          formState.errors.alumniAlive?.[info.row.index]?.email?.message ||
          formState.errors.alumniAlive?.[info.row.index]?.email?.[1]?.data
            ?.message;

        return (
          <>
            <Controller
              control={control}
              name={`alumniAlive[${info.row.index}].email[1].data`}
              defaultValue={info.getValue()}
              render={({ field }) => (
                <div style={{ display: 'inline-flex' }}>
                  <input style={inputStyling} {...field} />
                </div>
              )}
            />

            {errorEmailMessage && (
              <Typography variant="label" color={themes.palette.error.main}>
                {errorEmailMessage}
              </Typography>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'email',
      size: 200,
      id: 'email_3',
      header: 'Email 3',
      cell: info => {
        const errorEmailMessage =
          formState.errors.alumniAlive?.[info.row.index]?.email?.message ||
          formState.errors.alumniAlive?.[info.row.index]?.email?.[2]?.data
            ?.message;

        return (
          <>
            <Controller
              control={control}
              name={`alumniAlive[${info.row.index}].email[2].data`}
              defaultValue={info.getValue()}
              render={({ field }) => (
                <div style={{ display: 'inline-flex' }}>
                  <input style={inputStyling} {...field} />
                </div>
              )}
            />

            {errorEmailMessage && (
              <Typography variant="label" color={themes.palette.error.main}>
                {errorEmailMessage}
              </Typography>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'phone',
      size: 200,
      id: 'phone_1',
      header: 'Phone 1',
      cell: info => {
        const errorPhoneMessage =
          formState.errors.alumniAlive?.[info.row.index]?.phone?.message ||
          formState.errors.alumniAlive?.[info.row.index]?.phone?.[0]?.data
            ?.message;

        return (
          <>
            <Controller
              control={control}
              name={`alumniAlive[${info.row.index}].phone[0].data`}
              defaultValue={info.getValue()}
              render={({ field }) => (
                <div style={{ display: 'inline-flex' }}>
                  <input style={inputStyling} {...field} />
                </div>
              )}
            />

            {errorPhoneMessage && (
              <Typography variant="label" color={themes.palette.error.main}>
                {errorPhoneMessage}
              </Typography>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'phone',
      size: 200,
      id: 'phone_2',
      header: 'Phone 2',
      cell: info => {
        const errorPhoneMessage =
          formState.errors.alumniAlive?.[info.row.index]?.phone?.message ||
          formState.errors.alumniAlive?.[info.row.index]?.phone?.[1]?.data
            ?.message;

        return (
          <>
            <Controller
              control={control}
              name={`alumniAlive[${info.row.index}].phone[1].data`}
              defaultValue={info.getValue()}
              render={({ field }) => (
                <div style={{ display: 'inline-flex' }}>
                  <input style={inputStyling} {...field} />
                </div>
              )}
            />

            {errorPhoneMessage && (
              <Typography variant="label" color={themes.palette.error.main}>
                {errorPhoneMessage}
              </Typography>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'companyCategoryId',
      size: 300,
      header: 'Company Category',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].companyCategoryId`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <>
              <SingleSelect {...field} data={companyCategory} />

              {formState.errors.alumniAlive?.[info.row.index]?.companyCategoryId
                ?.message && (
                <Typography variant="label" color={themes.palette.error.main}>
                  {
                    formState.errors.alumniAlive?.[info.row.index]
                      ?.companyCategoryId?.message
                  }
                </Typography>
              )}
            </>
          )}
        />
      ),
    },
    {
      accessorKey: 'sectorId',
      size: 300,
      header: 'Sector',
      cell: info => (
        <>
          <Controller
            control={control}
            name={`alumniAlive[${info.row.index}].sectorId`}
            defaultValue={info.getValue()}
            render={({ field }) => <SingleSelect {...field} data={sector} />}
          />

          {formState.errors.alumniAlive?.[info.row.index]?.sectorId
            ?.message && (
            <Typography variant="label" color={themes.palette.error.main}>
              {
                formState.errors.alumniAlive?.[info.row.index]?.sectorId
                  ?.message
              }
            </Typography>
          )}
        </>
      ),
    },
    {
      accessorKey: 'companyName',
      size: 200,
      header: 'Company Name',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].companyName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input style={inputStyling} {...field} />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'jobCategoryId',
      size: 300,
      header: 'Job Category',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].jobCategoryId`}
          defaultValue={info.getValue()}
          render={({ field }) => <SingleSelect {...field} data={jobCategory} />}
        />
      ),
    },
    {
      accessorKey: 'positionLevelId',
      size: 300,
      header: 'Position Level',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].positionLevelid`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <SingleSelect {...field} data={positionLevel} />
          )}
        />
      ),
    },
    {
      accessorKey: 'positionName',
      size: 200,
      header: 'Position',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.index}].positionName`}
          defaultValue={info.getValue()}
          render={({ field }) => (
            <div style={{ display: 'inline-flex' }}>
              <input style={inputStyling} {...field} />
            </div>
          )}
        />
      ),
    },
    {
      accessorKey: 'countryId',
      size: 300,
      header: 'Country',
      cell: info => (
        <Controller
          control={control}
          name={`alumniAlive[${info.row.id}].countryId`}
          defaultValue={fields[info.row.index].countryId || ''}
          render={({ field }) => (
            <SingleSelect
              {...field}
              data={country}
              onChange={countryId => {
                setValue(info.row.index, {
                  ...fields[info.row.index],
                  countryId,
                  provinceId:
                    countryId !== 'ID' ? '' : fields[info.row.index].provinceId,
                  cityId:
                    countryId !== 'ID' ? '' : fields[info.row.index].cityId,
                });
              }}
            />
          )}
        />
      ),
    },
    {
      accessorKey: 'provinceId',
      size: 300,
      header: 'Province',
      cell: info => {
        const { countryId } = info.row.original;

        return (
          <Controller
            control={control}
            name={`alumniAlive[${info.row.index}].provinceId`}
            defaultValue={info.getValue()}
            render={({ field }) => (
              <SingleSelect
                {...field}
                data={countryId === 'ID' ? province : []}
                onChange={provinceId => {
                  setValue(info.row.index, {
                    ...fields[info.row.index],
                    provinceId,
                    cityId: !provinceId ? '' : fields[info.row.index].cityId,
                  });
                }}
              />
            )}
          />
        );
      },
    },
    {
      accessorKey: 'cityId',
      size: 300,
      header: 'City',
      cell: info => {
        const row = info.row.original;

        const { countryId, provinceId } = row;

        let filteredCity = city.filter(e => e.label.startsWith(countryId));

        if (!provinceId) {
          filteredCity = filteredCity.sort((a, b) =>
            a.label.localeCompare(b.label)
          );
        } else {
          filteredCity = filteredCity.filter(
            e =>
              !e.label.startsWith('ID') ||
              provinceId.includes(e.value.slice(0, 2))
          );

          filteredCity = filteredCity.sort((a, b) =>
            a.label.localeCompare(b.label)
          );
        }

        return (
          <>
            <Controller
              control={control}
              name={`alumniAlive[${info.row.index}].cityId`}
              defaultValue={info.getValue()}
              render={({ field }) => (
                <SingleSelect {...field} data={filteredCity} />
              )}
            />

            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedCountryId(countryId);
                setIsModalCityOpen(true);
              }}
            >
              {countryId !== 'ID' && (
                <Typography
                  variant="label"
                  color="primary"
                  sx={{ marginBottom: '0 !important' }}
                >
                  City Not Found?
                </Typography>
              )}
            </Link>
          </>
        );
      },
    },
    {
      accessorKey: '',
      size: 1,
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
    },
  ];
}
