/* eslint-disable react/no-unstable-nested-components */
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Checkbox, Stack } from '@mui/material';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import qs from 'qs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import CustomLoadingButton from '../../../../components/common/CustomLoadingButton';
import ModalSendBack from '../../../../components/common/modal/ModalSendBack';
import ServerTableAjax from '../../../../components/common/table_ajax/ServerTableAjax';
import apiClient from '../../../../config/api-client';
import { ApiService } from '../../../../constants/ApiService';
import useModal from '../../../../hooks/use-modal';
import { ListApproval } from '../../interface/Approval';
import AlumniUpdateHistory from '../AlumniUpdateHistory';

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

function RowCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      inputProps={{ 'aria-label': 'Select row' }}
    />
  );
}

const APPROVE_ACTION = 'approve';
const SEND_BACK_ACTION = 'send back';

const defaultModalConfig = {
  data: [],
  open: false,
  loading: false,
};

export default function ApprovalTable({
  filter,
  isAlive,
  isActive,
  hasPermission,
  specializedColumn,
}: {
  filter: string;
  isActive: boolean;
  isAlive: boolean;
  hasPermission: boolean;
  specializedColumn: ColumnDef<ListApproval>[];
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActionAllowed = useMemo(() => isActive && hasPermission, []);
  const [approvalData, setApprovalData] = useState<ListApproval[]>([]);

  const [sendBackModal, setSendBackModal] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [pageReset, setPageReset] = useState(false);

  const [rowCount, setRowCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [historyModalConfig, setHistoryModalConfig] =
    useState(defaultModalConfig);

  const getAlumniAliveTable = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      const params = {
        isAlive: Number(isAlive),
        isActive: Number(isActive),
      };

      const url = `${ApiService.alumni}/approval?${query}&${qs.stringify(
        params
      )}`;
      const response = await apiClient.get(url).then(e => e.data);
      setApprovalData(response.data);
      setRowCount(response.dataCount);
      if (page) setPagination(page);
      if (sort) setSorting(sort);
    },
    [isActive, isAlive]
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSelectedIds = new Set(prev);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return newSelectedIds;
    });
  };

  const columns = useMemo<ColumnDef<ListApproval>[]>(
    () => [
      {
        id: 'select',
        cell: info => (
          <RowCheckbox
            checked={selectedIds.has(info.row.original.approvalId)}
            onChange={() => toggleSelect(info.row.original.approvalId)}
          />
        ),
        enableSorting: false,
        size: 1,
      },
      {
        accessorKey: 'alumniNIM',
        header: 'NIM',
      },
      {
        accessorKey: 'alumniName',
        header: 'Name',
      },
      {
        accessorKey: 'campusName',
        header: 'Campus',
		cell: info => info.getValue() || '-',
      },
      {
        accessorKey: 'facultyName',
        header: 'Faculty',
		cell: info => info.getValue() || '-',
      },
      {
        accessorKey: 'programName',
        header: 'Program',
		cell: info => info.getValue() || '-',
      },
      ...specializedColumn,
      {
        accessorKey: 'userIn',
        header: 'Updated By',
      },
      {
        accessorKey: 'dateIn',
        header: 'Update Date',
        cell: info => {
          const value = info.getValue() as string;

          return formatDate(value, 'd MMMM yyyy, H:mm');
        },
      },
      {
        accessorKey: 'approvalStatusName',
        header: 'Status',
      },
      ...(!isActive
        ? [
            {
              accessorKey: 'reason',
              header: 'Send Back Reason',
            },
          ]
        : []),
      {
        accessorKey: 'alumniIsUpdated',
        header: 'Update History',
        id: 'update-alumni-history',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: info => {
          const alumniIsUpdated = info.getValue() as boolean;

          return alumniIsUpdated ? (
            <ActionSection
              clickHandler={async () => {
                setHistoryModalConfig(t => ({
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
                    `${ApiService.alumni}/update-history?${qs.stringify(
                      params
                    )}`
                  )
                  .then(e => e.data);

                setHistoryModalConfig(t => ({
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
    [isActive, selectedIds, specializedColumn]
  );

  const serverTable = ServerTableAjax<ListApproval>({
    data: approvalData,
    columns: isActionAllowed ? columns : columns.slice(1),
    rowCount,
    page: pagination,
    sort: sorting,
    isMultiSort: true,
    onTableChange: getAlumniAliveTable,
    pageReset,
    search: filter,
    totalRowSelected: isActionAllowed ? selectedIds.size : undefined,
  });

  const { showModal } = useModal();

  const handleApprove = useCallback(async () => {
    const payload = {
      approvalIds: [...selectedIds],
      IsApproved: true,
    };
    setActionLoading(true);

    await apiClient.patch(ApiService.alumni, payload);
  }, [selectedIds]);

  const handleSendBack = useCallback(
    async (reasson: string) => {
      setActionLoading(true);

      try {
        const payload = {
          approvalIds: [...selectedIds],
          IsApproved: false,
          reasson,
        };

        await apiClient.patch(ApiService.alumni, payload);

        setPageReset(prev => !prev);
        setSelectedIds(new Set());

        showModal({
          title: 'Success',
          message: 'Data has been successfully send back',
          options: {
            variant: 'success',
          },
        });
      } catch {
        showModal({
          title: 'Failed',
          message: 'Something went wrong',
          options: {
            variant: 'failed',
          },
        });
      } finally {
        setActionLoading(false);
      }
    },
    [selectedIds, showModal]
  );

  const handleActionConfirmation = useCallback(
    (action: string) => {
      if (selectedIds.size === 0) {
        showModal({
          title: 'Failed',
          message: 'No data selected',
          options: {
            variant: 'failed',
          },
        });
        return;
      }

      if (action === APPROVE_ACTION) {
        showModal({
          title: `Approval Confirmation`,
          message: `Are you sure you want to approve this data?`,
          options: {
            variant: 'success',
            cancelButton: true,
            onOk: async () => {
              setActionLoading(true);

              try {
                await handleApprove();

                setPageReset(prev => !prev);
                setSelectedIds(new Set());

                showModal({
                  title: 'Success',
                  message: 'Alumni data has been successfully updated',
                  options: {
                    variant: 'success',
                  },
                });
              } catch {
                showModal({
                  title: 'Failed',
                  message: 'Something went wrong',
                  options: {
                    variant: 'failed',
                  },
                });
              } finally {
                setActionLoading(false);
              }
            },
          },
        });
      } else {
        setSendBackModal(true);
      }
    },
    [handleApprove, selectedIds.size, showModal]
  );

  useEffect(() => {
    setPageReset(prev => !prev);
  }, [filter]);

  return (
    <>
      <AlumniUpdateHistory
        data={historyModalConfig.data}
        open={historyModalConfig.open}
        handleClose={() => setHistoryModalConfig(t => ({ ...t, open: false }))}
        loading={historyModalConfig.loading}
      />

      {serverTable}

      {isActionAllowed && (
        <>
          <ModalSendBack
            open={sendBackModal}
            handleClose={() => setSendBackModal(false)}
            handleSubmit={handleSendBack}
          />

          <Stack
            direction="row-reverse"
            marginTop={2}
            marginRight={2}
            gap={2}
            justifyContent="end"
          >
            <CustomLoadingButton
              loading={actionLoading}
              variant="contained"
              onClick={() => handleActionConfirmation(APPROVE_ACTION)}
              disabled={selectedIds.size === 0}
              sx={{ fontSize: '13px' }}
            >
              Approve
            </CustomLoadingButton>
            <CustomLoadingButton
              loading={actionLoading}
              sx={{ fontSize: '13px', width: 'fit-content' }}
              color="secondary"
              variant="contained"
              onClick={() => handleActionConfirmation(SEND_BACK_ACTION)}
              disabled={selectedIds.size === 0}
            >
              Send Back
            </CustomLoadingButton>
          </Stack>
        </>
      )}
    </>
  );
}
