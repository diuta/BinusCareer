/* eslint-disable func-names */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Divider,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import { DragAndDrop } from '../../components/common/drag_and_drop/DragandDrop';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';
import { Option } from '../../interfaces/ITypes';
import { store } from '../../store';
import { setError } from '../../store/error/slice';
import { themes } from '../../styles/mui/theme';
import { ModalClientError } from './components/ModalClientError';
import { ModalServerError } from './components/ModalServerError';
import AliveTableImport from './components/table_import_alive/AliveTableImport';
import PassedAwayTableImport from './components/table_import_passed_away/PassedAwayTableImport';
import {
  AlumniDetailImport,
  UpdateAlumniAliveImport,
  UpdateAlumniPassedAwayImport,
} from './interface/Alumni';
import { ImportFormValues } from './interface/Form';
import { ErorrClient, ErrorServer, FieldConfig } from './interface/Validator';
import {
  createHeaderIndex,
  downloadExcelTemplate,
  isArrayExactMatch,
  isValidPhone,
  isValidURL,
  parseXLSXintoArray,
  validateDataRow,
  validateNIM,
  validationSchema,
} from './utility/ImportUtility';

export const VALID_FORMAT_TYPE = new Set([
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]);

export const MAX_ROW_FILE = 1000;

export const EXPECTED_ALIVE_HEADER = [
  'NIM',
  'Email1',
  'Email2',
  'Email3',
  'Phone1',
  'Phone2',
  'Company Name',
  'Company Category',
  'Sector',
  'Position',
  'Position Level',
  'Job Category',
  'Country',
  'Province',
  'City',
] as const;

export const EXPECTED_PASSED_AWAY_HEADER = ['NIM', 'Evidence'] as const;

const aliveHeaderIndex = createHeaderIndex(EXPECTED_ALIVE_HEADER);
const passedHeaderIndex = createHeaderIndex(EXPECTED_PASSED_AWAY_HEADER);

export const EXPECTED_VALIDATORS_IMPORT: Record<
  | (typeof EXPECTED_ALIVE_HEADER)[number]
  | (typeof EXPECTED_PASSED_AWAY_HEADER)[number],
  FieldConfig
