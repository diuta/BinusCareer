/* eslint-disable react/no-unstable-nested-components */
import LinkIcon from '@mui/icons-material/Link';
import { Button, Link, Typography } from '@mui/material';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { ApprovalField, ListApproval } from '../../interface/Approval';
import ApprovalTable from './ApprovalTable';

function EvidenceColumn(info: CellContext<ListApproval, unknown>) {
  const cell = info as CellContext<ListApproval, ApprovalField[]>;
  const columnKey = cell.column.id;
  const data = cell
    .getValue()
    .find(t => t.fieldName.toLowerCase() === columnKey.toLowerCase());

  if (data) {
    return (
      <Link href={data.value} color="warning.main" target="_blank">
        <Button
          variant="contained"
          color="primary"
          startIcon={<LinkIcon fontSize="small" />}
        >
          <Typography
            variant="label"
            color="white"
            sx={{ marginBottom: '0 !important' }}
          >
            Link
          </Typography>
        </Button>
      </Link>
    );
  }

  return '-';
}

export default function PassedAwayTable({
  filter,
  isActive = false,
  hasPermission = false,
}: {
  filter: string;
  isActive?: boolean;
  hasPermission?: boolean;
}) {
  const columns = useMemo<ColumnDef<ListApproval>[]>(
    () => [
      {
        accessorKey: 'alumniUpdateableData',
        id: 'evidence',
        header: 'Evidence',
        cell: EvidenceColumn,
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <ApprovalTable
      isAlive={false}
      filter={filter}
      isActive={isActive}
      hasPermission={hasPermission}
      specializedColumn={columns}
    />
  );
}
