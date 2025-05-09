import { 
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Select,
    Stack, 
    TextField, 
    Typography } from "@mui/material";
import { addYears, format, formatDate, parse } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import Datepicker from "../../components/common/Datepicker";
import PageWrapper from "../../components/container/PageWrapper";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import useModal from "../../hooks/use-modal";
import { selectProfile } from "../../store/profile/selector";
import { IAlumniData,IFormValues } from "./interface/EditInterface";

const validationSchema = Yup.object().shape({
    startYear: Yup.string()
        .required("Start Date is required"),
    endYear: Yup.string()
        .required("End Date is required"),
    status: Yup.string().required('Status is required'),
    reason: Yup.string()
        .required("Reason is required")
        .nullable(),
    reasonNotActive: Yup.string()
        .nullable()
        .test('reason-not-active', 'Reason Not Active is required', function (value) {
            if (this.parent.status === 'Not Active' && !value) {
            return false;
            }
            return true;
        }),
});

function formatDateToDDMMYYYY(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

function convertToUTCWithoutChangingDate(date) {
    const [day, month, year] = date.split("-").map(Number);
    
    const dateSent = new Date(year, month - 1, day);

  const localOffset = dateSent.getTimezoneOffset() * 60_000;

  const utcDate = new Date(dateSent.getTime() - localOffset);

  return utcDate.toISOString();
}

export function EditAlumniAssociation () {
    const [originalData,setOriginalData] = useState<IAlumniData>();
    const [imageUrl, setImageUrl] = useState("")
    const [confirmationLetterUrl, setConfirmationLetterUrl] = useState("")
    const [faculty, setFaculty] = useState("")
    const [program, setProgram] = useState("")
    const [campus, setCampus] = useState("")
    const [loading, setLoading] = useState(false);
    const userProfile = useSelector(selectProfile)
    const navigate = useNavigate();
    const { showModal } = useModal();

    const param = useParams();
    const mappingLeaderId = parseInt(param.mappingLeaderId ?? '', 10)

    const formik = useFormik<IFormValues>({
        initialValues: {
            mappingLeaderId,
            startYear: null,
            endYear: null,
            status: '',
            reason: '',
            reasonNotActive : '',
            userIn : userProfile.binusianId,
        },

        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)
                if(convertToUTCWithoutChangingDate(values.startYear) === `${originalData?.yearStart}.000Z` && 
                convertToUTCWithoutChangingDate(values.endYear) === `${originalData?.yearEnd}.000Z` &&
                values.status === originalData?.leaderStatus){
                    throw new Error("Edit Failed");
                }

                let parameter;

                if (values.startYear && values.endYear){
                    parameter = {
                        mappingLeaderId : values.mappingLeaderId,
                        startYear: convertToUTCWithoutChangingDate(values.startYear),
                        endYear: convertToUTCWithoutChangingDate(values.endYear),
                        status: values.status,
                        reason: values.reason,
                        reasonNotActive : values.reasonNotActive,
                        userIn : values.userIn,
                    }
                }

                await apiClient.patch(`${ApiService.alumniAssociation}/edit-alumni-association`, parameter)
                setLoading(false)
                showModal({
                    title: 'Success',
                    message: 'Edit Data Request is Submitted Successfully',
                    options: { 
                        variant: 'success',
                        onOk: () => navigate('/alumni/association/approval')
                     },
                  });

            } catch {
                showModal({
                    title: 'Failed',
                    message: 'Edit is Failed or There is No Change of Data',
                    options: { 
                        variant: 'failed',
                        onOk: () => setLoading(false)
                     },
                  });
            }
        },
    })

    const handleCancel = () => {
        navigate("/alumni/association/report")
    }

    useEffect(() => {
        const getFileUrl = async () => {
            const response = await apiClient.get(`${ApiService.alumniAssociation}/get-file-url?mappingLeaderId=${formik.values.mappingLeaderId}`)
            setImageUrl(response.data.imageUrl)
            setConfirmationLetterUrl(response.data.confirmationLetterUrl)
        }
        const getMappingCampus = async () => {
            const response = await apiClient.get(`${ApiService.alumniAssociation}/mapping-campus?mappingLeaderId=${formik.values.mappingLeaderId}`)
            setFaculty(response.data.facultyName)
            setProgram(response.data.programName)
            setCampus(response.data.campusName)
        }
        const getMappingLeaderData = async () => {
            const response = await apiClient.get(`${ApiService.alumniAssociation}/mapping-leader-data?mappingLeaderId=${mappingLeaderId}`)

            setOriginalData(response.data)

            if (response.data.proposalStatusId !== 4){
                showModal({
                    title: 'Failed',
                    message: 'This data is waiting for approval and cannot be edited until approved',
                    options: { 
                        variant: 'failed',
                        onOk: () => navigate('/alumni/association/report')
                     },
                });
            } else if (response.data.leaderStatus === "Not Active"){
                showModal({
                    title: 'Data can not be Updated',
                    message: 'Alumni program leader already not active',
                    options: { 
                        variant: 'failed',
                        onOk: () => navigate('/alumni/association/report')
                     },
                });
            }
        }
        getMappingLeaderData();
        getFileUrl();
        getMappingCampus();
    },[])

    useEffect(() => {
        formik.setFieldValue('mappingLeaderId',originalData?.mappingLeaderId)
        formik.setFieldValue('startYear', formatDateToDDMMYYYY(originalData?.yearStart));
        formik.setFieldValue('endYear',formatDateToDDMMYYYY(originalData?.yearEnd));
        formik.setFieldValue('status',originalData?.leaderStatus)
        formik.setFieldValue('reasonNotActive',originalData?.reasonNotActive)
    },[originalData])

    return(
        <PageWrapper>
            {originalData ? (
                <form onSubmit={formik.handleSubmit}>
                    <Stack>
                        <Stack direction='row' margin='5px 15px' gap='23%'>
                            <Stack gap='20px'>
                                
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>NIM</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.nim}</Typography>
                                </Stack>
                                    
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Faculty</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.faculty}</Typography>
                                </Stack>

                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Place of Birth</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.birthPlace}</Typography>
                                </Stack>

                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Email</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.email}</Typography>
                                </Stack>

                            </Stack>

                            <Stack gap='20px'>
                                
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Name</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.name}</Typography>
                                </Stack>
                                    
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Program</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.program}</Typography>
                                </Stack>

                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Date of Birth</Typography>
                                    {originalData ? (
                                        <Typography sx={{ fontWeight:600, fontSize:'14px' }}>
                                            {formatDate(originalData.dob, "dd MMMM yyyy")}
                                        </Typography>
                                    ) : null}
                                </Stack>

                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Entry Year</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.entryYear ? format(originalData.entryYear,"yyyy") : "-"}</Typography>
                                </Stack>

                            </Stack>

                            <Stack gap='20px'>
                                
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Campus</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.campus}</Typography>
                                </Stack>
                                    
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Degree</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.degree}</Typography>
                                </Stack>

                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Phone Number</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.phoneNumber}</Typography>
                                </Stack>

                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize: '12px' }}>Graduation Year</Typography>
                                    <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{originalData.graduationYear ? format(originalData.graduationYear,"yyyy") : "-"}</Typography>
                                </Stack>

                            </Stack>
                        </Stack>

                        <Divider sx={{marginY: "20px"}}/>

                        <Stack gap='20px'> 
                            <Stack direction='row' width='100%' justifyContent='space-between'>
                                <Stack width='49%' gap='15px'>

                                    <Stack gap='10px'>
                                        <Typography sx={{ fontSize:'12px' }}>Faculty</Typography>
                                        <Stack 
                                        sx={{ backgroundColor:'#D6D6D6', padding:'7px 20px', fontSize:'14px', color:'#808080', borderRadius:'10px', border: 'solid 1px #CCCCCC' }}>
                                            {faculty}
                                        </Stack>
                                    </Stack>

                                    <Typography fontSize='12px'>Duty Period (Start Date)</Typography>
                                    
                                    <Stack>
                                    <Datepicker
                                            value={formik.values.startYear ?? null}
                                            onChange={(date) =>  {
                                                formik.setFieldValue('startYear', date);
                                                
                                                if(date && typeof date === "string"){
                                                    const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
                                                    const endYearDate = addYears(parsedDate, 3);
                                                    const endYear = format(endYearDate, 'dd-MM-yyyy');
                                                    formik.setFieldValue('endYear', endYear);
                                                    formik.setFieldError('startYear', '');
                                                    formik.setFieldError('endYear', '');
                                                } else {
                                                    formik.setFieldError('startYear','Start year is required')
                                                }

                                            }}
                                            id="startYear"
                                            dateFormat="dd-MM-yyyy"
                                            autoClose
                                            clearIcon
                                        />
                                        {formik.touched.startYear && formik.errors.startYear && (
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
                                                    {typeof formik.errors.startYear === 'string' ? formik.errors.startYear : ''}
                                                </Typography>
                                        )}
                                    </Stack>

                                    <Stack gap='15px'>
                                        <Typography fontSize='12px'>Alumni Photo</Typography>
                                        <Stack direction='row' alignItems='center'>
                                            <Button 
                                            style={{ background: 'linear-gradient(183deg, rgba(2,142,213,1) 0%, rgba(2,108,162,1) 100%)', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', fontSize:'13px'}}
                                            onClick={() => window.open(`${ApiService.viewUploadedFile}?Uri=${imageUrl}`, '_blank')}>VIEW FILE</Button>
                                        </Stack>
                                    </Stack>
                                    
                                    
                                </Stack>

                                <Stack width='50%' gap='15px'>

                                    <Stack gap='10px'>
                                        <Typography sx={{ fontSize:'12px' }}>Program</Typography>
                                        <Stack 
                                        sx={{ backgroundColor:'#D6D6D6', padding:'7px 20px', fontSize:'14px', color:'#808080', borderRadius:'10px', border: 'solid 1px #CCCCCC' ,overflowX:'auto', minWidth:'1000px' }}>
                                            {program} - {campus}
                                        </Stack>
                                    </Stack>

                                    <Typography fontSize='12px'>Duty Period (End Date)</Typography>
                                    <Stack>
                                    <Datepicker
                                            value={formik.values.endYear ?? null}
                                            onChange={date => {
                                                formik.setFieldValue('endYear', date);

                                                if (!date){
                                                    formik.setFieldError('endYear','End year is required')
                                                } else {
                                                    formik.setFieldError('endYear','')
                                                }
                                            }}
                                            id="endYear"
                                            dateFormat="dd-MM-yyyy"
                                            autoClose
                                            clearIcon
                                        />

                                        {formik.touched.endYear && formik.errors.endYear && (
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
                                                    {typeof formik.errors.endYear === 'string' ? formik.errors.endYear : ''}
                                                </Typography>
                                        )}
                                    </Stack>
                                    <Stack gap='15px'>
                                        <Typography fontSize='12px'>Confirmation Letter</Typography>
                                        <Stack direction='row' alignItems='center'>
                                            <Button 
                                            style={{ background: 'linear-gradient(183deg, rgba(2,142,213,1) 0%, rgba(2,108,162,1) 100%)', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', fontSize:'13px'}}
                                            onClick={() => window.open(`${ApiService.viewUploadedFile}?Uri=${confirmationLetterUrl}`, '_blank')}>VIEW FILE</Button>
                                        </Stack>
                                    </Stack>
                                    

                                </Stack>
                            </Stack>

                            <Stack gap='15px'>
                                <Stack gap='7px'>
                                    <Typography sx={{ fontSize:'12px' }}>Status</Typography>
                                    <Select 
                                    value={formik.values.status ?? ''}
                                    onChange={(e) => formik.setFieldValue('status', e.target.value)}>
                                        <MenuItem value='Active' sx={{ fontSize:'14px' }}>Active</MenuItem>
                                        <MenuItem value='Not Active' sx={{ fontSize:'14px' }}>Not Active</MenuItem>
                                    </Select>
                                </Stack>
                                {formik.values.status === 'Not Active' ? (
                                    <Stack gap='10px'>
                                        <Typography fontSize='12px'>Reason (Not Active)</Typography>
                                        <TextField 
                                        sx={{ fontSize:'14px' }}
                                        value={formik.values.reasonNotActive}
                                        onChange={(e) => formik.setFieldValue('reasonNotActive', e.target.value)}
                                        error={formik.touched.reasonNotActive && Boolean(formik.errors.reasonNotActive)}
                                        helperText={formik.touched.reasonNotActive && formik.errors.reasonNotActive}/>
                                    </Stack>
                                ) : null}
                                <Stack gap='10px'>
                                    <Typography fontSize='12px'>Reason</Typography>
                                    <TextField 
                                    sx={{ fontSize:'14px' }}
                                    onChange={(e) => formik.setFieldValue('reason', e.target.value)}
                                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                                    helperText={formik.touched.reason && formik.errors.reason}/>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack marginTop={3}>
                            <Typography fontSize='12px'>Last Activity</Typography>
                            
                            {Array.isArray(originalData?.activity) && originalData.activity.length > 0 ? (
                                originalData.activity.map((activity, index) => (
                                <Typography
                                    sx={{ fontWeight: 600, fontSize: '12px' }}
                                >
                                    {activity}
                                </Typography>
                                ))
                            ) : (
                                <Typography>No activities available</Typography>
                            )}
                        </Stack>

                            
                        <Stack direction='row' sx={{ justifyContent:'end' }} gap='25px' marginTop='20px'>
                            <Button sx={{ background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)', color:'white', width:'100px' , fontSize:'13px'}} onClick={handleCancel}>Cancel</Button>
                            <CustomLoadingButton
                                loading={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                                variant="contained"
                                sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', width:'100px', fontSize:'13px'}}
                                size='medium'
                                type="submit"
                                disabled={formik.isSubmitting || !formik.isValid || originalData.proposalStatusId!== 4}
                            >
                                <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loading ? 'Loading...' : 'Save'}</Typography>
                            </CustomLoadingButton>
                            </Stack>
                    </Stack>
                </form>
            ) : (
                <Typography>No row data available</Typography>
            )}
            

        </PageWrapper>
    )
}