> = {
  NIM: {
    required: true,
    validator: value => typeof value === 'number' || typeof value === 'string',
  },
  Email1: {
    required: false,
    validator: value =>
      (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) ||
      value === null,
  },
  Email2: {
    required: false,
    validator: value =>
      (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) ||
      value === null,
  },
  Email3: {
    required: false,
    validator: value =>
      (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) ||
      value === null,
  },
  Phone1: {
    required: false,
    validator: value =>
      (typeof value === 'string' && isValidPhone(value)) || value === null,
  },
  Phone2: {
    required: false,
    validator: value =>
      (typeof value === 'string' && isValidPhone(value)) || value === null,
  },
  'Company Category': {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  Sector: {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  'Company Name': {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  'Job Category': {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  'Position Level': {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  Position: {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  Country: {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  Province: {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  City: {
    required: false,
    validator: value => typeof value === 'string' || value === null,
  },
  Evidence: {
    required: true,
    validator: value => typeof value === 'string' && isValidURL(value),
  },
};

function validateSheetHeader(
  sheetData: string[],
  expectedHeader: readonly string[]
) {
  if (!isArrayExactMatch(sheetData, expectedHeader)) {
    throw new SyntaxError('Please use provided import template.');
  }
}
const getAlumniDetail = async (alumniIdCSV: string) => {
  try {
    const response = await apiClient.post(
      `${ApiService.alumni}/import`,
      { alumniIdCSV },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (typeof response.data !== 'object') {
      throw new TypeError('Something went wrong, please try again later');
    }

    return response.data;
  } catch {
    throw new Error('Fetch API failed');
  }
};

const submitComponent: () => JSX.Element = () => (
  <Stack p={2}>
    <Typography variant="label">
      Please check again your import data before click save button, specially in
      Country, Province and City, with this condition:
    </Typography>

    <List sx={{ listStyleType: 'disc' }}>
      <ListItem sx={{ display: 'list-item', py: 0 }}>
        <Typography variant="label">
          If the country is Indonesia, then you can fill the province and city
          data using dropdown
        </Typography>
      </ListItem>
      <ListItem sx={{ display: 'list-item', py: 0 }}>
        <Typography variant="label">
          If the country not Indonesia, then you can fill the city data using
          dropdown
        </Typography>
      </ListItem>
      <ListItem sx={{ display: 'list-item', py: 0 }}>
        <Typography variant="label">
          Else the province and city will be reset by system
        </Typography>
      </ListItem>
    </List>

    <Typography
      variant="label"
      textAlign="center"
      color={themes.palette.error.main}
    >
      By clicking save button, you agree that this import data will be assessed
      by the ARO Staff
    </Typography>
  </Stack>
);

function TabPanelApproval(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ backgroundColor: 'white', paddingBottom: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function EditUsingImport() {
  const [tab, setTab] = useState(0);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDownloadTemplate, setLoadingDownloadTemplate] = useState(false);
  const [fileProccessing, setFileProccessing] = useState(false);
  const [errorState, setErrorState] = useState<{
    isError: boolean;
    data: ErorrClient | ErrorServer[];
    message: string;
    generatedBySystem: boolean;
  }>({
    isError: false,
    data: { alive: [], passedAway: [] },
    message: '',
    generatedBySystem: false,
  });
  const [aliveData, setAliveData] = useState<UpdateAlumniAliveImport[]>([]);
  const [passedAwayData, setPassedAwayData] = useState<
    UpdateAlumniPassedAwayImport[]
  >([]);

  const [country, setCountry] = useState<Option[]>([]);
  const [province, setProvince] = useState<Option[]>([]);
  const [city, setCity] = useState<Option[]>([]);
  const [companyCategory, setCompanyCategory] = useState<Option[]>([]);
  const [jobCategory, setJobCategory] = useState<Option[]>([]);
  const [sector, setSector] = useState<Option[]>([]);
  const [positionLevel, setPositionLevel] = useState<Option[]>([]);

  const navigate = useNavigate();
  const { showModal } = useModal();

  const reactForm = useForm<ImportFormValues>({
    defaultValues: {
      alumniAlive: [],
      alumniPassedAway: [],
    },
    resolver: yupResolver(validationSchema) as any,
    reValidateMode: 'onSubmit',
    mode: 'onSubmit',
    shouldFocusError: false,
  });

  const debouncedRefetch = useDebouncedCallback(
    (newValue, rowIdentifier, rowIndex) => {
      refetchAlumniDetail(newValue, rowIdentifier, rowIndex);
    },
    750
  );

  const refetchAlumniDetail = useCallback(
    async (
      alumniId,
      rowIdentifier: 'alumniAlive' | 'alumniPassedAway',
      rowNumber: number
    ) => {
      try {
        const alumniNameRow =
          `${rowIdentifier}[${rowNumber}].alumniName` as `alumniAlive.${number}.alumniName`;
        const facultyNameRow =
          `${rowIdentifier}[${rowNumber}].facultyName` as `alumniAlive.${number}.facultyName`;
        const programNameRow =
          `${rowIdentifier}[${rowNumber}].programName` as `alumniAlive.${number}.programName`;
        const campusNameRow =
          `${rowIdentifier}[${rowNumber}].campusName` as `alumniAlive.${number}.campusName`;
        const degreeNameRow =
          `${rowIdentifier}[${rowNumber}].degreeName` as `alumniAlive.${number}.degreeName`;

        reactForm.setValue(alumniNameRow, '');
        reactForm.setValue(facultyNameRow, '');
        reactForm.setValue(programNameRow, '');
        reactForm.setValue(campusNameRow, '');
        reactForm.setValue(degreeNameRow, '');

        const response = await getAlumniDetail(alumniId);

        if (response.length === 0) throw new SyntaxError('NIM not found');

        const { alumniName, facultyName, programName, campusName, degreeName } =
          response[0];

        reactForm.setValue(alumniNameRow, alumniName);
        reactForm.setValue(facultyNameRow, facultyName);
        reactForm.setValue(programNameRow, programName);
        reactForm.setValue(campusNameRow, campusName);
        reactForm.setValue(degreeNameRow, degreeName);
      } catch (error) {
        let message = 'Something went wrong, please try again later';
        if (error instanceof Error) {
          message = error.message;
        }

        store.dispatch(
          setError({
            type: 'failed',
            message,
            title: 'Failed',
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFileChange = useCallback((file: File | null) => {
    setAliveData([]);
    setPassedAwayData([]);

    if (file === null) {
      setRawFile(null);
      return;
    }

    if (VALID_FORMAT_TYPE.has(file.type)) {
      setRawFile(file);
    } else {
      store.dispatch(
        setError({
          type: 'failed',
          message: 'Please upload the supported file type xlsx or csv',
          title: 'Failed',
        })
      );
    }
  }, []);

  const handleDownloadTemplate = useCallback(async () => {
    setLoadingDownloadTemplate(true);
    try {
      await downloadExcelTemplate();
    } catch {
      store.dispatch(
        setError({
          type: 'failed',
          message: 'Something went wrong, please try again',
          title: 'Failed',
        })
      );
    } finally {
      setLoadingDownloadTemplate(false);
    }
  }, []);

  const proccessRawFile = useCallback(async () => {
    if (!rawFile) {
      store.dispatch(
        setError({
          type: 'failed',
          message: 'Please upload a file',
          title: 'Failed',
        })
      );
      return;
    }

    setAliveData([]);
    setPassedAwayData([]);

    setFileProccessing(true);

    const tabError: ErorrClient = {
      alive: [],
      passedAway: [],
    };

    try {
      const parsedData = await parseXLSXintoArray(rawFile);

      validateSheetHeader(parsedData.alive.header, EXPECTED_ALIVE_HEADER);
      validateSheetHeader(
        parsedData['passed away'].header.slice(0, 2),
        EXPECTED_PASSED_AWAY_HEADER
      );

      const aliveAlumniRows = parsedData.alive.data;
      const passedAlumniRows = parsedData['passed away'].data;

      if (aliveAlumniRows.length === 0 && passedAlumniRows.length === 0) {
        throw new SyntaxError('File is empty');
      }

      const combinedAlumniNim = [
        ...aliveAlumniRows.map(row => row[aliveHeaderIndex.NIM]),
        ...passedAlumniRows.map(row => row[passedHeaderIndex.NIM]),
      ];

	  // Since first data in passed away always being read, we need to subtract 1 if NIM is null
	  // Cause by NOTE
	  const modifier = passedAlumniRows[0][passedHeaderIndex.NIM] ? 0 : 1;

      if (aliveAlumniRows.length + passedAlumniRows.length - modifier > MAX_ROW_FILE) {
        throw new SyntaxError(`The maximum allowed number of records for import is ${MAX_ROW_FILE}`);
      }

      const uniqueNims = [...new Set(combinedAlumniNim)];

      const alumniIdCSV = uniqueNims.join(',');
      const alumniDetails: AlumniDetailImport[] = await getAlumniDetail(
        alumniIdCSV
      );

      const transformedAliveRow: UpdateAlumniAliveImport[] =
        aliveAlumniRows.map((row, index) => {
          const rowErrors: string[] = [];

          const alumni = alumniDetails.find(
            alumniData =>
              alumniData.alumniNIM === row[aliveHeaderIndex.NIM]?.toString()
          );

          const errorRow = validateDataRow(
            row,
            EXPECTED_ALIVE_HEADER,
            EXPECTED_VALIDATORS_IMPORT
          );

          const errorNIM = validateNIM(
            row[aliveHeaderIndex.NIM],
            alumni,
            combinedAlumniNim
          );

          rowErrors.push(...errorRow, ...errorNIM);

          const mappedMasterData = {
            [aliveHeaderIndex.Country]: country,
            [aliveHeaderIndex.Province]: province,
            [aliveHeaderIndex.City]: city,
            [aliveHeaderIndex['Job Category']]: jobCategory,
            [aliveHeaderIndex.Sector]: sector,
            [aliveHeaderIndex['Company Category']]: companyCategory,
            [aliveHeaderIndex['Position Level']]: positionLevel,
          };

          const masterValue = {};

          for (const [rowKey, masterData] of Object.entries(mappedMasterData)) {
            const rowValue = row[rowKey];

            const selectedOption =
              rowValue && masterData.find(x => x.label === rowValue);

            // validate if data is invalid (invalid == undefined)
            if (selectedOption === undefined) {
              rowErrors.push(`${EXPECTED_ALIVE_HEADER[rowKey]} Not Found`);
            }

            masterValue[rowKey] = selectedOption?.value ?? null;
          }

          if (rowErrors.length > 0) {
            tabError.alive.push({
              nim: row[0],
              rowNumber: index + 2,
              errorMessage: rowErrors.join('; '),
            });
          }

          return {
            alive: true,
            alumniNIM: row[aliveHeaderIndex.NIM]?.toString(),
            alumniName: alumni?.alumniName ?? '',
            facultyName: alumni?.facultyName ?? '',
            campusName: alumni?.campusName ?? '',
            programName: alumni?.programName ?? '',
            degreeName: alumni?.degreeName ?? '',
            email: [
              {
                id: 'Email_1',
                data: row[aliveHeaderIndex.Email1] ?? '',
              },
              {
                id: 'Email_2',
                data: row[aliveHeaderIndex.Email2] ?? '',
              },
              {
                id: 'Email_3',
                data: row[aliveHeaderIndex.Email3] ?? '',
              },
            ],
            phone: [
              {
                id: 'Phone_1',
                data: row[aliveHeaderIndex.Phone1] ?? '',
              },
              {
                id: 'Phone_2',
                data: row[aliveHeaderIndex.Phone2] ?? '',
              },
            ],
            positionName: row[aliveHeaderIndex.Position] ?? '',
            positionLevelId:
              masterValue[aliveHeaderIndex['Position Level']]?.toString(),
            companyName: row[aliveHeaderIndex['Company Name']] ?? '',
            countryId: masterValue[aliveHeaderIndex.Country]?.toString(),
            provinceId: masterValue[aliveHeaderIndex.Province]?.toString(),
            cityId: masterValue[aliveHeaderIndex.City]?.toString(),
            jobCategoryId:
              masterValue[aliveHeaderIndex['Job Category']]?.toString(),
            sectorId: masterValue[aliveHeaderIndex.Sector]?.toString(),
            companyCategoryId:
              masterValue[aliveHeaderIndex['Company Category']]?.toString(),
          };
        });

      // Why check passedAlumniRows[0][0]
      // The CSV template contains a custom row that can disrupt the parsing logic.
      // For example, in row 2, column 4, there might be informational text that CSV parsing misinterprets as a data row.

      const transformedPassedRow: UpdateAlumniPassedAwayImport[] =
        passedAlumniRows[0]?.[0]
          ? passedAlumniRows.map((row, index) => {
              const rowErrors: string[] = [];

              const alumni = alumniDetails.find(
                alumniData =>
                  alumniData.alumniNIM ===
                  row[passedHeaderIndex.NIM]?.toString()
              );

              const errorRow = validateDataRow(
                row,
                EXPECTED_PASSED_AWAY_HEADER,
                EXPECTED_VALIDATORS_IMPORT
              );

              const errorNIM = validateNIM(
                row[passedHeaderIndex.NIM],
                alumni,
                combinedAlumniNim
              );

              rowErrors.push(...errorRow, ...errorNIM);

              if (rowErrors.length > 0) {
                tabError.passedAway.push({
                  nim: row[0],
                  rowNumber: index + 2,
                  errorMessage: rowErrors.join('; '),
                });
              }

              return {
                alive: false,
                alumniNIM: row[passedHeaderIndex.NIM]?.toString(),
                alumniName: alumni?.alumniName ?? '',
                facultyName: alumni?.facultyName ?? '',
                campusName: alumni?.campusName ?? '',
                programName: alumni?.programName ?? '',
                degreeName: alumni?.degreeName ?? '',
                evidence: row[passedHeaderIndex.Evidence],
              };
            })
          : [];

      if (tabError.alive.length > 0 || tabError.passedAway.length > 0) {
        throw new EvalError('Please check the following issue before continue');
      }

      setAliveData(transformedAliveRow);
      setPassedAwayData(transformedPassedRow);
    } catch (error) {
      if (error instanceof SyntaxError) {
        store.dispatch(
          setError({
            type: 'failed',
            message: error.message,
            title: 'The Excel Format is Invalid',
          })
        );
        return;
      }

      if (error instanceof EvalError) {
        setErrorState({
          isError: true,
          data: tabError,
          message: error.message,
          generatedBySystem: false,
        });

        return;
      }

      store.dispatch(
        setError({
          type: 'failed',
          message: 'Something went wrong, please try again',
          title: 'Failed',
        })
      );
    } finally {
      setFileProccessing(false);
    }
  }, [
    city,
    companyCategory,
    country,
    jobCategory,
    positionLevel,
    province,
    rawFile,
    sector,
  ]);

  const onSubmit = useCallback(
    async data => {
      const payload = [...data.alumniAlive, ...data.alumniPassedAway];

      try {
        await apiClient.patch(`${ApiService.alumni}/edit/import`, payload);

        store.dispatch(
          setError({
            type: 'success',
            message: 'Alumni successfully imported',
            title: 'Success',
          })
        );

        navigate('/update-alumni/list');
      } catch (error) {
        if (error instanceof AxiosError) {
          const message = error.response?.data;

          if (error.code === 'ERR_BAD_REQUEST') {
            const parsedPayload = JSON.parse(message);

            const errorList = Object.entries(parsedPayload).map(entry => {
              const nim = entry[0];
              const errorMessage = (entry[1] as string[]).join('; ');
              return { nim, errorMessage };
            });

            setErrorState({
              data: errorList,
              generatedBySystem: true,
              isError: true,
              message: 'Failed to Import Excel',
            });

            return;
          }

          store.dispatch(
            setError({
              type: 'failed',
              message,
              title: 'Failed',
            })
          );
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    reactForm.reset({
      alumniAlive: aliveData,
      alumniPassedAway: passedAwayData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aliveData, passedAwayData]);

  const getCities = async () => {
    const response = await apiClient.get(ApiService.city);
    setCity(response.data.listDropdown);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        getCities();

        const [
          countryData,
          provinceData,
          jobCategoryData,
          companyCategoryData,
          sectorData,
          positionLevelData,
        ] = await Promise.all([
          apiClient.get(ApiService.country),
          apiClient.get(ApiService.province),
          apiClient.get(ApiService.jobCategory),
          apiClient.get(ApiService.companyCategory),
          apiClient.get(ApiService.sector),
          apiClient.get(ApiService.positionLevel),
        ]);

        setCountry(countryData.data.listDropdown);
        setProvince(provinceData.data.listDropdown);
        setJobCategory(jobCategoryData.data.listDropdown);
        setCompanyCategory(companyCategoryData.data.listDropdown);
        setSector(sectorData.data.listDropdown);
        setPositionLevel(positionLevelData.data.listDropdown);
      } catch {
        store.dispatch(
          setError({
            type: 'failed',
            message: 'Fetch API failed',
            title: 'Failed',
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleManualSubmit = () => {
    showModal({
      title: 'Confirmation',
      message: submitComponent(),
      options: {
        buttonTitle: 'Submit',
        cancelButton: true,
        variant: 'success',
        onOk: () => {
          reactForm.handleSubmit(onSubmit)();
        },
      },
    });
  };

  return (
    <>
      {errorState.generatedBySystem ? (
        <ModalServerError
          open={errorState.isError}
          data={errorState.data as ErrorServer[]}
          handleClose={() => setErrorState({ ...errorState, isError: false })}
          title="Failed to Import Excel"
          message={errorState.message}
        />
      ) : (
        <ModalClientError
          open={errorState.isError}
          data={errorState.data as ErorrClient}
          handleClose={() => setErrorState({ ...errorState, isError: false })}
          title="Failed to Import Excel"
          message={errorState.message}
        />
      )}

      <PageWrapper>
        <Box component="section" marginY={2}>
          <Box component="div" textAlign="end" marginBottom={1}>
            <CustomLoadingButton
              startIcon={<RiFileExcel2Fill size={20} />}
              variant="contained"
              color="success"
              sx={{ width: 'fit-content', fontSize: '12px' }}
              onClick={handleDownloadTemplate}
              loading={loadingDownloadTemplate}
            >
              Download Template
            </CustomLoadingButton>
          </Box>

          <Typography variant="label" marginBottom={1} display="block">
            Import Excel
          </Typography>
          <Typography color="red" fontSize="10px">
            Ensure you fill in the green columns in the Excel template according
            to the options on the master list.
          </Typography>

          <DragAndDrop
            value={rawFile}
            changeValueHandler={handleFileChange}
            mimetypes={[...VALID_FORMAT_TYPE].join(',')}
          />

          <Box component="div" marginTop={2} textAlign="right">
            <CustomLoadingButton
              loading={fileProccessing || loading}
              onClick={proccessRawFile}
              variant="contained"
              sx={{ fontSize: '12px' }}
            >
              Apply
            </CustomLoadingButton>
          </Box>
        </Box>
      </PageWrapper>

      {(reactForm.getValues().alumniAlive.length > 0 ||
        reactForm.getValues().alumniPassedAway.length > 0) && (
        <>
          <Divider />
          <PageWrapper>
            <Box component="section">
              <Box>
                <Box sx={{ borderBottom: 3, borderColor: 'primary.main' }}>
                  <Tabs
                    value={tab}
                    onChange={(_, value) => setTab(value)}
                    TabIndicatorProps={{ style: { display: 'none' } }}
                    sx={{
                      '& button': {
                        marginRight: '1px',
                        borderTopLeftRadius: '5px',
                        borderTopRightRadius: '5px',
                      },
                      '& .MuiTab-root': {
                        backgroundColor: 'lightgray',
                        color: 'black',
                      },
                      '& .Mui-selected': {
                        color: 'white !important',
                        backgroundColor: 'primary.main',
                      },
                      '& .MuiTabs-indicator': {
                        display: 'none',
                      },
                    }}
                  >
                    <Tab
                      label="alive"
                      sx={{
                        backgroundColor:
                          tab !== 0 ? 'lightgray' : 'primary.main',
                        fontSize: '12px',
                      }}
                    />
                    <Tab
                      label="passed away"
                      sx={{
                        backgroundColor:
                          tab !== 1 ? 'lightgray' : 'primary.main',
                        fontSize: '12px',
                      }}
                    />
                  </Tabs>
                </Box>
                <FormProvider {...reactForm}>
                  <TabPanelApproval value={tab} index={0}>
                    <AliveTableImport
                      companyCategory={companyCategory}
                      city={city}
                      country={country}
                      province={province}
                      jobCategory={jobCategory}
                      positionLevel={positionLevel}
                      sector={sector}
                      refetchAlumni={debouncedRefetch}
                      loading={fileProccessing}
                      refereshCity={getCities}
                    />
                  </TabPanelApproval>
                  <TabPanelApproval value={tab} index={1}>
                    <PassedAwayTableImport
                      refetchAlumni={debouncedRefetch}
                      loading={fileProccessing}
                    />
                  </TabPanelApproval>
                </FormProvider>
              </Box>
            </Box>
            <Box
              component="div"
              justifyContent="flex-end"
              display="flex"
              gap={2}
              marginTop={2}
            >
              <CustomLoadingButton
                color="secondary"
                variant="contained"
                sx={{ fontSize: '12px' }}
                loading={reactForm.formState.isSubmitting}
                onClick={() => navigate('/update-alumni/list')}
              >
                Cancel
              </CustomLoadingButton>

              <CustomLoadingButton
                color="primary"
                variant="contained"
                onClick={handleManualSubmit}
                loading={reactForm.formState.isSubmitting}
                sx={{ fontSize: '12px' }}
              >
                Save
              </CustomLoadingButton>
            </Box>
          </PageWrapper>
        </>
      )}
    </>
  );
}
