import { useCallback, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import TableClientSide from '../../../../components/common/table/TableClientSide';
import { Option } from '../../../../interfaces/ITypes';
import { ImportFormValues } from '../../interface/Form';
import { ModalCity } from '../ModalCity';
import generateColumnPayload from './Column';

export default function AliveTableImport({
  companyCategory,
  sector,
  jobCategory,
  positionLevel,
  country,
  province,
  city,
  refetchAlumni,
  loading,
  refereshCity,
}: {
  companyCategory: Option[];
  sector: Option[];
  jobCategory: Option[];
  positionLevel: Option[];
  country: Option[];
  province: Option[];
  city: Option[];
  refetchAlumni: (
    newValue: string,
    rowIdentifier: 'alumniAlive' | 'alumniPassedAway',
    rowIndex: number
  ) => void;
  loading: boolean;
  refereshCity: () => void;
}) {
  const { control, formState } = useFormContext<ImportFormValues>();

  const { fields, remove, update } = useFieldArray({
    control,
    name: 'alumniAlive',
  });

  const [isModalCityOpen, setIsModalCityOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState('');

  const columns = useMemo(
    () =>
      generateColumnPayload(
        companyCategory,
        sector,
        jobCategory,
        positionLevel,
        country,
        province,
        city,
        control,
        remove,
        refetchAlumni,
        formState,
        setIsModalCityOpen,
        update,
        setSelectedCountryId,
        fields
      ),
    [
      city,
      companyCategory,
      country,
      jobCategory,
      positionLevel,
      province,
      sector,
      control,
      remove,
      refetchAlumni,
      formState,
      setIsModalCityOpen,
      update,
      setSelectedCountryId,
      fields,
    ]
  );

  return (
    <>
      <ModalCity
        selectedCountryId={selectedCountryId}
        countries={country}
        open={isModalCityOpen}
        handleClose={() => setIsModalCityOpen(false)}
        refreshCity={refereshCity}
      />

      <TableClientSide
        initialPageSize={10}
        columns={columns}
        data={fields}
        loading={loading}
      />
    </>
  );
}
