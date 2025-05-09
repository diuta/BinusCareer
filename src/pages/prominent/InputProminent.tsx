import { Add as AddIcon, DeleteRounded as DeleteIcon } from '@mui/icons-material';
import {
Box,
Button,
CircularProgress,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
Divider,
IconButton,
MenuItem,
Select,
Stack,
TextField,
Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { FieldArray, FormikErrors,FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import * as Yup from 'yup';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import Datepicker from '../../components/common/Datepicker';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';
import { selectProfile } from '../../store/profile/selector';
import EndowmentTableForProminent from './components/EndowmentTableForProminent';
import EngagementTableForProminent from './components/EngagementTableForProminent';
import { InputAchievement } from './components/InputAchievement';
import InputBinusSupport from './components/InputBinusSupport';
import { IAchievement, IAchievementCategory, IAlumniData, IEvidence, IFormValues } from './Interface/IInputProminent';

const generateId = () => `_${Math.random().toString(36).slice(2, 9)}`;

function convertToUTCWithoutChangingDate(date) {
    const [day, month, year] = date.split("-").map(Number);

  const dateSent = new Date(year, month - 1, day);

  const localOffset = dateSent.getTimezoneOffset() * 60_000;

  const utcDate = new Date(dateSent.getTime() - localOffset);

  return utcDate.toISOString();
}

const getLastDateOfCurrentMonth = () => {
    const today = new Date(); 
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
    return format(lastDay, 'dd-MM-yyyy');
};

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return true;
    } catch {
        return false;
    }
}  

