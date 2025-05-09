import EditIcon from '@mui/icons-material/Edit';
import { Button, Typography } from '@mui/material';
import {
  CellContext,
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { formatDate } from 'date-fns';
import qs from 'qs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { To, useNavigate } from 'react-router-dom';

import ServerTableAjax from '../../../components/common/table_ajax/ServerTableAjax';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import { store } from '../../../store';
import { setError } from '../../../store/error/slice';
import { Alumni, AlumniContact } from '../interface/Alumni';
import { FilterAlumniList } from '../interface/Form';

const renderContactCell = (
  info: CellContext<Alumni, unknown>,
  index: number
) => {
  const value = info.getValue() as AlumniContact[];
  const selectedValue = value[index] ?? {};

  return (
    <Typography
      variant="label"
      color={selectedValue.generatedBySystem ? 'primary' : ''}
      sx={{ marginBottom: '0 !important' }}
    >
      {selectedValue.data ?? '-'}
    </Typography>
  );
};

export default function AlumniTable({
  filters,
  handleParentLoading,
}: {
  filters: FilterAlumniList;
  handleParentLoading: (value: boolean) => void;
}) {
  const [data, setData] = useState<Alumni[]>([]);

  const [rowCount, setRowCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [set, reset] = useState(false);

  const getAlumniTable = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      handleParentLoading(true);

      try {
        const url = `${ApiService.alumni}?${query}&${qs.stringify(filters)}`;
        const response = await apiClient.get(url).then(e => e.data);
        setData(response.data);
        setRowCount(response.dataCount);
        if (page) setPagination(page);
        if (sort) setSorting(sort);
      } catch (error) {
        let errorMessage = 'Something went wrong, please try again later.';

        if (error instanceof AxiosError) {
          errorMessage = error.response?.data.message ?? errorMessage;
        }

        store.dispatch(
          setError({
            type: 'failed',
            message: errorMessage,
            title: 'Failed',
          })
        );
      } finally {
        handleParentLoading(false);
      }
    },
    [filters, handleParentLoading]
  );

  const Navigate = useNavigate();

  useEffect(() => {
    reset(!set);
  }, [filters]);

  const EditTableButton = useCallback(
    (route: To) => (
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
        onClick={() => Navigate(route)}
      >
        <EditIcon fontSize="small" />
      </Button>
    ),
    [Navigate]
  );

  const columns = useMemo<ColumnDef<Alumni>[]>(
    () => [
      {
        header: 'No',
        size: 1,
        enableSorting: false,
        accessorFn: (_, index) =>
          index + 1 + pagination.pageIndex * pagination.pageSize,
      },
      {
        accessorKey: 'alive',
        header: 'Alumni Status',
        size: 1,
      },
      {
        accessorKey: 'alumniNIM',
        header: 'NIM',
        size: 1,
      },
      {
        accessorKey: 'alumniName',
        header: 'Name',
      },
      {
        accessorKey: 'campusName',
        header: 'Campus',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'facultyName',
        header: 'Faculty',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'programName',
        header: 'Program',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'degreeName',
        header: 'Degree',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        id: 'EntryDate',
        accessorKey: 'entryDate',
        header: 'Entry Year',
        cell: info => info.getValue() ? formatDate(info.getValue() as string, 'yyyy') : '-',
		sortDescFirst: false,
      },
      {
        id: 'GraduationYear',
        accessorKey: 'graduationYear',
        header: 'Graduation Year',
        cell: info => info.getValue() ? formatDate(info.getValue() as string, 'yyyy') : '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'email',
        header: 'Email 1',
        id: 'email_1',
        size: 1,
        cell: info => renderContactCell(info, 0),
        enableSorting: false,
      },
      {
        accessorKey: 'email',
        header: 'Email 2',
        id: 'email_2',
        size: 1,
        cell: info => renderContactCell(info, 1),
        enableSorting: false,
      },
      {
        accessorKey: 'email',
        header: 'Email 3',
        id: 'email_3',
        size: 1,
        cell: info => renderContactCell(info, 2),
        enableSorting: false,
      },
      {
        accessorKey: 'phone',
        header: 'Phone 1',
        id: 'phone_1',
        size: 1,
        cell: info => renderContactCell(info, 0),
        enableSorting: false,
      },
      {
        accessorKey: 'phone',
        header: 'Phone 2',
        id: 'phone_2',
        size: 1,
        cell: info => renderContactCell(info, 1),
        enableSorting: false,
      },
      {
        accessorKey: 'companyName',
        header: 'Company Name',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'companyCategoryName',
        header: 'Company Category',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'sectorName',
        header: 'Sector',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'positionName',
        header: 'Position',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'positionLevelName',
        header: 'Position Level',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'jobCategoryName',
        header: 'Job Category',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'countryName',
        header: 'Country',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'provinceName',
        header: 'Province',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'cityName',
        header: 'City',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'dateUp',
        header: 'Updated Date',
        cell: info =>
          info.getValue()
            ? formatDate(info.getValue() as string, 'd MMMM yyyy, HH:mm')
            : '-',
			sortDescFirst: false,
      },
      {
        accessorKey: 'userUp',
        header: 'Updated By',
        cell: info => info.getValue() || '-',
		sortDescFirst: false,
      },
      {
        accessorKey: 'alumniId',
        header: 'Action',
        size: 1,
        enableSorting: false,
        cell: info => EditTableButton(`/update-alumni/${info.getValue()}/edit`),
      },
    ],
    [EditTableButton, pagination]
  );
  const serverTable = ServerTableAjax<Alumni>({
    data,
    columns,
    rowCount,
    page: pagination,
    sort: sorting,
    isMultiSort: false,
    onTableChange: getAlumniTable,
    pageReset: set,
  });

  return serverTable;
}
