import { Add as AddIcon, DeleteRounded as DeleteIcon } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';
import { selectProfile } from '../../store/profile/selector';
import { EditAchievement } from './components/EditAchievement';
import EditBinusSupport from './components/EditBinusSupport';
import EndowmentTableForProminent from './components/EndowmentTableForProminent';
import EngagementTableForProminent from './components/EngagementTableForProminent';
import { IAchievement, IAchievementCategory, IAlumniData, IBinusSupport, IEvidence, IFormValues, IProminentData } from './Interface/IEditProminent';

const generateId = () => `_${Math.random().toString(36).slice(2, 9)}`;

const validationSchema = Yup.object().shape({
    binusSupport: Yup.array()
      .of(
        Yup.object().shape({
            binusSupportDetail: Yup.string().required("Detail is required")
        })

      )
      .min(1, "At least one Binus Support entry is required"),

    achievements: Yup.array()
      .of(
        Yup.object().shape({
          achievementCategory: Yup.string().required("Achievement category is required"),
          achievementName: Yup.string().required("Achievement name is required"),
          achievementEvidence: Yup.array()
            .min(1, "At least one evidence is required"),
        })
      )
      .min(1, "At least one achievement is required"),

    reason: Yup.string().required("Reason is required"),
  });

function convertToUTCWithoutChangingDate(date) {
    const dateSent = new Date(date);

    const utcDate = new Date(Date.UTC(
        dateSent.getFullYear(),
        dateSent.getMonth(),
        dateSent.getDate(),
        dateSent.getHours(),
        dateSent.getMinutes(),
        dateSent.getSeconds(),
        dateSent.getMilliseconds()
    ));

    return utcDate.toISOString();
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return true;
    } catch {
        return false;
    }
}

