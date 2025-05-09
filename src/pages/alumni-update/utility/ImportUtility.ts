import qs from 'qs';
import { read, utils } from 'xlsx';
import * as Yup from 'yup';

import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import { AlumniDetailImport } from '../interface/Alumni';
import { HeaderIndex, ParsedXLSXData } from '../interface/Validator';

const phoneRegExp = /^\+?\d{3,}$/;

export function validateDataRow(
  dataRow: string[],
  headerKeyMapping: readonly string[],
  expectedValidator
) {
  const error: string[] = [];

  headerKeyMapping.forEach((headerValue, headerKey) => {
    const value = dataRow[headerKey];
    const { required, validator } = expectedValidator[headerValue];

    if (required && !value) {
      error.push(`${headerValue} is required`);
    } else if (!validator(value, dataRow)) {
      error.push(`${headerValue} is invalid`);
    }
  });

  return error;
}

const uniqueArrayValidation = (message: string) =>
  Yup.array().test('unique', message, array => {
    if (!Array.isArray(array) || array.length === 0) return true; // Skip if the array is empty

    const dataArray = array.map((item: { data: string }) => item.data);
    const hasDuplicates = dataArray.some(
      (item, index) => item && dataArray.indexOf(item) !== index
    );

    return !hasDuplicates;
  });

export const validationSchema = Yup.object().shape({
  alumniAlive: Yup.array().of(
    Yup.object().shape({
      companyName: Yup.string().notRequired(),
      companyCategoryId: Yup.string().notRequired(),
      sectorId: Yup.string().notRequired(),
      alive: Yup.boolean().required(),
      alumniNIM: Yup.string().trim().required('Alumni NIM is required'),
      email: uniqueArrayValidation('Email must be unique').of(
        Yup.object().shape({
          data: Yup.string().optional().email('Invalid email format'),
        })
      ),
      phone: uniqueArrayValidation('Phone must be unique').of(
        Yup.object().shape({
          data: Yup.string()
            .optional()
            .test('is-valid-phone', 'Phone number is not valid', (value) => {
              if (!value) return true;
              return phoneRegExp.test(value);
            })
        })
      ),
    })
  ),
  alumniPassedAway: Yup.array().of(
    Yup.object().shape({
      alive: Yup.boolean().required(),
      alumniNIM: Yup.string().trim().required('Alumni NIM is required'),
      evidence: Yup.string()
        .url('Evidence must be a valid URL')
        .required('Evidence is required'),
    })
  ),
});

export const downloadExcelTemplate = async () => {
  const params = {
    IsCdn: false,
    Path: 'templateImport/UpdateData-Import-Template.xlsx',
  };

  const response = await apiClient.get(
    `${ApiService.storage}?${qs.stringify(params)}`,
    {
      responseType: 'blob',
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `UpdateAlumniImportTemplate.xlsx`);
  document.body.append(link);
  link.click();
};

export const isValidURL = (value: string): boolean => {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
};

export const isValidPhone = (value: string): boolean => phoneRegExp.test(value);

export function isArrayExactMatch(
  header: string[],
  expectedHeader: readonly string[]
): boolean {
  return (
    header.length === expectedHeader.length &&
    expectedHeader.every((value, idx) => value === header[idx])
  );
}

export const parseXLSXintoArray = async (
  file: File
): Promise<ParsedXLSXData> => {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = read(data, { type: 'array' });
  const sheetNames = workbook.SheetNames.slice(0, 2);
  const expectedSheetNames = ['Alive', 'Passed Away'];

  const isExactMatch = isArrayExactMatch(sheetNames, expectedSheetNames);

  if (!isExactMatch) {
    throw new SyntaxError('Please use the provided import template.');
  }

  const sheets = {} as ParsedXLSXData;

  const sheet1 = workbook.Sheets[sheetNames[0]];
  const sheet1Data: string[][] = utils.sheet_to_json(sheet1, {
    header: 1,
    blankrows: false,
    defval: null,
  });

  const sheet2 = workbook.Sheets[sheetNames[1]];
  const sheet2Data = utils.sheet_to_json(sheet2, {
    header: 1,
    blankrows: false,
    defval: null,
  });

  sheets.alive = {
    header: sheet1Data[0],
    data: sheet1Data.slice(1),
  };

  sheets['passed away'] = {
    header: sheet2Data[0],
    data: sheet2Data.slice(1),
  };

  return sheets;
};

export const validateNIM = (
  nim: string,
  alumni: AlumniDetailImport | undefined,
  importedNim: string[]
) => {
  const error: string[] = [];

  if (!nim) {
    return error;
  }

  if (!alumni) {
    error.push('NIM not found');
    return error;
  }

  if (!alumni?.facultyName) {
    error.push('Alumni Program not Found');
  }

  const isNIMDuplicate = importedNim.filter(data => data === nim).length > 1;

  if (isNIMDuplicate) {
    error.push('Duplicate NIM is detected');
  }

  return error;
};

export function createHeaderIndex<T extends readonly string[]>(
  header: T
): HeaderIndex<T> {
  return header.reduce((acc, key, index) => {
    acc[key as T[number]] = index;
    return acc;
  }, {} as HeaderIndex<T>);
}
