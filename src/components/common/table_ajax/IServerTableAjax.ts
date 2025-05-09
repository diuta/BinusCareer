import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";

export interface IServerTableConfiguration<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  rowCount: number;
  page: PaginationState;
  sort?: SortingState;
  onTableChange: (query: string, sorting?: SortingState, pagination?: PaginationState) => Promise<void>;
  isMultiSort?: boolean;
  maxTableHeight?: string;
  pageReset?: boolean;
  search?: string;
  totalRowSelected?: number;
}