export default function InputProminent() {
    const [alumni, setAlumni] = useState<IAlumniData | null>(null);
    const [searchNIM, setSearchNIM] = useState("")
    const [openAchievementEvidence, setOpenAchievementEvidence] = useState(false);
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState<number>(0);
    const [prevData, setPrevData] = useState<any[]>([]);
    const [achievementCategory, setAchievementCategory] = useState<IAchievementCategory[]>([])
    const [errorEvidence , setErrorEvidence] = useState<string[]>([])
    const [errorFile, setErrorFile] = useState<string[][]>([])
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false)
    const userProfile = useSelector(selectProfile)
    const { showModal } = useModal();
    const Navigate = useNavigate();

    const validationSchema = Yup.object({
        alumniId: Yup.string().required("Required"),
      
        period: Yup.string()
          .required("Period is Required"),
      
        date: Yup.string()
          .required("Date is Required"),
      
        binusSupport: Yup.array()
          .of(Yup.string().required("Support detail is required"))
          .min(1, "At least one Binus Support entry is required"),
      
        userIn: Yup.string().required("Required"),
      
        achievements: Yup.array()
          .of(
            Yup.object().shape({
              achievementCategory: Yup.string().required("Achievement Category is Required"),
              achievementName: Yup.string().required("Achievement name is required"),
            })
          )
        .min(1, "At least one achievement is required"),
    });

    const validateEvidence = () => {
        const { alumniId, period, date, achievements, binusSupport, userIn } = formik.values;
        const newErrorEvidence = [...errorEvidence];
        let hasError = false;
        if (achievements[currentAchievementIndex].achievementEvidence.length == 1) {
            newErrorEvidence[currentAchievementIndex] = "Evidence must be filled";
            hasError = true;
            setErrorEvidence(newErrorEvidence);
            if (hasError) {
                setOpenAchievementEvidence(false);
                return;
            }
        }
        newErrorEvidence[currentAchievementIndex] = "";
        setErrorEvidence(newErrorEvidence);
        setOpenAchievementEvidence(false);
    };

    const formik = useFormik<IFormValues>({
        initialValues: {
          alumniId: '',
          period: getLastDateOfCurrentMonth(),
          date: null,
          achievements: [],
          binusSupport: [],
          userIn: userProfile.email,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
            setLoading(true)
            errorEvidence.forEach(item => {
                if (item !== "") {
                    const error = new Error("Input Failed");
                    throw error;
                }
                
            });
            const formData = new FormData();
            formData.append('alumniId', values.alumniId);
      
            if (values.date) {
              const dateSent = convertToUTCWithoutChangingDate(values.date);
              formData.append('date', dateSent);
            }
            if (values.period) {
              const periodSent = convertToUTCWithoutChangingDate(values.period);
              formData.append('period', periodSent);
            }
      
            const achievementPromises = values.achievements.map(async (achievement, index) => {
                formData.append(`achievements[${index}].achievementCategory`, achievement.achievementCategory.  toString());
                formData.append(`achievements[${index}].achievementName`, achievement.achievementName);
      
                const achievementEvidencePromises = achievement.achievementEvidence.slice(0, -1).map(async (evidence, evidenceIndex) => {
                    formData.append(`achievements[${index}].achievementEvidence[${evidenceIndex}].evidenceType`, evidence.evidenceType);
                    
                    if (evidence.evidence && evidence.evidence instanceof File) {
                        const formFile = new FormData();
                        formFile.append(`uploadedFile`, evidence.evidence);
                        formFile.append('alumniId', values.alumniId);
                        
                        const upload = await apiClient.post(`${ApiService.prominent}/upload-to-share-point`, formFile, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                        });
                        
                        formData.append(`achievements[${index}].achievementEvidence[${evidenceIndex}].evidence`, upload.data.filePath);
                    } else if (evidence.evidence && typeof evidence.evidence === "string") {
                        formData.append(`achievements[${index}].achievementEvidence[${evidenceIndex}].evidence`, evidence.evidence);
                    }
                });
            
                await Promise.all(achievementEvidencePromises);
            });

            await Promise.all(achievementPromises);
      
            formData.append('binusSupport', values.binusSupport.join(','));
            formData.append('userIn', values.userIn);

            const response = await apiClient.post(`${ApiService.prominent}/input-prominent`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              responseType: 'blob',
            });
            setLoading(false)
      
            showModal({
              title: 'Success',
              message: 'Add Data Request is Submitted Successfully',
              options: {
                variant: 'success',
                onOk: () => Navigate('/prominent/approval'),
              },
            });
          } catch (error) {
            console.error(error); // Ensure the error is logged
            showModal({
              title: 'Failed',
              message: 'Check again the inputted data',
              options: { variant: 'failed' , onOk: () => setLoading(false)},
            });
          }
        },
    });

    const handleChangeNIM =  useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearchNIM(searchTerm);
    }, 500);  

    const handeSearchAlumni = async () => {
        setLoadingSearch(true)
        setAlumni(null);
        formik.resetForm();
        try
        {
            const response = await apiClient.get(`${ApiService.prominent}/alumni-data-for-prominent?alumniId=${searchNIM}`)
            if (response.data){
                if(response.data.mappingId != null){
                    setAlumni(response.data)
                    formik.setFieldValue('alumniId', response.data.alumniId)
                    setLoadingSearch(false)
                } else {
                    showModal({
                        title: 'Failed',
                        message: 'Alumni Program Not Found',
                        options: { 
                            variant: 'failed',
                            onOk: () => setLoadingSearch(false)
                         },
                    });
                    setAlumni(null)
                    formik.setFieldValue('alumniId', '')
                }
            } else {
                showModal({
                    title: 'Failed',
                    message: 'NIM Not Found',
                    options: { 
                        variant: 'failed',
                        onOk: () => setLoadingSearch(false)
                     },
                });
            }
        } 
        catch {
            showModal({
                title: 'Failed',
                message: 'NIM Not Found',
                options: { 
                    variant: 'failed',
                    onOk: () => setLoadingSearch(false)
                 },
            });
        }
    }

    const handleOpenEvidenceDialog = (index: number) => {
        setCurrentAchievementIndex(index);
        setPrevData(formik.values.achievements[index].achievementEvidence);
        setOpenAchievementEvidence(true);
    };

    const handleCancelEvidence = () => {
        if (currentAchievementIndex && formik.values.achievements[currentAchievementIndex].achievementEvidence.length === 1){
            setErrorEvidence(prevErrorEvidence => {
                const updatedErrors = [...prevErrorEvidence];
                updatedErrors[currentAchievementIndex] = "There must be at least 1 evidence";
                return updatedErrors;
            });
        }
        formik.setFieldValue(`achievements[${currentAchievementIndex}].achievementEvidence`, prevData)
        setOpenAchievementEvidence(false);
    }

    const getAchievementCategory = async () => {
        const response = await apiClient.get(`${ApiService.prominent}/prominent-achievement-category`)
        setAchievementCategory(response.data.listGetProminentAchievementCategoryResponseDTO)
    }

    function getNameById(id: number) {
        const target = achievementCategory.find((item) => item.achievementCategoryId === id);
        return target ? target.achievementCategoryName : "Name not found";
    }


    const handleAddEvidence = (push) => {
        const currentEvidence = formik.values.achievements[currentAchievementIndex].achievementEvidence;
        const lastEvidence = currentEvidence[currentEvidence.length - 1];

    
        if (!lastEvidence.evidence) {
            setErrorFile(prevErrorFile => {
                const newErrorFile = [...prevErrorFile];
                if (!newErrorFile[currentAchievementIndex]) {
                    newErrorFile[currentAchievementIndex] = [];
                }
                newErrorFile[currentAchievementIndex][currentEvidence.length - 1] = "Evidence cannot be empty";
                return newErrorFile;
            });
        } else {
            if (typeof lastEvidence.evidence === "string" && !isValidUrl(lastEvidence.evidence)){
                setErrorFile(prevErrorFile => {
                    const newErrorFile = [...prevErrorFile];
                    if (!newErrorFile[currentAchievementIndex]) {
                        newErrorFile[currentAchievementIndex] = [];
                    }
                    newErrorFile[currentAchievementIndex][currentEvidence.length - 1]  = "Invalid URL";
                    return newErrorFile;
                });
                return;
            }
            // Clear the error if the current evidence is valid
            setErrorFile(prevErrorFile => {
                const newErrorFile = [...prevErrorFile];
                if (newErrorFile[currentAchievementIndex] && newErrorFile[currentAchievementIndex][currentEvidence.length - 1]) {
                    newErrorFile[currentAchievementIndex][currentEvidence.length - 1] = "";
                }
                return newErrorFile;
            });
            
            // Push new evidence row
            push({ id: generateId(), evidenceType: 'URL', evidence: null });
        }
    };

    const addName = (evidence : IEvidence) => {
        let name = ''
        if(evidence.evidence instanceof File){
          name = evidence.evidence.name;
        }
  
        return(
          <span 
          style={{ fontSize: '14px', color: '#333' }}>
              {name}
          </span>
        )
    };
    
    const handleRemoveAchievementRow = (remove, index) => {
        remove(index);
        setErrorEvidence(errorEvidence.filter((_, i) => i !== index));
        setErrorFile(errorFile.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if(currentAchievementIndex){
            setPrevData(formik.values.achievements[currentAchievementIndex].achievementEvidence);
        }
    },[currentAchievementIndex])

    useEffect(() => {
        getAchievementCategory();
    }, [])
    

    return (
        <PageWrapper>
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit} >
                    <Stack spacing={2}>
                        <Stack gap={2}>
                            <Typography fontSize='12px'>NIM</Typography>
                            <Stack 
                            direction='row' 
                            justifyContent='center' 
                            alignItems='center' 
                            minWidth='99%'
                            gap='15px'>
                                <TextField
                                sx={{ width:'93%' }}
                                placeholder="Input Your NIM"
                                variant="outlined"
                                name="nim"
                                onChange={handleChangeNIM}
                                />
                                <CustomLoadingButton
                                    loading={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                                    variant="contained"
                                    sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white'}}
                                    size='medium'
                                    onClick={handeSearchAlumni}
                                >
                                    <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loadingSearch ? 'Searching...' : 'Search'}</Typography>
                                </CustomLoadingButton>
                            </Stack>
                        </Stack>
                        {alumni ? (
                            <Stack spacing={3}>
                                <Stack direction='row' gap='25%' paddingLeft='1%' paddingRight='1%'>
                                    <Stack spacing={2}>
                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Name</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>{alumni.name}</Typography>
                                        </Stack>

                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Program</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>{alumni.program}</Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack spacing={2}>
                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Campus</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>{alumni.campus}</Typography>
                                        </Stack>

                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Degree</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>{alumni.degree}</Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack spacing={2}>
                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Faculty</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>{alumni.faculty}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Divider sx={{marginY: "20px"}}/>

                                <Stack direction='row' gap={3}>
                                    <Stack width='49%' gap={2}>
                                        <Typography fontSize='12px'>Period</Typography>
                                        <Stack>
                                            <Datepicker
                                            value={formik.values.period }
                                            onChange={(date) => formik.setFieldValue('period', date)}
                                            id='period'
                                            dateFormat='dd-MM-yyyy'
                                            autoClose
                                            clearIcon
                                            />
                                            {formik.touched.period && formik.errors.period && (
                                                <Typography
                                                sx=
                                                {{
                                                    color: '#9F041B',
                                                    fontFamily: 'font-family: Open Sans, sans-serif',
                                                    fontWeight: 400,
                                                    fontSize: '0.75em',
                                                    lineHeight: '1.66',
                                                    textAlign: 'left',
                                                    marginTop: '3px',
                                                    marginRight: '14px',
                                                    marginBottom: 0,
                                                    marginLeft: '14px'
                                                }}>
                                                    {typeof formik.errors.period === 'string' ? formik.errors.period : ''}
                                                </Typography>
                                            )}
                                        </Stack>

                                        </Stack>
                                        <Stack width='49%' gap={2}>
                                            <Typography fontSize='12px'>Date</Typography>
                                            <Stack>
                                                <Datepicker
                                                value={formik.values.date}
                                                onChange={(date) => formik.setFieldValue('date', date)}
                                                id='date'
                                                dateFormat='dd-MM-yyyy'
                                                autoClose
                                                clearIcon
                                                />
                                                {formik.touched.date && formik.errors.date && (
                                                    <Typography
                                                    sx=
                                                    {{
                                                        color: '#9F041B',
                                                        fontFamily: 'font-family: Open Sans, sans-serif',
                                                        fontWeight: 400,
                                                        fontSize: '0.75em',
                                                        lineHeight: '1.66',
                                                        textAlign: 'left',
                                                        marginTop: '3px',
                                                        marginRight: '14px',
                                                        marginBottom: 0,
                                                        marginLeft: '14px'
                                                    }}>
                                                        {typeof formik.errors.date === 'string' ? formik.errors.date : ''}
                                                    </Typography>
                                                )}
                                            </Stack>

                                    </Stack>
                                </Stack>
                                <Box
                                    sx={{
                                    overflowX: 'auto',
                                    width: '100%',
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Typography fontSize='12px'>Achievement</Typography>
                                        <Stack spacing={1} 
                                        sx={{ backgroundColor:'white', padding: '20px', border: 'solid thin #D9D9D9', borderRadius:'10px', minWidth:'1100px' , overflowX:'auto'}}
                                        >
                                            <Stack spacing={2} direction="row">
                                                <Typography 
                                                sx={{
                                                    fontWeight:600, 
                                                    minWidth:'28%' , 
                                                    fontSize: '12px'
                                                }}
                                                >
                                                Achievement Category
                                                </Typography>
                                                <Typography 
                                                sx={{
                                                    fontWeight:600, 
                                                    minWidth:'36%' , 
                                                    fontSize: '12px'
                                                }}
                                                >
                                                Achievement
                                                </Typography>
                                                <Typography 
                                                sx={{
                                                    fontWeight:600, 
                                                    minWidth:'20%' , 
                                                    fontSize: '12px'
                                                }}
                                                >
                                                Achievement Evidence
                                                </Typography>
                                                <Typography 
                                                sx={{ 
                                                    fontWeight:600, 
                                                    textAlign:'center ', 
                                                    minWidth:'12%', 
                                                    fontSize: '12px'
                                                }}
                                                >
                                                Action
                                                </Typography>
                                            </Stack>
                                            <FieldArray name="achievements">
                                                {({ remove }) => (
                                                    <Stack>
                                                        {formik.values.achievements.length > 0 && formik.values.achievements.map((achievement, index) => (
                                                        <Stack spacing={1}>

                                                            <Stack
                                                                direction="row"
                                                                spacing={2}
                                                                alignItems="start"
                                                            >
                                                                <TextField
                                                                select
                                                                variant="outlined"
                                                                name={`achievements[${index}].achievementCategory`}
                                                                value={formik.values.achievements[index].achievementCategory}
                                                                onChange={formik.handleChange}
                                                                error={
                                                                    formik.touched.achievements &&
                                                                    formik.touched.achievements[index] &&
                                                                    Array.isArray(formik.errors.achievements) &&
                                                                    formik.errors.achievements[index] !== undefined && 
                                                                    typeof formik.errors.achievements[index] === 'object' && 
                                                                    Boolean(
                                                                        formik.errors.achievements[index] &&
                                                                        (formik.errors.achievements[index] as FormikErrors<IAchievement>).achievementCategory
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik.touched.achievements &&
                                                                    formik.touched.achievements[index] &&
                                                                    Array.isArray(formik.errors.achievements) &&
                                                                    formik.errors.achievements[index] !== undefined &&
                                                                    typeof formik.errors.achievements[index] === 'object' &&
                                                                    formik.errors.achievements[index] &&
                                                                    (formik.errors.achievements[index] as FormikErrors<IAchievement>).achievementCategory
                                                                }
                                                                sx={{minWidth: '28%',}}
                                                                >
                                                                    <MenuItem value=''>Select Category</MenuItem>
                                                                    {achievementCategory?.map((category) => (
                                                                        <MenuItem
                                                                            key={category.achievementCategoryId}
                                                                            value={category.achievementCategoryId}
                                                                        >
                                                                            {category.achievementCategoryName}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                                <TextField
                                                                variant="outlined"
                                                                name={`achievements[${index}].achievementName`}
                                                                value={achievement.achievementName}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    !!(
                                                                    formik.touched.achievements?.[index]?.achievementName &&
                                                                    Array.isArray(formik.errors.achievements) &&
                                                                    formik.errors.achievements[index] &&
                                                                    typeof formik.errors.achievements[index] !== "string" &&
                                                                    (formik.errors.achievements[index] as FormikErrors<IAchievement>).achievementName
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik.touched.achievements?.[index]?.achievementName &&
                                                                    Array.isArray(formik.errors.achievements) &&
                                                                    formik.errors.achievements[index] &&
                                                                    typeof formik.errors.achievements[index] !== "string"
                                                                    ? (formik.errors.achievements[index] as FormikErrors<IAchievement>).achievementName
                                                                    : ''
                                                                }
                                                                sx={{
                                                                    minWidth: '36%',
                                                                    fontSize: '13px',
                                                                }}
                                                                />

                                                                <Stack minWidth='20%'>
                                                                    <Button
                                                                    variant="contained"
                                                                    startIcon={<AddIcon 
                                                                                sx={{
                                                                                    border: '2px solid white', 
                                                                                    borderRadius:'10px' 
                                                                                }}
                                                                                />}
                                                                    sx={{ 
                                                                        backgroundColor: '#FF9800',  
                                                                        fontSize: '13px',
                                                                        width:'100%'
                                                                    }}
                                                                    onClick={() => handleOpenEvidenceDialog(index)}
                                                                    >
                                                                    Upload Evidence
                                                                    </Button>
                                                                    {errorEvidence[index] !== "" && (
                                                                        <Typography
                                                                            sx={{
                                                                                color: '#9F041B',
                                                                                fontFamily: 'Open Sans, sans-serif',
                                                                                fontWeight: 400,
                                                                                fontSize: '0.75em',
                                                                                lineHeight: '1.66',
                                                                                textAlign: 'left',
                                                                                marginTop: '3px',
                                                                                marginRight: '14px',
                                                                                marginBottom: 0,
                                                                                marginLeft: '14px'
                                                                            }}
                                                                        >
                                                                            {errorEvidence[index]}
                                                                        </Typography>
                                                                    )}
                                                                </Stack>
                                                                <Stack alignItems='center' width='12%'>
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        color="error"
                                                                        onClick={() => handleRemoveAchievementRow(remove, index)}
                                                                        sx={{minWidth:'36px'}}
                                                                    >
                                                                        <DeleteIcon  
                                                                        sx={{
                                                                            border: '2px solid white', 
                                                                            background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', 
                                                                            color:'white', 
                                                                            borderRadius: '15px', 
                                                                            padding: '4px', 
                                                                            width:'auto', 
                                                                            height:'31px'
                                                                        }}
                                                                        />
                                                                    </IconButton>
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                        ))}
                                                    </Stack>
                                                )}
                                            </FieldArray>

                                            <InputAchievement
                                            achievementRows={formik.values.achievements}
                                            setAchievementRows={achievement => formik.setFieldValue('achievements', achievement)}
                                            name={alumni.name}
                                            nim = {alumni.alumniId}
                                            achievementCategory = {achievementCategory}
                                            setErrorAchievement={error => formik.setFieldError("achievements[0].achievementCategory",error)}
                                            setErrorEvidenceParent = {error => setErrorEvidence(error)}
                                            setErrorFileParent = {error => setErrorFile(error)}
                                            />

                                            {formik.errors.achievements && formik.touched.achievements &&
                                            typeof formik.errors.achievements === "string" && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>
                                                {formik.errors.achievements}
                                                </div>
                                            )}

                                            <Typography fontWeight="600" fontSize="12px">
                                                *Achievement data will only be saved to the system after the &quot;Add&quot; button is clicked
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                                <Box
                                    sx={{
                                    overflowX: 'auto',
                                    width: '100%',
                                    }}
                                >   
                                    <Stack spacing={2}>
                                        <Typography fontSize='12px'>Binus Support</Typography>
                                        <Stack
                                            spacing={1}
                                            sx={{
                                            backgroundColor: 'white',
                                            padding: '20px',
                                            border: 'solid thin #D9D9D9',
                                            borderRadius: '10px',
                                            overflowX: 'auto',
                                            minWidth:'1100px'
                                            }}
                                        >
                                            <Stack spacing={2} direction="row" alignItems="center">
                                            <Typography
                                                sx={{
                                                fontWeight: 600,
                                                minWidth: '87%',
                                                fontSize: '12px',
                                                }}
                                            >
                                                Binus Support
                                            </Typography>
                                            <Typography
                                                sx={{
                                                fontWeight: 600,
                                                minWidth: '12%',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                }}
                                            >
                                                Action
                                            </Typography>
                                            </Stack>

                                            <FieldArray name="binusSupport">
                                            {({ remove }) => (
                                                <Stack>
                                                    {formik.values.binusSupport.length > 0 && formik.values.binusSupport.map((support, index) => (
                                                            <Stack
                                                            direction="row"
                                                            spacing={2}
                                                            alignItems="start"
                                                            >
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                name={`binusSupport[${index}]`}
                                                                value={support}
                                                                onChange={formik.handleChange}
                                                                sx={{
                                                                minWidth: '86%',
                                                                fontSize: '13px',
                                                                }}
                                                                error={
                                                                    formik.touched.binusSupport &&
                                                                    formik.touched.binusSupport[index] &&
                                                                    Array.isArray(formik.errors.binusSupport) &&
                                                                    formik.errors.binusSupport[index] !== undefined &&
                                                                    Boolean(formik.errors.binusSupport[index])
                                                                }
                                                                helperText={
                                                                    formik.touched.binusSupport &&
                                                                    formik.touched.binusSupport[index] &&
                                                                    Array.isArray(formik.errors.binusSupport) &&
                                                                    formik.errors.binusSupport[index]
                                                                }
                                                            />

                                                            <Stack alignItems='center' width='12%'>
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    color="error"
                                                                    onClick={() => remove(index)}
                                                                    sx={{minWidth:'36px'}}
                                                                >
                                                                    <DeleteIcon
                                                                        sx={{
                                                                        border: '2px solid white',
                                                                        background:
                                                                            'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)',
                                                                        color: 'white',
                                                                        borderRadius: '15px',
                                                                        padding: '4px',
                                                                        width: 'auto',
                                                                        height: '31px',
                                                                        }}
                                                                    />
                                                                    </IconButton>
                                                                </Stack>
                                                            </Stack>
                                                    ))}
                                                </Stack>
                                            )}
                                            </FieldArray>
                                            <InputBinusSupport
                                                binusSupportRows={formik.values.binusSupport}
                                                setBinusSupportRows={support => formik.setFieldValue('binusSupport', support)}
                                                setErrorSupport={error => formik.setFieldError("binusSupport", error)}
                                                />
                                            {formik.errors.binusSupport && formik.touched.binusSupport && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>
                                                {formik.errors.binusSupport}
                                                </div>
                                            )}
                                            <Typography fontWeight="600" fontSize="12px">
                                                *Binus Support data will only be saved to the system after the &quot;Add&quot; button is clicked
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                </Box>
                                
                                <Stack spacing={2}>
                                    <Typography fontSize="12px">Binus Contribution</Typography>
                                    <EngagementTableForProminent alumniId={searchNIM}/>
                                </Stack>

                                <Stack spacing={2}>
                                    <Typography fontSize="12px">Endowment</Typography>
                                    <EndowmentTableForProminent alumniId={searchNIM}/>
                                </Stack>

                                <Dialog open={openAchievementEvidence} onClose={validateEvidence} maxWidth="md" fullWidth>
                                    <DialogTitle>Achievement Evidence</DialogTitle>
                                    <DialogContent>
                                        <Stack direction='row' mb={2}>
                                            <Stack spacing={1} width="45%">
                                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Name</Typography>
                                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                    {alumni.name}
                                                </Typography>
                                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Achievement Category</Typography>
                                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {formik.values.achievements?.[currentAchievementIndex]?.achievementCategory && getNameById(formik.values.achievements[currentAchievementIndex].achievementCategory)}
                                                </Typography>
                                            </Stack>
                                            <Stack spacing={1}  width="45%">
                                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>NIM</Typography>
                                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                    {alumni.alumniId}
                                                </Typography>
                                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Achievement</Typography>
                                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {formik.values.achievements?.[currentAchievementIndex]?.achievementName}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }} mb={1}> Achievement Evidence</Typography>
                                        {currentAchievementIndex !== null && (
                                            <FieldArray name={`achievements[${currentAchievementIndex}].achievementEvidence`}>
                                            {({ push, remove }) => (
                                                <Stack spacing={2} minWidth='800px'>
                                                {formik.values.achievements[currentAchievementIndex].achievementEvidence && formik.values.achievements[currentAchievementIndex].achievementEvidence.map((evidence, idx) => (
                                                    <Stack key={evidence.id} direction="row" alignItems="center" spacing={2}>
                                                        <Stack direction='row' border='1px solid #CCCCCC' minWidth='82%' borderRadius='7px' alignItems="center">
                                                            <Select
                                                                name={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidenceType`}
                                                                value={evidence.evidenceType}
                                                                onChange={formik.handleChange}
                                                                sx={{
                                                                    minWidth: '12%',
                                                                    input: {
                                                                        border: "none",
                                                                        color: '#808080',
                                                                        fontSize: '14px'
                                                                    },
                                                                }}
                                                            >
                                                                <MenuItem value="URL">URL</MenuItem>
                                                                <MenuItem value="file">File</MenuItem>
                                                            </Select>
                                                            {evidence.evidenceType === 'URL' ? (
                                                                <TextField
                                                                name={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                value={evidence.evidence}
                                                                onChange={(event) => {
                                                                    const {value} = event.target;
                                                                    formik.setFieldValue(`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`, value);
                                                            
                                                                    // Clear error when a value is entered
                                                                    if (value) {
                                                                        setErrorFile(prevErrorFile => {
                                                                            const newErrorFile = [...prevErrorFile];
                                                                            newErrorFile[currentAchievementIndex][idx] = "";
                                                                            return newErrorFile;
                                                                        });
                                                                    }
                                                                }}
                                                                placeholder="Input your URL"
                                                                variant='outlined'
                                                                sx={{ 
                                                                    minWidth: '67%',
                                                                    input: {
                                                                        border: "none",
                                                                        color: '#808080',
                                                                        fontSize: '14px'
                                                                    },
                                                                    }}
                                                                />
                                                                ) : (
                                                                <Stack width='67%' alignItems='center' direction='row'>
                                                                    <label 
                                                                    htmlFor={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`} 
                                                                    style={{ 
                                                                    opacity: '1', color: '#808080', cursor: 'pointer', marginRight: '10px', paddingLeft:'3%'}} >
                                                                        {formik.values.achievements[currentAchievementIndex].achievementEvidence[idx].evidence!== null ? (
                                                                        <span 
                                                                        style={{ fontSize: '14px', color: '#808080' }}>
                                                                            Change File
                                                                        </span>
                                                                    ) : (
                                                                        <span 
                                                                        style={{ fontSize: '14px', color: '#808080' }}>
                                                                            Input Your File
                                                                        </span>
                                                                    )}
                                                                    </label>
                                                                    <input
                                                                    type="file"
                                                                    id={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                    name={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                                    onChange={
                                                                        (event) => {
                                                                            const file = event.target.files ? event.target.files[0] : null;

                                                                            if (file) {
                                                                                if (file.size > 2_097_152) {
                                                                                    formik.setFieldValue(`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`, null);
    
                                                                                    setErrorFile(prevErrorFile => {
                                                                                        const newErrorFile = [...prevErrorFile];
                                                                                        if (!newErrorFile[currentAchievementIndex]) {
                                                                                            newErrorFile[currentAchievementIndex] = [];
                                                                                        }
                                                                                        newErrorFile[currentAchievementIndex][idx] = `File size exceeds 2 MB`;
                                                                                        return newErrorFile;
                                                                                        }
                                                                                    );
    
                                                                                } else {
                                                                                    formik.setFieldValue(`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`, file);
                                                                                    
                                                                                    setErrorFile(prevErrorFile => {
                                                                                        const newErrorFile = [...prevErrorFile];
                                                                                        if (!newErrorFile[currentAchievementIndex]) {
                                                                                            newErrorFile[currentAchievementIndex] = [];
                                                                                        }
                                                                                        if (newErrorFile[currentAchievementIndex][idx] === null) {
                                                                                            newErrorFile[currentAchievementIndex][idx] = "";
                                                                                        } else {
                                                                                            newErrorFile[currentAchievementIndex][idx] = "";
                                                                                        }
                                                                                        return newErrorFile;
                                                                                    }); 
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    style={{ minWidth: '70%' , display:'none'}}
                                                                    />
                                                                    {formik.values.achievements[currentAchievementIndex].achievementEvidence[idx] !== null ? addName(formik.values.achievements[currentAchievementIndex].achievementEvidence[idx]) : null}
                                                                </Stack>
                                                            )}
                                                            {errorFile[currentAchievementIndex][idx] ? (
                                                                <span 
                                                                style={{ fontSize: '12px', color: 'red'}}>
                                                                    {errorFile[currentAchievementIndex][idx]}
                                                                </span>
                                                            )
                                                            : null}
                                                        </Stack>
                                                        {idx === formik.values.achievements[currentAchievementIndex].achievementEvidence.length - 1 ? (
                                                            <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={
                                                                <AddIcon
                                                                sx={{
                                                                    border: '2px solid white',
                                                                    borderRadius: '10px',
                                                                }}
                                                                />
                                                            }
                                                            onClick={() =>handleAddEvidence(push)}
                                                            sx={{
                                                                mt: 2,
                                                                backgroundColor: '#FF9800',
                                                                minWidth: '15%',
                                                                fontSize: '13px',
                                                                textAlign: 'center',
                                                            }}
                                                            >
                                                            Add
                                                            </Button>
                                                        ) : (
                                                            <Stack alignItems='center' width='12%'>
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    color="error"
                                                                    onClick={() => remove(idx)}
                                                                    sx={{minWidth:'36px'}}
                                                                >
                                                                    <DeleteIcon
                                                                        sx={{
                                                                        border: '2px solid white',
                                                                        background:
                                                                            'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)',
                                                                        color: 'white',
                                                                        borderRadius: '15px',
                                                                        padding: '4px',
                                                                        width: 'auto',
                                                                        height: '31px',
                                                                        }}
                                                                    />
                                                                    </IconButton>
                                                                </Stack>
                                                        )}
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            )}
                                            </FieldArray>
                                        )}
                                        <Typography fontWeight="600" fontSize="12px" mt={2}>
                                            *Achievement Evidence data will only be saved to the system after the &quot;Add&quot;button is clicked
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Stack direction='row' sx={{ justifyContent: 'end' }} gap='20px' marginRight='4%'>
                                            <Button sx={{ background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)', color: 'white' , minWidth:'100px'}} onClick={handleCancelEvidence}>Cancel</Button>
                                            <Button 
                                            sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color: 'white', minWidth:'100px' }}
                                            onClick={validateEvidence}>Save</Button>
                                        </Stack>
                                    </DialogActions>
                                </Dialog>

                                <Stack alignItems='center' direction='row' justifyContent='end' gap={2}>
                                    <Button variant="contained"
                                    sx={{ 
                                       background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)',
                                        color:'white',
                                        width:'100px',
                                        fontWeight: '600',
                                        fontSize:'13px'
                                    }}
                                    onClick={() => Navigate("/prominent/view")}
                                    >
                                    Cancel
                                    </Button>

                                    <CustomLoadingButton
                                        loading={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                                        variant="contained"
                                        color= "primary"
                                        sx={{  color:'white', width:'100px'}}
                                        size='medium'
                                        type="submit"
                                        disabled={formik.isSubmitting || (!formik.isValid && formik.submitCount > 0)}
                                    >
                                        <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loading ? 'Loading...' : 'Save'}</Typography>
                                    </CustomLoadingButton>
                                </Stack>
                            </Stack>
                        )
                        : null}
                    </Stack>
                </form>
            </FormikProvider>

        </PageWrapper>
    );
}