export default function EditProminent() {
    const [alumni, setAlumni] = useState<IAlumniData | null>(null);
    const [selectedProminent, setSelectedProminent] = useState<IProminentData>();
    const [openAchievementEvidence, setOpenAchievementEvidence] = useState(false);
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState<number>(0);
    const [achievementCategory, setAchievementCategory] = useState<IAchievementCategory[]>([])
    const [prevData, setPrevData] = useState<any[]>([]);
    const [errorEvidence , setErrorEvidence] = useState<string[]>([])
    const [errorFile, setErrorFile] = useState<string[][]>([])
    const [loading, setLoading] = useState(false);
    const userProfile = useSelector(selectProfile)
    const { showModal } = useModal();
    const parameter = useParams();
    const Navigate = useNavigate();

    const validateEvidence = () => {
        const {achievements} = formik.values;
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
                period: null,
                date: null,
                achievements: [{
                    achievementCategory: 0,
                    achievementName: '',
                    achievementEvidence: [{
                        id: generateId(),
                        evidenceType: 'URL',
                        evidence : null,
                        isOld: false,
                    }],
                    prevId: 0,
                }],
                binusSupport: [{
                    binusSupportDetail:'',
                    prevId: 0,
                }],
                userIn: userProfile.email,
                reason:''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                errorEvidence.forEach(item => {
                    if (item !== "") {
                        const error = new Error("Input Failed");
                        throw error;
                    }

                });
                const formData = new FormData();
                formData.append('alumniId', values.alumniId);
                if(values.date){
                    const dateSent = convertToUTCWithoutChangingDate(values.date)
                    formData.append('date', dateSent);
                }
                if(values.period){
                    const periodSent = convertToUTCWithoutChangingDate(values.period)
                    formData.append('period', periodSent);
                }

                if (values.achievements) {
                    const achievementPromises = values.achievements.map(async (achievement, index) => {
                        formData.append(`achievements[${index}].achievementCategory`, achievement.achievementCategory.toString());
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

                        formData.append(`achievements[${index}].prevId`, achievement.prevId.toString());
                    });

                    // Now process all achievements in parallel
                    await Promise.all(achievementPromises);
                }

                if (values.binusSupport) {
                    values.binusSupport.forEach((binusSupports, index) => {
                        formData.append(`binusSupport[${index}].binusSupportDetail`, binusSupports.binusSupportDetail);
                        formData.append(`binusSupport[${index}].prevId`, binusSupports.prevId.toString());
                    });
                }

                formData.append('userIn', values.userIn);
                if (selectedProminent) {
                    formData.append('prominentId', selectedProminent.prominentId.toString());
                    if (selectedProminent.parentId != null){
                        formData.append('parentId', selectedProminent.parentId.toString());
                    }
                }
                formData.append('reason',values.reason)

                const response = await apiClient.post(`${ApiService.prominent}/edit-prominent`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                });

                setLoading(false);

                showModal({
                    title: 'Success',
                    message: 'Edit Data Request is Submitted Successfully',
                    options: {
                        variant: 'success' ,
                        onOk: ()=> Navigate('/prominent/approval')
                    },
                });
            }
            catch (error : any)
            {
                const message = error.response.data.errorMessage;

                if (message.includes("Request is still in approval")) {
                    showModal({
                        title: 'Failed',
                        message: 'This data is waiting for approval and cannot be edited until approved',
                        options: {
                            variant: 'failed',
                            onOk: () => setLoading(false),
                        },
                    });
                } else {
                    showModal({
                        title: 'Failed',
                        message: 'Check again the inputted data',
                        options: {
                            variant: 'failed',
                            onOk: () => setLoading(false),
                        },
                    });
                }
            }
        },
    });

    const handleOpenEvidenceDialog = (index: number) => {
        setCurrentAchievementIndex(index);
        setPrevData(formik.values.achievements[index].achievementEvidence);
        setOpenAchievementEvidence(true);
    };

    const handleCancelEvidence = () => {
        validateEvidence();
        formik.setFieldValue(`achievements[${currentAchievementIndex}].achievementEvidence`, prevData)
        setOpenAchievementEvidence(false);
    }

    const handleRemoveRow = (remove, index) => {
        remove(index);
        setErrorEvidence(errorEvidence.filter((_, i) => i !== index));
        setErrorFile(errorFile.filter((_, i) => i !== index));
    };

    const getAchievementCategory = async () => {
        const response = await apiClient.get(`${ApiService.prominent}/prominent-achievement-category`)
        setAchievementCategory(response.data.listGetProminentAchievementCategoryResponseDTO)
    }

    const getProminentById = async () => {
        const response = await apiClient.get(`${ApiService.prominent}/prominent-data-by-id?prominentId=${parameter.prominentId}`)
        setSelectedProminent(response.data);
        const { alumniId, proposalStatusId } = response.data;
        const alumniData = await apiClient.get(`${ApiService.prominent}/alumni-data-for-prominent?alumniId=${alumniId}`)
        setAlumni(alumniData.data);

        if (proposalStatusId !== 4){
            showModal({
                title: 'Failed',
                message: 'This data is waiting for approval and cannot be edited until approved',
                options: {
                    variant: 'failed',
                    onOk: () => Navigate('/prominent/view'),
                },
            });
        }
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
            push({ id: generateId(), evidenceType: 'URL', evidence : null, isOld: false,})

            formik.setFieldError(`achievements[${currentAchievementIndex}].achievementEvidence`,"")
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
    }

    useEffect(()=> {
        formik.setFieldValue('alumniId', selectedProminent?.alumniId)
        formik.setFieldValue('period', selectedProminent?.period)
        formik.setFieldValue('date', selectedProminent?.date)
        formik.setFieldValue('achievements',
            selectedProminent?.achievements.map((achievement) => ({
                ...achievement,
                achievementEvidence: [
                    ...achievement.achievementEvidence.map((evidence) => ({
                        ...evidence,
                        id: generateId(),
                    })),
                    { id: generateId(), evidenceType: 'URL', evidence: null, isOld: false },
                ],
            }))
        );
        formik.setFieldValue('binusSupport', selectedProminent?.binusSupport)
        if (selectedProminent){
            for(let i  = 0; i < selectedProminent?.achievements.length;i+=1){
                setErrorEvidence(prevState => [...prevState,""]);
                for (let j = 0 ; j < selectedProminent?.achievements[i].achievementEvidence.length ; j+=1){
                    setErrorFile(prevErrorFile => {
                        const newErrorEvidence = [...prevErrorFile];

                        if (!newErrorEvidence[i]) {
                            newErrorEvidence[i] = [];
                        }

                        newErrorEvidence[i][j] = "";

                        return newErrorEvidence;
                    });
                }
            }
        }
    }, [selectedProminent])

    useEffect(() => {
        if(currentAchievementIndex){
            setPrevData(formik.values.achievements[currentAchievementIndex].achievementEvidence);
        }
    },[currentAchievementIndex])

    useEffect(() => {
        getAchievementCategory();
        getProminentById();
    }, [])


    return (
        <PageWrapper>
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                        {alumni ? (
                            <Stack spacing={3}>
                                <Stack direction='row'  gap='25%' paddingLeft='1%' paddingRight='1%'>
                                    <Stack spacing={2}>
                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Name</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {alumni.name}
                                            </Typography>
                                        </Stack>

                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Program</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {alumni.program}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack spacing={2}>
                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Campus</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {alumni.campus}
                                            </Typography>
                                        </Stack>

                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Degree</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {alumni.degree}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack spacing={2}>
                                        <Stack>
                                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Faculty</Typography>
                                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                                {alumni.faculty}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Divider sx={{marginY: "20px"}}/>

                                <Stack direction='row' gap={3}>
                                    <Stack width='49%' gap={2}>
                                        <Typography fontSize='12px'>Period</Typography>
                                        <Stack direction='row' bgcolor='white' padding={1} paddingLeft={2} spacing={3} alignItems='center' border= 'solid 1px #D9D9D9' borderRadius='10px' justifyContent='space-between'>
                                            {selectedProminent ? (
                                                <Typography fontSize='14px'>{format(selectedProminent.period,'dd-MM-yyyy')}</Typography>
                                            ) : null}
                                            <CalendarMonthIcon opacity={1}/>
                                        </Stack>
                                    </Stack>

                                    <Stack width='49%' gap={2}>
                                        <Typography fontSize='12px'>Date</Typography>
                                        <Stack direction='row' bgcolor='white' padding={1} paddingLeft={2} spacing={3} alignItems='center' border= 'solid 1px #D9D9D9' borderRadius='10px' justifyContent='space-between'>
                                            {selectedProminent ? (
                                                <Typography fontSize='14px'>{format(selectedProminent.date,'dd-MM-yyyy')}</Typography>
                                            ) : null}
                                            <CalendarMonthIcon opacity={1}/>
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
                                        sx={{ backgroundColor:'white', padding: '20px', border: 'solid 1px #D9D9D9', borderRadius:'10px', minWidth:'1100px' , overflowX:'auto'}}
                                        >
                                            <Stack spacing={2} direction="row">
                                                <Typography
                                                sx={{
                                                    fontWeight:600,
                                                    minWidth:'28%' ,
                                                    fontSize:'12px'
                                                }}
                                                >
                                                Achievement Category
                                                </Typography>
                                                <Typography
                                                sx={{
                                                    fontWeight:600,
                                                    minWidth:'36%' ,
                                                    fontSize:'12px'
                                                }}
                                                >
                                                Achievement
                                                </Typography>
                                                <Typography
                                                sx={{
                                                    fontWeight:600,
                                                    minWidth:'20%' ,
                                                    fontSize:'12px'
                                                }}
                                                >
                                                Achievement Evidence
                                                </Typography>
                                                <Typography
                                                sx={{
                                                    fontWeight:600,
                                                    textAlign:'center ',
                                                    minWidth:'12%',
                                                    fontSize:'12px'
                                                }}
                                                >
                                                Action
                                                </Typography>
                                            </Stack>
                                            <FieldArray name="achievements">
                                                {({ remove }) => (
                                                <Box>
                                                    {formik.values.achievements && formik.values.achievements.map((achievement, index) => (
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        alignItems="start"
                                                    >
                                                        <TextField
                                                        select
                                                        variant="outlined"
                                                        name={`achievements[${index}].achievementCategory`}
                                                        value={achievement.achievementCategory}
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
                                                        sx={{
                                                            minWidth:'28%' ,
                                                            fontSize: '13px'
                                                        }}
                                                        >
                                                            <MenuItem value="">Select Category</MenuItem>
                                                            {achievementCategory?.map((achievementCategoryList)=> (
                                                                    <MenuItem
                                                                    key={achievementCategoryList.achievementCategoryId}
                                                                    value={achievementCategoryList.achievementCategoryId}>
                                                                        {achievementCategoryList.achievementCategoryName
                                                                    }</MenuItem>
                                                            ))}
                                                        </TextField>

                                                        <TextField
                                                        variant="outlined"
                                                        name={`achievements[${index}].achievementName`}
                                                        value={achievement.achievementName}
                                                        onChange={formik.handleChange}
                                                        error={
                                                            formik.touched.achievements &&
                                                            formik.touched.achievements[index] &&
                                                            Array.isArray(formik.errors.achievements) &&
                                                            formik.errors.achievements[index] !== undefined &&
                                                            typeof formik.errors.achievements[index] === 'object' &&
                                                            Boolean(
                                                                formik.errors.achievements[index] &&
                                                                (formik.errors.achievements[index] as FormikErrors<IAchievement>).achievementName
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched.achievements &&
                                                            formik.touched.achievements[index] &&
                                                            Array.isArray(formik.errors.achievements) &&
                                                            formik.errors.achievements[index] !== undefined &&
                                                            typeof formik.errors.achievements[index] === 'object' &&
                                                            formik.errors.achievements[index] &&
                                                            (formik.errors.achievements[index] as FormikErrors<IAchievement>).achievementName
                                                        }
                                                        sx={{
                                                            minWidth:'36%' ,
                                                            fontSize: '13px'
                                                        }}
                                                        />

                                                        <Stack minWidth='20%'>
                                                            <Button
                                                            variant="contained"
                                                            startIcon={<AddIcon
                                                                        sx={{
                                                                            border: '2px solid white',
                                                                            borderRadius:'10px' ,
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

                                                        <IconButton
                                                            aria-label="delete"
                                                            color="error"
                                                            onClick={() => handleRemoveRow(remove, index)}
                                                            sx={{minWidth:'12%'}}
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
                                                        {/* )} */}
                                                    </Stack>
                                                    ))}
                                                </Box>
                                                )}
                                            </FieldArray>
                                            <EditAchievement
                                            achievementRows={formik.values.achievements}
                                            setAchievementRows={achievement => formik.setFieldValue('achievements', achievement)}
                                            name={alumni.name}
                                            nim = {alumni.alumniId}
                                            achievementCategory = {achievementCategory}
                                            setErrorEvidenceParent = {error => setErrorEvidence(error)}
                                            setErrorFileParent = {error => setErrorFile(error)}
                                            />
                                            {formik.errors.achievements && formik.touched.achievements && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>
                                                {typeof formik.errors.achievements[0] !== "string" && formik.errors.achievements[0].achievementCategory === "At least one achievement is required" && formik.errors.achievements[0].achievementCategory}
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
                                            minWidth: '1100px',
                                            overflowX: 'auto',
                                            }}
                                        >
                                            <Stack spacing={2} direction="row" alignItems="center">
                                            <Typography
                                                sx={{
                                                fontWeight: 600,
                                                minWidth: '87%',
                                                fontSize:'12px',
                                                }}
                                            >
                                                Support Detail
                                            </Typography>
                                            <Typography
                                                sx={{
                                                fontWeight: 600,
                                                minWidth: '12%',
                                                fontSize:'12px',
                                                textAlign: 'center',
                                                }}
                                            >
                                                Action
                                            </Typography>
                                            </Stack>

                                            <FieldArray name="binusSupport">
                                            {({ remove }) => (
                                                <Box>
                                                {formik.values.binusSupport?.map((support, index) => (
                                                    <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="start"
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            name={`binusSupport[${index}].binusSupportDetail`}
                                                            value={support.binusSupportDetail}
                                                            onChange={formik.handleChange}
                                                            sx={{
                                                            minWidth: '88%',
                                                            fontSize: '13px',
                                                            }}
                                                            error={
                                                                formik.touched.binusSupport &&
                                                                formik.touched.binusSupport[index] &&
                                                                Array.isArray(formik.errors.binusSupport) &&
                                                                formik.errors.binusSupport[index] !== undefined &&
                                                                typeof formik.errors.binusSupport[index] === 'object' &&
                                                                Boolean(
                                                                    formik.errors.binusSupport[index] &&
                                                                    (formik.errors.binusSupport[index] as FormikErrors<IBinusSupport>).binusSupportDetail
                                                                )
                                                            }
                                                            helperText={
                                                                formik.touched.binusSupport &&
                                                                formik.touched.binusSupport[index] &&
                                                                Array.isArray(formik.errors.binusSupport) &&
                                                                formik.errors.binusSupport[index] &&
                                                                typeof formik.errors.binusSupport[index] === 'object' &&
                                                                formik.errors.binusSupport[index] &&
                                                                (formik.errors.binusSupport[index] as FormikErrors<IBinusSupport>).binusSupportDetail
                                                            }
                                                        />
                                                        <IconButton
                                                        aria-label="delete"
                                                        color="error"
                                                        onClick={() => remove(index)}
                                                        sx={{
                                                            minWidth: '12%',
                                                            textAlign: 'center',
                                                        }}
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
                                                ))}
                                                </Box>
                                            )}
                                            </FieldArray>
                                            <EditBinusSupport
                                                binusSupportRows={formik.values.binusSupport}
                                                setBinusSupportRows={support => formik.setFieldValue('binusSupport', support)}
                                            />

                                            <Typography fontWeight="600" fontSize="12px">
                                                *Binus Support data will only be saved to the system after the &quot;Add&quot; button is clicked
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Stack gap='10px'>
                                    <Typography fontSize='12px'>Reason</Typography>
                                    <TextField
                                    multiline
                                    onChange={(e) => formik.setFieldValue('reason', e.target.value)}
                                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                                    helperText={formik.touched.reason && formik.errors.reason}/>
                                </Stack>

                                <Stack spacing={2}>
                                    <Typography fontSize='12px'>Binus Contribution</Typography>
                                    {selectedProminent ? (
                                        <EngagementTableForProminent alumniId={selectedProminent.alumniId}/>
                                    ) : null}
                                </Stack>

                                <Stack spacing={2}>
                                    <Typography fontSize='12px'>Endowment</Typography>
                                    {selectedProminent ? (
                                        <EndowmentTableForProminent alumniId={selectedProminent.alumniId}/>
                                    ) : null}
                                </Stack>


                                <Dialog open={openAchievementEvidence} onClose={validateEvidence} maxWidth="md" fullWidth>
                                    <DialogTitle>Achievement Evidence</DialogTitle>
                                    <DialogContent>
                                    {currentAchievementIndex !== null && (
                                        <FieldArray name={`achievements[${currentAchievementIndex}].achievementEvidence`}>
                                        {({ push, remove }) => (
                                            <Stack spacing={2} minWidth='800px'>
                                            {formik.values.achievements && formik.values.achievements[currentAchievementIndex].achievementEvidence && formik.values.achievements[currentAchievementIndex].achievementEvidence.map((evidence, idx) => (
                                                <Stack direction="row" alignItems="center" spacing={2} key={evidence.id}>
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
                                                            <Stack minWidth='67%'>
                                                            {evidence.isOld == true ?
                                                            (
                                                                <TextField
                                                                name={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                value={evidence.evidence}
                                                                variant='outlined'
                                                                onClick={
                                                                    ()=>{
                                                                        const url = typeof evidence.evidence === "string" ? evidence.evidence : "";
                                                                        const formattedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `http://${url}`;
                                                                        window.open(typeof evidence.evidence === "string" ? formattedUrl : "", "blank")
                                                                    }
                                                                }
                                                                sx={{
                                                                   minWidth: '67%',
                                                                    input: {
                                                                        border: "none",
                                                                        color: '#808080',
                                                                        fontSize: '14px'
                                                                    },
                                                                }}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                />
                                                            ) : (
                                                                <TextField
                                                                name={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                value={evidence.evidence}
                                                                onChange={formik.handleChange}
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
                                                            )}
                                                            </Stack>
                                                        ) : (
                                                            <Stack minWidth='67%'>
                                                                {evidence.isOld == true ?
                                                                (
                                                                    <TextField
                                                                    name={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                    value={evidence.evidence}
                                                                    contentEditable='false'
                                                                    variant='outlined'
                                                                    onClick={
                                                                        ()=>{window.open(`${ApiService.viewFileProminent}?Uri=${evidence.evidence}`, '_blank')
                                                                        }
                                                                    }
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
                                                                    <Stack width='67%%' display='flex' alignItems='center' direction='row'>
                                                                    <label
                                                                        htmlFor={`achievements[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                                        style={{
                                                                        opacity: '1', color: '#808080', cursor: 'pointer', marginRight: '10px', paddingLeft:'3%'}} >
                                                                            {
                                                                            formik.values.achievements[currentAchievementIndex].achievementEvidence[idx].evidence!== null
                                                                            ? (
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

                                                                                if (file){
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
                                                                            {errorFile[currentAchievementIndex][idx] ? (
                                                                                <span
                                                                                style={{ fontSize: '12px', color: 'red' }}>
                                                                                    {errorFile[currentAchievementIndex][idx]}
                                                                                </span>
                                                                            )
                                                                            : null}
                                                                </Stack>
                                                            )}
                                                            </Stack>
                                                        )}
                                                        {errorFile[currentAchievementIndex][idx] ? (
                                                            <span
                                                            style={{ fontSize: '12px', color: 'red' }}>
                                                                {errorFile[currentAchievementIndex][idx]}
                                                            </span>
                                                        )
                                                        : null}
                                                    </Stack>
                                                    {formik.values.achievements && idx === formik.values.achievements[currentAchievementIndex].achievementEvidence.length - 1 ? (
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
                                                        onClick={() => handleAddEvidence(push)}
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
                                                        <IconButton
                                                            aria-label="delete"
                                                            color="error"
                                                            onClick={() => remove(idx)}
                                                            sx={{
                                                                minWidth: '12%',
                                                                textAlign: 'center',
                                                            }}
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
                                            <Button
                                            sx={{ background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)', color: 'white' , minWidth:'100px'}}
                                            onClick={handleCancelEvidence}>Cancel</Button>
                                            <Button
                                            sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color: 'white', minWidth:'100px' }}
                                            onClick={validateEvidence}>Save</Button>
                                        </Stack>
                                    </DialogActions>
                                </Dialog>

                                <Stack marginTop={3}>
                                    <Typography fontSize='12px'>
                                        Last Activity
                                    </Typography>
                                    {selectedProminent?.listActivity.map((activity) => (
                                        <Typography sx={{ fontWeight:600, fontSize:'12px' }}>{activity}</Typography>
                                    ))}
                                </Stack>

                                <Stack alignItems='center' direction='row' justifyContent='end' gap={2}>
                                    <Button
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
                                        sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', width:'100px'}}
                                        size='medium'
                                        type="submit"
                                        disabled={formik.isSubmitting || (!formik.isValid && formik.submitCount > 0) || selectedProminent?.proposalStatusId !== 4}
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