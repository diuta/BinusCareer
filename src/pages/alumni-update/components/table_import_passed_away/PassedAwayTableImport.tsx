import { useCallback, useMemo, useState } from 'react';
import {
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';

import TableClientSide from '../../../../components/common/table/TableClientSide';
import { ImportFormValues } from '../../interface/Form';
import generateColumnPayload from './Column';

export default function PassedAwayTableImport({
  refetchAlumni,
  loading,
}: {
  refetchAlumni: (
    newValue: string,
    rowIdentifier: 'alumniAlive' | 'alumniPassedAway',
    rowIndex: number
  ) => void;
  loading: boolean;
}) {
  const { control, formState } = useFormContext<ImportFormValues>();

  const { fields, remove } = useFieldArray({
    control,
    name: 'alumniPassedAway',
  });

  const columns = useMemo(
    () => generateColumnPayload(control, remove, refetchAlumni, formState),
    [control, formState, refetchAlumni, remove]
  );

  return (
    <TableClientSide
      initialPageSize={10}
      columns={columns}
      data={fields}
      loading={loading}
    />
  );
}
