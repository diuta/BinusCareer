import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import qs from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import { store } from '../../store';
import { setError } from '../../store/error/slice';
import UpdateAliveForm from './components/alumni_edit/UpdateAliveForm';
import UpdatePassedAwayForm from './components/alumni_edit/UpdatePassedAwayForm';
import AlumniUpdateHistory from './components/AlumniUpdateHistory';
import {
  AlumniContact,
  AlumniLog,
  AlumniUpdatePayload,
} from './interface/Alumni';
import { ChildUpdatePayload } from './interface/Child';

const formatDateOrDefault = (
  date?: string | null,
  formatPattern: string = 'dd/mm/yyyy'
) => (date ? format(new Date(date), formatPattern) : '-');

const defaultOrEmpty = (value?: string) => value || '-';

export function Edit() {
  const { alumniId } = useParams();
  const navigate = useNavigate();

  const [alumniHistoryModelOpen, setalumniHistoryModelOpen] = useState(false);

  const [alumni, setAlumni] = useState<AlumniUpdatePayload>({
    alumniId: 0,
    alumniNIM: '',
    alumniCode: '',
    alumniName: '',
    campusName: '',
    facultyName: '',
    programName: '-',
    degreeName: '',
    placeOfBirth: '',
    dateOfBirth: null,
    entryDate: null,
    graduationYear: null,
    companyName: '',
    positionName: '',
    positionLevelId: '',
    positionLevelName: '',
    alive: true,
    companyCategoryId: '',
    sectorId: '',
    jobCategoryId: '',
    countryId: '',
    provinceId: '',
    cityId: '',
    dateUp: '-',
    isUpdated: false,
    evidence: '',
  });
  const [isPassedAway, setIsPassedAway] = useState<number | null>(null);
  const [alumniEmail, setAlumniEmail] = useState<AlumniContact[]>([
    {
      id: 'Email_1',
      data: '',
      previousData: '',
      isPrimary: true,
      shown: false,
      generatedBySystem: false,
    },
    {
      id: 'Email_2',
      data: '',
      previousData: '',
      isPrimary: false,
      shown: false,
      generatedBySystem: false,
    },
    {
      id: 'Email_3',
      data: '',
      previousData: '',
      isPrimary: false,
      shown: false,
      generatedBySystem: false,
    },
  ]);

  const [alumniPhoneNumber, setAlumniPhoneNumber] = useState<AlumniContact[]>([
    {
      id: 'Phone_1',
      data: '',
      previousData: '',
      isPrimary: true,
      shown: false,
      generatedBySystem: false,
    },
    {
      id: 'Phone_2',
      data: '',
      previousData: '',
      isPrimary: false,
      shown: false,
      generatedBySystem: false,
    },
  ]);
  const [updateHistoryData, setUpdateHistoryData] = useState<AlumniLog[]>([]);
  const [loadingHistoryData, setLoadingHistoryData] = useState(true);
  const [alumniChild, setAlumniChild] = useState<ChildUpdatePayload[]>([]);
  const [loadingData, setloadingData] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  const getAlumniEmail = useCallback(async () => {
    const response = await apiClient.get(
      `${ApiService.alumni}/${alumniId}/email`
    );

    const dataResponse = response.data.sort(
      (a, b) => b.isPrimary - a.isPrimary
    );

    const changedAlumniEmail = alumniEmail;

    dataResponse.forEach((data, index) => {
      const row = changedAlumniEmail[index];

      if (!row) return;

      row.data = data.data;
      row.previousData = data.data;
      row.generatedBySystem = data.generatedBySystem;
      row.shown = true;
    });

    setAlumniEmail(changedAlumniEmail);
  }, [alumniEmail, alumniId]);

  const getAlumniPhone = useCallback(async () => {
    const response = await apiClient.get(
      `${ApiService.alumni}/${alumniId}/phone-number`
    );

    const dataResponse = response.data.sort(
      (a, b) => b.isPrimary - a.isPrimary
    );

    const changedAlumniPhoneNumber = alumniPhoneNumber;

    dataResponse.forEach((data, index) => {
      const row = changedAlumniPhoneNumber[index];

      if (!row) return;

      row.data = data.data;
      row.previousData = data.data;
      row.generatedBySystem = data.generatedBySystem;
      row.shown = true;
    });

    setAlumniPhoneNumber(changedAlumniPhoneNumber);
  }, [alumniId, alumniPhoneNumber]);

  const getAlumniChild = useCallback(async () => {
    const response = await apiClient.get(
      `${ApiService.alumni}/${alumniId}/child`
    );

    const dataResponse = response.data;

    setAlumniChild(dataResponse);
  }, [alumniId]);

  const getAlumni = useCallback(async () => {
    try {
      const response = await apiClient.get(`${ApiService.alumni}/${alumniId}`);

      const dataResponse: AlumniUpdatePayload = response.data;

      await getAlumniEmail();
      await getAlumniPhone();
      await getAlumniChild();

      setIsPassedAway(dataResponse.alive ? 0 : 1);
      setAlumni(dataResponse);
      setIsEditable(
        Boolean(dataResponse.alive) && !dataResponse.isUpdated
      );
      setloadingData(false);

      if (!dataResponse.alive || dataResponse.isUpdated) {
        const message = !dataResponse.alive
          ? 'Alumni already passed away'
          : 'Update Alumni Data On Progress';

        store.dispatch(
          setError({
            type: 'info',
            message,
            title: "Data can't be Updated",
          })
        );
      }
    } catch (error) {
      let message = 'Something went wrong, please try again later';
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          navigate('/not-found');
          return;
        }
        message = error.response?.data;
      }
      store.dispatch(
        setError({
          type: 'failed',
          message,
          title: "Data can't be Updated",
        })
      );
    }
  }, [alumniId, getAlumniChild, getAlumniEmail, getAlumniPhone, navigate]);

  const getUpdatedDataHistory = async alumniCode => {
    const params = {
      alumniCode,
      isCompleted: 1,
    };

    const response = await apiClient.get(
      `${ApiService.alumni}/update-history?${qs.stringify(params)}`
    );

    const dataResponse = response.data;

    setUpdateHistoryData(dataResponse);
    setLoadingHistoryData(false);
  };

  useEffect(() => {
    getAlumni();
  }, [getAlumni]);

  useEffect(() => {
    if (alumni.alumniCode) {
      getUpdatedDataHistory(alumni.alumniCode);
    }
  }, [alumni]);

  const [headerPortalElement, setHeaderPortalElement] =
    useState<Element | null>(null);

  useEffect(() => {
    const portalElement = document.querySelector('#header-portal-content');
    setHeaderPortalElement(portalElement);
  }, []);

  return (
    <>
      <AlumniUpdateHistory
        data={updateHistoryData}
        open={alumniHistoryModelOpen}
        handleClose={() => setalumniHistoryModelOpen(false)}
      />
      {headerPortalElement &&
        createPortal(
          <CustomLoadingButton
            loading={loadingHistoryData}
            startIcon={<VisibilityIcon />}
            variant="contained"
            sx={{ width: 'fit-content', marginLeft: '12px' }}
            onClick={() => setalumniHistoryModelOpen(true)}
          >
            <Typography variant="label" color="white">
              Update History
            </Typography>
          </CustomLoadingButton>,
          headerPortalElement
        )}

      <PageWrapper>
        <Stack direction="row" gap={2}>
          <Stack direction="column" gap={2} flex={1}>
            <Box component="div">
              <Typography variant="label">NIM</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.alumniNIM)}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Faculty</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.facultyName)}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Place, Date Of Birth</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {alumni.placeOfBirth},{' '}
                  {formatDateOrDefault(alumni.dateOfBirth, 'dd MMMM yyyy')}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Company Name</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.companyName)}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="column" gap={2} flex={1}>
            <Box component="div">
              <Typography variant="label">Name</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.alumniName)}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Program</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.programName)}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Entry Year</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {formatDateOrDefault(alumni.entryDate, 'yyyy')}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Position</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.positionName)}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="column" gap={2} flex={1}>
            <Box component="div">
              <Typography variant="label">Campus</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.campusName)}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Degree</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.degreeName)}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Graduation Year</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {formatDateOrDefault(alumni.graduationYear, 'yyyy')}
                </Typography>
              )}
            </Box>
            <Box component="div">
              <Typography variant="label">Position Level</Typography>
              {loadingData ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" display="block" fontWeight={600}>
                  {defaultOrEmpty(alumni.positionLevelName)}
                </Typography>
              )}
            </Box>
          </Stack>
        </Stack>
      </PageWrapper>
      <Divider />
      <PageWrapper>
        <FormControl>
          <Typography variant="label">Alumni Status</Typography>

          <Box display="flex" gap={2}>
            <Box>
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    value={0}
                    onChange={e => setIsPassedAway(Number(e.target.value))}
                    checked={isPassedAway === 0}
                  />
                }
                label={
                  <Typography
                    variant="label"
                    sx={{ marginBottom: '0 !important' }}
                  >
                    Alive
                  </Typography>
                }
                disabled={!isEditable}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    value={1}
                    onChange={e => setIsPassedAway(Number(e.target.value))}
                    checked={isPassedAway === 1}
                  />
                }
                label={
                  <Typography
                    variant="label"
                    sx={{ marginBottom: '0 !important' }}
                  >
                    Passed Away
                  </Typography>
                }
                disabled={!isEditable}
              />
            </Box>
          </Box>
        </FormControl>
      </PageWrapper>

      {isPassedAway !== null &&
        (isPassedAway ? (
          <UpdatePassedAwayForm alumni={alumni} editable={isEditable} />
        ) : (
          <UpdateAliveForm
            alumni={alumni}
            alumniEmail={alumniEmail}
            alumniPhoneNumber={alumniPhoneNumber}
            alumniChild={alumniChild}
            editable={isEditable}
          />
        ))}
    </>
  );
}
