type Validator = (value: any, row) => boolean;

export interface FieldConfig {
  required: boolean;
  validator: Validator;
}

interface ErrorClientRow {
  nim: string;
  rowNumber: number;
  errorMessage: string;
}

export interface ErrorServer {
  nim: string;
  errorMessage: string;
}

export interface ErorrClient {
  alive: ErrorClientRow[];
  passedAway: ErrorClientRow[];
}

export type HeaderIndex<T extends readonly string[]> = Record<
  T[number],
  number
>;

export type SheetData = { header: string[]; data: string[][] };

export type ParsedXLSXData = {
  alive: SheetData;
  passedAway: SheetData;
};
