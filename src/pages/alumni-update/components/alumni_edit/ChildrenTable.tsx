import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Stack, Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { differenceInYears, formatDate, parse } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import TableClientSide from '../../../../components/common/table/TableClientSide';
import apiClient from '../../../../config/api-client';
import { ApiService } from '../../../../constants/ApiService';
import { Option } from '../../../../interfaces/ITypes';
import { ChildUpdatePayload } from '../../interface/Child';
import ChildrenFormDialog from './ChildrenFormDialog';

function calculateAge(dob: string): string {
  const date = parse(dob, 'MM/dd/yyyy', new Date());
  const age = differenceInYears(new Date(), date);

  return age < 1 ? '<1' : age.toString();
}

function ActionSection(childData, onEdit, onDelete) {
  const { alumniChildId } = childData;

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
        onClick={() => onEdit(childData)}
      >
        <EditIcon />
      </Button>
      <Button
        variant="contained"
        sx={{
          borderRadius: '999px',
          width: '36px',
          height: '36px',
          minWidth: 'fit-content',
          padding: 0,
        }}
        onClick={() => onDelete(alumniChildId)}
      >
        <DeleteIcon />
      </Button>
    </Stack>
  );
}

function findValue(master: Option[], selectedId) {
  return master.find(data => data.value === selectedId)?.label;
}

export default function ChildrenTable({
  childrenData,
  setChildrenData,
  editable,
}: {
  childrenData: ChildUpdatePayload[];
  setChildrenData: (childrenData) => void;
  editable: boolean;
}) {
  const [selectedData, setSelectedData] = useState<ChildUpdatePayload | null>(
    null
  );
  const [isChildFormOpen, setIsChildFormOpen] = useState(false);

  const [countryData, setCountryData] = useState([]);
  const [genderData, setGenderData] = useState([]);

  const handleEdit = (child: ChildUpdatePayload) => {
    setSelectedData(child);
    setIsChildFormOpen(true);
  };

  useEffect(() => {
    if (!isChildFormOpen) {
      setSelectedData(null);
    }
  }, [isChildFormOpen]);

  const handleDelete = useCallback(
    (id: string) => {
      const children = childrenData.find(child => child.alumniChildId === id);

      if (children?.isCreated) {
        setChildrenData(
          childrenData.filter(child => child.alumniChildId !== id)
        );
      } else {
        setChildrenData(
          childrenData.map(child =>
            child.alumniChildId === id ? { ...child, isDeleted: true } : child
          )
        );
      }
    },
    [childrenData, setChildrenData]
  );

  const getCountryData = async () => {
    const response = await apiClient.get(ApiService.country);

    setCountryData(response.data.listDropdown);
  };

  const getGenderData = async () => {
    const response = await apiClient.get(ApiService.gender);

    setGenderData(response.data.listDropdown);
  };

  useEffect(() => {
    getCountryData();
    getGenderData();
  }, []);

  const columns = useMemo<ColumnDef<ChildUpdatePayload>[]>(
    () => [
      {
        accessorKey: 'alumniChildName',
        header: 'Name',
      },
      {
        accessorKey: 'alumniChildDateBirth',
        header: 'Date of Birth',
        cell: info => formatDate(info.getValue() as string, 'dd LLLL yyyy'),
      },
      {
        accessorKey: 'alumniChildGenderId',
        header: 'Gender',
        cell: info => findValue(genderData, info.getValue()),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: info =>
          calculateAge(
            info.row.original.alumniChildDateBirth?.toString() ?? ''
          ),
        size: 1,
      },
      {
        accessorKey: 'alumniChildCountryId',
        header: 'Country',
        cell: info => findValue(countryData, info.getValue()),
      },
      {
        accessorKey: 'alumniChildId',
        header: 'Action',
        size: 1,
        enableSorting: false,
        cell: info =>
          ActionSection(info.row.original, handleEdit, handleDelete),
      },
    ],
    [countryData, genderData, handleDelete]
  );

  const columnVisibility = useMemo(
    () => ({
      alumniChildId: editable,
    }),
    [editable]
  );

  return (
    <>
      <ChildrenFormDialog
        open={isChildFormOpen}
        previousData={childrenData}
        submitHandler={value => setChildrenData(value)}
        handleClose={() => setIsChildFormOpen(false)}
        childData={selectedData}
      />

      <Button
        color={editable ? 'primary' : 'secondary'}
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={() => {
          setSelectedData(null);
          setIsChildFormOpen(true);
        }}
        disabled={!editable}
      >
        <AddCircleOutlineIcon fontSize="small" />
        <Typography
          variant="label"
          color="white"
          marginLeft={1}
          sx={{ marginBottom: '0 !important' }}
        >
          Add
        </Typography>
      </Button>

      <TableClientSide
        data={childrenData.filter(child => !child.isDeleted)}
        columns={columns}
        initialPageSize={10}
        columnVisibility={columnVisibility}
      />
    </>
  );
}
