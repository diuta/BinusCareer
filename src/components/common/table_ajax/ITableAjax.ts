import { ColumnDef } from "@tanstack/react-table";

export interface ITableConfiguration<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  rowCount: number;
  page?: number;
  pageSize?: number;
  onSortChange: (filters: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isMultiSort?: boolean;
  maxTableHeight?: string;
}
