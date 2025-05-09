/* eslint-disable react/no-unstable-nested-components */
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack, Typography } from '@mui/material';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import qs from 'qs';
import { useMemo, useState } from 'react';

import apiClient from '../../../../config/api-client';
import { ApiService } from '../../../../constants/ApiService';
import { ApprovalField, ListApproval } from '../../interface/Approval';
import AlumniUpdateChildHistory from '../AlumniUpdateChildHistory';
import ApprovalTable from './ApprovalTable';

function ActionSection({ clickHandler }: { clickHandler: () => void }) {
  return (
    <Stack direction="row" gap={1}>
      <Button
        variant="contained"
        sx={{
          borderRadius: '999px',
          width: '36px',
          height: '36px',
          minWidth: 'fit-content',
          padding: 0,
        }}
        onClick={clickHandler}
        size="small"
      >
        <VisibilityIcon fontSize="small" />
      </Button>
    </Stack>
  );
}

const updateableColumnCallback = (info: CellContext<ListApproval, unknown>) => {
  const cell = info as CellContext<ListApproval, ApprovalField[]>;
  const columnKey = cell.column.id;
  const data = cell
    .getValue()
    .find(t => t.fieldName.toLowerCase() === columnKey.toLowerCase());

  if (data) {
    return (
      <Typography variant="label" color={data.isUpdated ? 'warning.main' : ''}>
        {data.value}
      </Typography>
    );
  }

  return '-';
};

const defaultModalConfig = {
  data: [],
  open: false,
  loading: false,
};

export default function AliveTable({
  filter,
  isActive = false,
  hasPermission = false,
}: {
  filter: string;
  isActive?: boolean;
  hasPermission?: boolean;
}) {
  const [childModalConfig, setChildModalConfig] = useState(defaultModalConfig);

  <AlumniUpdateChildHistory
    data={childModalConfig.data}
    open={childModalConfig.open}
    handleClose={() => setChildModalConfig(t => ({ ...t, open: false }))}
    loading={childModalConfig.loading}
  />;

  const columns = useMemo<ColumnDef<ListApproval>[]>(
    () => [
      {
        accessorKey: 'alumniUpdateableData',
        id: 'email_1',
        header: 'Email 1',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'email_2',
        header: 'Email 2',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'email_3',
        header: 'Email 3',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'phone_1',
        header: 'Phone 1',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'phone_2',
        header: 'Phone 2',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'companyCategoryId',
        header: 'Company Category',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'sectorId',
        header: 'Sector',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'companyName',
        header: 'Company Name',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'jobCategoryId',
        header: 'Job Category',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'positionLevelId',
        header: 'Position Level',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'positionName',
        header: 'Position',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'countryId',
        header: 'Country',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'provinceId',
        header: 'Province',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'alumniUpdateableData',
        id: 'cityId',
        header: 'City',
        cell: updateableColumnCallback,
        enableSorting: false,
      },
      {
        accessorKey: 'childIsUpdated',
        header: 'Update Child',
        id: 'update-alumni-child-history',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: info => {
          const isShown = info.getValue() as boolean;

          return isShown ? (
            <ActionSection
              clickHandler={async () => {
                setChildModalConfig(t => ({
                  ...t,
                  loading: true,
                  open: true,
                }));

                const { approvalId } = info.row.original;

                const params = {
                  approvalId,
                };

                const data = await apiClient
                  .get(
                    `${ApiService.alumni}/child-update-history?${qs.stringify(
                      params
                    )}`
                  )
                  .then(e => e.data);

                setChildModalConfig(t => ({
                  ...t,
                  data,
                  loading: false,
                }));
              }}
            />
          ) : null;
        },
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <>
      <AlumniUpdateChildHistory
        data={childModalConfig.data}
        open={childModalConfig.open}
        handleClose={() => setChildModalConfig(t => ({ ...t, open: false }))}
        loading={childModalConfig.loading}
      />

      <ApprovalTable
        isAlive
        filter={filter}
        isActive={isActive}
        hasPermission={hasPermission}
        specializedColumn={columns}
      />
    </>
  );
}
