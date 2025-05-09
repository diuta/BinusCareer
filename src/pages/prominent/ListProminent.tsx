import { Box, 
  Button, 
  CircularProgress, 
  Divider, 
  FormControl, 
  IconButton, 
  InputAdornment, 
  MenuItem, 
  Select, 
  Stack, 
  TextField, 
  Typography } from "@mui/material";
import PageWrapper from "../../components/container/PageWrapper";
import { To, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCallback, useEffect, useState } from "react";
import { layoutPrivateStyle } from "../../styles/layout/private-routes";
import { RiFolderReceivedFill } from "react-icons/ri";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import { Option } from "../../interfaces/ITypes";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profile/selector";
import { useFormik } from "formik";
import { removeEmptyStringAndArray } from "../../utils/object-helper";
import { objectToQueryString } from "../../utils/string-helper";
import MultiSelect from "../../components/common/multiselect/MultiSelect";
import ProminentTable from "./components/ProminentTable";
import { IMappingCampusProgramProps, IProminentFilterFormValue } from "./Interface/IListProminent";
import qs from 'qs'

const initialValues: IProminentFilterFormValue = {
  campusId: [],
  facultyId: [],
  programId: [],
  degreeId: [],
}

export default function ListProminent (){
    const [dataWatcher, setDataWatcher] = useState<boolean>(false);
    const [campusList, setCampusList] = useState<Option[]>([]);
    const [campusWatcher, setCampusWatcher ] = useState<boolean>(false);
    const [facultyList, setfacultyList] = useState<Option[]>([]);
    const [facultyWatcher, setFacultyWatcher] = useState<boolean>(false);
    const [programList, setPogramList] = useState<Option[]>([]);
    const [programWatcher, setProgramWatcher] = useState<boolean>(false);
    const [degreeList, setDegreeList] = useState<Option[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [prominentTableFilters, setProminentTableFilters] = useState<string>('');
    const [roleName,setRoleName] =useState<string[]>([]);

    const userProfile = useSelector(selectProfile);
    const { currentRoleDetailId, rolePermissions } = userProfile;
    const Navigate = useNavigate();

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
  
      const degreesResponse = await apiClient.get(`${ApiService.degree}`);
      setDegreeList(degreesResponse.data.listDropdown);
    }

    useEffect(() => {
      getMasterFilters();
      rolePermissions.map((item)=> {
        setRoleName((prevData)=>[...prevData, item.permissionName])
      });
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

    const formik = useFormik<IProminentFilterFormValue>({
      initialValues,
      enableReinitialize: true,
      onSubmit: () => {
        const values = removeEmptyStringAndArray(formik.values);
        setProminentTableFilters(objectToQueryString(values));
        const param = {
          CampusId: formik.values.campusId,
          FacultyId: formik.values.facultyId,
          ProgramId: formik.values.programId,
          DegreeId: formik.values.degreeId,
        };
        setPagination({
          pageIndex: 0,
          pageSize: 10
        });
      },
    });

    const handleImport = () => {
      Navigate('/prominent/import');
    };
  
    const handleAdd = () => {
      Navigate('/prominent/add');
    };    

    return (
        <PageWrapper>
            <form onSubmit={formik.handleSubmit}>
              <Stack gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
                <Stack
                  direction='row'
                  width='100%'
                >
                  <FormControl fullWidth>
                    <Typography fontSize='12px'>Campus</Typography>
                    <MultiSelect
                      name="campusId"
                      onChange={(value) => {
                        formik.setFieldValue('campusId', value);
                        refreshDropdown('campus');
                      }}
                      onClear={() => {
                        formik.setFieldValue('campusId', []);
                        refreshDropdown('campus');
                      }}
                      data={campusList}
                      value={formik.values.campusId}
                      sx={{ width: '100%' }}
                    >
                      {campusList.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </MultiSelect>
                  </FormControl>
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  marginTop={2}
                >
                  <FormControl fullWidth>
                    <Typography fontSize='12px'>Faculty</Typography>
                    <MultiSelect
                      name="facultyId"
                      data={facultyList}
                      onChange={(value) => {
                        formik.setFieldValue('facultyId', value);
                        refreshDropdown('faculty');
                      }}	
                      onClear={() => {
                        formik.setFieldValue('facultyId', []);
                        refreshDropdown('faculty');
                      }}
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
                  <FormControl fullWidth>
                    <Typography fontSize='12px'>Degree</Typography>
                    <MultiSelect
                      name="degreeId"
                      onChange={(value) => formik.setFieldValue('degreeId', value)}	
                      onClear={() => formik.setFieldValue('degreeId', [])}
                      data={degreeList}
                      value={formik.values.degreeId}
                      sx={{ width: '100%' }}
                    >
                      {degreeList.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </MultiSelect>
                  </FormControl>
                </Stack>
                {roleName.includes("add-prominent") ? (
                  <Stack direction='row' gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                      size='medium'
                      onClick={handleAdd}
                      startIcon={<AddCircleOutlineIcon fontSize='large'/>}
                    >
                      <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Add</Typography>
                    </Button>
                    <Button
                      variant="contained"
                      color='success'
                      sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                      size='medium'
                      onClick={handleImport}
                      startIcon={<RiFolderReceivedFill/>}
                    >
                      <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Import</Typography>
                    </Button>
                    <Box sx={{flexGrow: 1}}/>
                    <CustomLoadingButton sx={{ fontSize:'13px' }} type="submit" loading={loading} onClick={() => {
                      reset(!set);
                      setDataWatcher(!dataWatcher);
                    }}>
                      Apply
                    </CustomLoadingButton>
                  </Stack>
                ) : (
                  <Stack direction='row' gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
                    <Box sx={{flexGrow: 1}}/>
                    <CustomLoadingButton type="submit" loading={loading} onClick={() => {
                      reset(!set);
                      setDataWatcher(!dataWatcher);
                    }}>
                      Apply
                    </CustomLoadingButton>
                  </Stack>
                )}
              </Stack>
            </form>
            <Divider sx={{marginY: "20px"}}/>
            <ProminentTable 
            filters={prominentTableFilters}
            values = {formik.values}
            set = {set}
            reset = {reset}
            pagination = {pagination}
            setPagination = {setPagination}
            dataWatcher = {dataWatcher}
            />
        </PageWrapper>
      );
}