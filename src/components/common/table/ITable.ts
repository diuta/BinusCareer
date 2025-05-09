import { ColumnDef, VisibilityState } from '@tanstack/react-table';

export interface ITableConfiguration<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  columnVisibility?: VisibilityState;
  pageSizeOptions?: number[];
  isMultiSort?: boolean;
  maxTableHeight?: string;
  initialPageSize: number;
  loading?: boolean;
  pageReset?: boolean;
}
