import ClearIcon from '@mui/icons-material/Clear';
import { 
  Box,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    Typography,
 } from "@mui/material";
import { useFormik } from "formik";
import qs from 'qs'
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import MultiSelect from "../../components/common/multiselect/MultiSelect";
import PageWrapper from "../../components/container/PageWrapper";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import { Option } from "../../interfaces/ITypes";
import { selectProfile } from "../../store/profile/selector";
import { removeEmptyStringAndArray } from "../../utils/object-helper";
import { objectToQueryString } from "../../utils/string-helper";
import ReportTable from "./components/ReportTable";
import { IReportFilterFormValue} from "./interface/ReportInterface";

const initialValues: IReportFilterFormValue = {
  campusId: [],
  facultyId: [],
  programId: [],
  degreeId: [],
  leaderStatus: '',
}

export function ReportIkatanAlumni(){
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [campusList, setCampusList] = useState<Option[]>([]);
  const [campusWatcher, setCampusWatcher ] = useState<boolean>(false);
  const [facultyList, setfacultyList] = useState<Option[]>([]);
  const [facultyWatcher, setFacultyWatcher] = useState<boolean>(false);
  const [programList, setPogramList] = useState<Option[]>([]);
  const [programWatcher, setProgramWatcher] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportTableFilters, setReportTableFilters] = useState<string>('');

  const userProfile = useSelector(selectProfile);
  const { currentRoleDetailId } = userProfile;

  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: 10, 
  });  
  
  const [set, reset] = useState(false);

  const filterInvalidValue = (value: string[], list: Option[]) => value.filter((item) => list.map(dt => dt.value).includes(item));
  
  const getCampusesByRole = useCallback(async () => {
    const param = {
      roleDetailId: currentRoleDetailId,
      facultyId: formik.values.facultyId.length > 0 ? formik.values.facultyId: [],
      programId: formik.values.programId.length > 0 ? formik.values.programId : [],
      useCurrentRole: true
    };
    const response = await apiClient.get(`${ApiService.campus}`, { params: param, paramsSerializer: p => qs.stringify(p) });
    const mappedResponse = response.data.listDropdown;
    setCampusList(mappedResponse);
    formik.setFieldValue('campusId', filterInvalidValue(formik.values.campusId, mappedResponse));
  }, [facultyWatcher, programWatcher]);
  
  const getFacultiesByRole = useCallback(async () => {
    const param = {
      roleDetailId: currentRoleDetailId,
      campusId: formik.values.campusId.length > 0 ? formik.values.campusId : [],
      programId: formik.values.programId.length > 0 ? formik.values.programId : [],
      useCurrentRole: true
    };
    const response = await apiClient.get(`${ApiService.faculty}`, { params: param, paramsSerializer: p => qs.stringify(p) });
    const mappedResponse = response.data.listDropdown;
    setfacultyList(mappedResponse);
    formik.setFieldValue('facultyId', filterInvalidValue(formik.values.facultyId, mappedResponse));
  }, [campusWatcher, programWatcher]);
  
  const getProgramsByRole = useCallback(async () => {
    const param = {
      roleDetailId: currentRoleDetailId,
      campusId: formik.values.campusId.length > 0 ? formik.values.campusId : [],
      facultyId: formik.values.facultyId.length > 0 ? formik.values.facultyId : [],
      useCurrentRole: true
    };
    const response = await apiClient.get(`${ApiService.program}`, { params: param, paramsSerializer: p => qs.stringify(p) });
    const mappedResponse = response.data.listDropdown;
    setPogramList(mappedResponse);
    formik.setFieldValue('programId', filterInvalidValue(formik.values.programId, mappedResponse));
  }, [campusWatcher, facultyWatcher]);

  const getMasterFilters = async() => {
    getCampusesByRole();
    getFacultiesByRole();
    getProgramsByRole();
  }

  useEffect(() => {
    getMasterFilters();
  },[]);

  useEffect(() => {
    getFacultiesByRole();
    getProgramsByRole();
  }, [campusWatcher]);

  useEffect(() => {
    getCampusesByRole();
    getProgramsByRole();
  }, [facultyWatcher]);

  useEffect(() => {
    getCampusesByRole();
    getFacultiesByRole();
  }, [programWatcher]);

  const refreshDropdown = (field: string) => {
    switch(field){
      case 'campus':
        setCampusWatcher(!campusWatcher);
        break;
      case 'faculty':
        setFacultyWatcher(!facultyWatcher);
        break;
      case 'program':
        setProgramWatcher(!programWatcher);
        break;
      default:
        break;
    }
  }

  const formik = useFormik<IReportFilterFormValue>({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      setLoading(true)
      const values = removeEmptyStringAndArray(formik.values);
      setReportTableFilters(objectToQueryString(values));
      setPagination({
        pageIndex: 0,
        pageSize: 10
      });
      setLoading(false)
    },
  });

  return(
      <PageWrapper>
          <form onSubmit={formik.handleSubmit}>
            <Stack gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                marginTop={2}
              >
                <FormControl fullWidth>
                  <Typography fontSize='12px'>Faculty</Typography>
                  <MultiSelect
                    name="facultyId"
                    onChange={(value) => {
                      formik.setFieldValue('facultyId', value);
                      refreshDropdown('faculty');
                    }}	
                    onClear={() => {
                      formik.setFieldValue('facultyId', []);
                      refreshDropdown('faculty');
                    }}
                    data={facultyList}
                    value={formik.values.facultyId}
                    sx={{ width: '100%' }}
                  >
                    {facultyList.map(item => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
                <FormControl fullWidth>
                  <Typography fontSize='12px'>Program</Typography>
                  <MultiSelect
                    name="programId"
                    onChange={(value) => {
                      formik.setFieldValue('programId', value);
                      refreshDropdown('program');
                    }}	
                    onClear={() => {
                      formik.setFieldValue('programId', []);
                      refreshDropdown('program');
                    }}
                    data={programList}
                    value={formik.values.programId}
                    sx={{ width: '100%' }}
                  >
                    {programList.map(item => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
              </Stack>

              <Stack gap='10px' sx={{ width: {s: '100%', md:'49%'} }}>
                  <Typography fontSize='12px'>Leader Status</Typography>
                  <Select
                  endAdornment={
                    formik.values.leaderStatus !== '' && (
                      <InputAdornment
                        position="end"
                        sx={{ position: 'absolute', right: '25px' }}
                      >
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            formik.setFieldValue('leaderStatus', '');
                          }}
                        >
                          <ClearIcon sx={{ color: 'grey' }} />
                        </IconButton>
                      </InputAdornment>
                    )}
                  value={formik.values.leaderStatus}
                  onChange={(selectedValues) => {
                    formik.setFieldValue('leaderStatus', selectedValues.target.value);
                  }}
                  >
                      <MenuItem value='Active'>Active</MenuItem>
                      <MenuItem value='Not Active'>Not Active</MenuItem>
                  </Select>
              </Stack>
              
              <Stack direction='row' gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
                    <Box sx={{flexGrow: 1}}/>
                    <CustomLoadingButton sx={{ fontSize:'13px' }} type="submit" loading={loading} onClick={() => {
                      reset(!set);
                      setDataWatcher(!dataWatcher);
                    }}>
                      Apply
                    </CustomLoadingButton>
                  </Stack>
            </Stack>
          </form>
          <Divider sx={{marginY: "20px"}}/>
          <ReportTable 
            filters={reportTableFilters}
            values = {formik.values}
            set = {set}
            reset = {reset}
            pagination = {pagination}
            setPagination = {setPagination}
            dataWatcher = {dataWatcher}
            />
      </PageWrapper>
  )
}