import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Stack,
    TextField,
    Typography } from "@mui/material";
import { addYears, format, parse } from "date-fns";
import { useFormik } from "formik";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import Datepicker from "../../components/common/Datepicker";
import PageWrapper from "../../components/container/PageWrapper";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import useModal from "../../hooks/use-modal";
import { selectProfile } from "../../store/profile/selector";
import ModalAlertInput from "./components/ModalInputError";
import { IAlumniData,IFormValues, IProgram } from "./interface/InputInterface";

const validationSchema = Yup.object().shape({
    startYear: Yup.string()
        .required("Start Date is required"),

    endYear: Yup.string()
        .required("End Date is required"),

    image: Yup.mixed()
        .required("Image is required")
        .test('fileSize', 'Maximum file size is 2MB', value =>
            value && (value as File).size <= 2 * 1024 * 1024
        )
          .test('fileFormat', 'Only PNG, JPG, JPEG are allowed', value =>
            value && ['image/png', 'image/jpg', 'image/jpeg'].includes((value as File).type)
        ),

    confirmationLetter: Yup.mixed()
        .required("Confirmation letter is required")
        .test('fileSize', 'Maximum file size is 2MB', value =>
        value && (value as File).size <= 2 * 1024 * 1024
        )
        .test('fileFormat', 'Only PDF files are allowed', value =>
        value && (value as File).type === 'application/pdf'
        ),

    selectedPrograms: Yup.array().min(1, "At least one program must be selected"),
});

function convertToUTCWithoutChangingDate(date) {
    const [day, month, year] = date.split("-").map(Number);

  const dateSent = new Date(year, month - 1, day);

  const localOffset = dateSent.getTimezoneOffset() * 60_000;

  const utcDate = new Date(dateSent.getTime() - localOffset);

  return utcDate.toISOString();
}

export function InputAlumniAssociation () {
    const [search, setSearch] = useState("");
    const [alumniData,setAlumniData] = useState<IAlumniData | null>(null);
    const [leaderAlumni, setLeaderAlumni] = useState(false);
    const [programs, setPrograms] = useState<IProgram[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [errorImage, setErrorImage] = useState('');
    const [errorDocument, setErrorDocument] = useState('');
    const [listError, setListError] = useState(false);
    const [listCheckPeriod, setListCheckPeriod] = useState<string []>([]);
    const [listStillActive, setListStillActive] = useState<string []>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const userProfile = useSelector(selectProfile);

    const { showModal } = useModal();
    const navigate = useNavigate();

    const formik = useFormik<IFormValues>({
        initialErrors:{},
        initialValues: {
            alumniId: '',
            startYear: null,
            endYear: null,
            image: null,
            confirmationLetter: null,
            selectedPrograms: [],
            userIn: userProfile.binusianId,
        },
        validationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            try{
                setLoading(true)
                const checkedStatus = await apiClient.get(`${ApiService.alumniAssociation}/check-mapping-leader-status?selectedProgram=${JSON.stringify(values.selectedPrograms)}&startYear=${convertToUTCWithoutChangingDate(values.startYear)}&endYear=${convertToUTCWithoutChangingDate(values.endYear)}`)
                
                setListCheckPeriod(checkedStatus.data.listCheckPeriod || []);
                setListStillActive(checkedStatus.data.listStillActive || []);


                if (checkedStatus.data.listCheckPeriod.length > 0 || checkedStatus.data.listStillActive.length > 0){
                    throw new Error ("Input Error")
                }

                const formData = new FormData();
                formData.append('alumniId', values.alumniId);
                if(values.startYear){
                    const startYear = convertToUTCWithoutChangingDate(values.startYear)
                    formData.append('startYear', startYear);
                }
                if(values.endYear){
                    const endYear = convertToUTCWithoutChangingDate(values.endYear)
                    formData.append('endYear', endYear);
                }
                if (values.image) {
                    formData.append('image', values.image);
                }
                if (values.confirmationLetter) {
                    formData.append('confirmationLetter', values.confirmationLetter);
                }

                formData.append('selectedPrograms', JSON.stringify(values.selectedPrograms));
                formData.append('userIn', values.userIn)


                await apiClient.post(ApiService.alumniAssociation, formData
                    ,{
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                        responseType: "blob"
                    }
                )
                setLoading(false)

                showModal({
                    title: 'Success',
                    message: 'Add Data Request is Submitted Successfully',
                    options: {
                        variant: 'success' ,
                        onOk: () => navigate('/alumni/association/approval')
                    },
                  });
            }catch {
                if (listCheckPeriod.length > 0 || listStillActive.length > 0){
                    setLoading(false);
                    setListError(true);
                } else {
                    showModal({
                        title: 'Failed',
                        message: 'Check again the inputted data',
                        options: {
                            variant: 'failed',
                            onOk: () => setLoading(false)
                            },
                    });
                }
            }
        },
    })

    const handleSearch = (e:ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const searchData = async () => {
        setLeaderAlumni(false);
        setAlumniData(null);
        formik.resetForm();
        try{
            setLoadingSearch(true)
            const searchedData = await apiClient.get(`${ApiService.alumniAssociation}/alumni-data?nim=${search}`);
            if (searchedData.data){
                if (searchedData.data.mappingId != null) {
                    setAlumniData(searchedData.data);
                    formik.setFieldValue('alumniId', searchedData.data.id)
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
            setLoadingSearch(false)
        } catch {
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

    const changeStatus = () => {
        setLeaderAlumni(true)
    }

    const programRows: IProgram[][] = [];
    for (let i = 0; i < programs?.length; i += 3) {
        programRows.push(programs.slice(i, i + 3));
    }

    const handleCancel = () => {
        setLeaderAlumni(false);
        setAlumniData(null);
        formik.resetForm();
    }

    const isFormComplete = () => {
        const { selectedPrograms, startYear, endYear, image, confirmationLetter } = formik.errors;
        
        return (
          !selectedPrograms &&
          !startYear &&
          !endYear &&
          !image &&
          !confirmationLetter
        );
      };

    useEffect(() => {
        const fetchPrograms = async () => {
            const response = await apiClient.get(`${ApiService.alumniAssociation}/get-program-from-faculty?name=${alumniData?.faculty}`);
            setPrograms(response.data.listGetProgramFromFaculty);
        };
        fetchPrograms();
        formik.setFieldValue('selectedPrograms', [alumniData?.mappingId])
    }, [leaderAlumni]);


    const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          formik.setFieldValue('image', null);
          setErrorImage('Maximum file size is 2MB');
          return;
        }

        formik.setFieldValue('image', file);

        const reader = new FileReader();
        const img = new Image();

        const handleImageLoad = () => {
          setImageDimensions({ width: img.width, height: img.height });
          img.removeEventListener('load', handleImageLoad);
        };

        const handleReaderLoad = () => {
          img.src = reader.result as string;
          reader.removeEventListener('load', handleReaderLoad);
        };

        img.addEventListener('load', handleImageLoad);
        reader.addEventListener('load', handleReaderLoad);

        reader.readAsDataURL(file);
        setErrorImage('');
        formik.setFieldError('image', '');
      }, [formik, setErrorImage, setImageDimensions]);

    return(
        <PageWrapper>
            <Stack>
                <Typography sx={{ fontSize: '12px' }}>NIM</Typography>
                <Stack direction='row' gap='10px' marginTop='15px'>
                    <TextField variant="outlined" placeholder="Input Your NIM"
                    onChange={handleSearch}
                    sx={{ width:'90%', fontSize:'14px'}}/>
                    <CustomLoadingButton
                    variant="contained"
                    color='primary'
                    size='medium'
                    startIcon={loadingSearch ? <CircularProgress size={20} color="inherit" /> : undefined}
                    loading={loadingSearch}
                    onClick={searchData}
                    sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', width:'100px'}}
                    >
                        <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loadingSearch ? "": "Search"}</Typography>
                    </CustomLoadingButton>
                </Stack>
            </Stack>
            <Divider sx={{marginY: "20px", marginX:'-20px'}}/>

            {alumniData && (
                <Stack>
                    <Stack direction='row' margin='5px 15px' gap='23%'>
                        <Stack gap='20px'>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Name</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.name}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Program</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.program}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Date of Birth</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{format(alumniData.dob,"dd MMMM yyyy")}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Entry Year</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.entryYear ? format(alumniData.entryYear,"yyyy") : "-"}</Typography>
                            </Stack>

                        </Stack>

                        <Stack gap='20px'>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Campus</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.campus}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Degree</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.degree}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Phone Number</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.phoneNumber}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Graduation Year</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.graduationYear ? format(alumniData.graduationYear,"yyyy") : "-"}</Typography>
                            </Stack>

                        </Stack>

                        <Stack gap='20px'>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Faculty</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.faculty}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }} >Place of Birth</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.placeOfBirth}</Typography>
                            </Stack>

                            <Stack gap='7px'>
                                <Typography sx={{ fontSize: '12px' }}>Email</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:'14px' }}>{alumniData.email}</Typography>
                            </Stack>

                        </Stack>
                    </Stack>

                <Divider sx={{marginY: "20px"}}/>
                <Stack alignItems='end'>
                    <Button
                    sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', border:'none', borderRadius:'10px', fontSize:'13px', height:'auto',padding:'3px 40px', width:{xs:'150px', sm:'190px', md:'210px'} }}
                    onClick={changeStatus}>MAKE AS LEADER ALUMNI</Button>
                </Stack>
                <Divider sx={{marginY: "23px"}}/>

                {leaderAlumni === true &&
                <form onSubmit={formik.handleSubmit}
                >
                    <Stack gap='20px'>
                        <Stack gap={1}>
                            <Typography sx={{ fontSize:'12px' }}>Faculty</Typography>
                            <Stack
                            sx={{ backgroundColor:'#D6D6D6', padding:'8px 18px', fontSize:'14px', color:'#808080', borderRadius:'10px' }}>
                                {alumniData.faculty}
                            </Stack>
                        </Stack>

                        <Stack gap={1} overflow='auto'>
                            <Typography sx={{ fontSize:'12px' }}>Program</Typography>
                            <Stack
                                sx={{
                                    backgroundColor: 'white',
                                    border: 'solid 1px',
                                    borderRadius: '15px',
                                    borderColor: '#CCCCCC',
                                    maxHeight: '332px',
                                    overflowY: 'auto',
                                    overflowX: 'auto',
                                    width: '100%',
                                    minWidth: '1000px',
                                    display: 'flex',
                                    flexDirection: 'column', // Ensures vertical stacking works properly
                                }}
                                >
                                {programRows.map((row) => (
                                    <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        borderBottom: '1px solid #CCCCCC',
                                        width: '100%',
                                        flexShrink: 0,
                                    }}
                                    >
                                    {row.map(program => (
                                        <FormControlLabel
                                            key={program.id}
                                            control={
                                                <Checkbox
                                                    checked={formik.values.selectedPrograms.includes(program.id)}
                                                    onChange={(event) => {
                                                        const {selectedPrograms} = formik.values;
                                                        const newSelectedPrograms = event.target.checked
                                                            ? [...selectedPrograms, program.id]
                                                            : selectedPrograms.filter(id => id !== program.id);

                                                        formik.setFieldValue('selectedPrograms', newSelectedPrograms);
                                                        
                                                        if (newSelectedPrograms.length > 0) {
                                                            formik.setFieldError('selectedPrograms', '');
                                                        } else {
                                                            formik.setFieldError('selectedPrograms', 'At least one program must be selected');
                                                        }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography fontSize='12px'>{program.programName}</Typography>
                                            }
                                            sx={{
                                                width: '32.3%',
                                                borderRight: '1px solid #CCCCCC',
                                                paddingLeft: '7px',
                                                paddingRight: '5px',
                                            }}
                                        />
                                    ))}
                                    </Stack>
                                ))}
                                </Stack>
                            {formik.errors.selectedPrograms && formik.touched.selectedPrograms && <span
                                                style={{
                                                color: '#9F041B',
                                                fontFamily: 'font-family: Open Sans, sans-serif',
                                                fontWeight: 400,
                                                fontSize: '0.75em',
                                                lineHeight: '1.66',
                                                textAlign: 'left',
                                                marginTop: '3px',
                                                marginRight: '14px',
                                                marginBottom: 0,
                                                marginLeft: '14px' }}>{formik.errors.selectedPrograms}</span>}
                        </Stack>

                        <Stack>
                            <Stack direction='row' width='100%' justifyContent='space-between'>
                                <Stack width='49%' gap='15px'>
                                    <Typography fontSize='12px'>Duty Period (Start Date)</Typography>
                                    <Stack>
                                        <Datepicker
                                            value={formik.values.startYear}
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
                                            <label htmlFor="image" style={{ background: 'linear-gradient(183deg, rgba(2,142,213,1) 0%, rgba(2,108,162,1) 100%)', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' , fontSize:'13px'}} >
                                                UPLOAD
                                                <input
                                                    type="file"
                                                    title="Upload"
                                                    id="image"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    style={{ display:'none' }}
                                                    />
                                            </label>

                                            {formik.values.image!== null ? (
                                                <Stack>
                                                    <span
                                                    style={{ fontSize: '13px', color: '#333' }}>
                                                        {formik.values.image?.name}
                                                    </span>
                                                    <span
                                                    style={{ fontSize: '11px', color: '#333' }}>
                                                        Photo size: {imageDimensions.width} x {imageDimensions.height}
                                                    </span>
                                                </Stack>
                                            ) : errorImage !== '' ? (
                                                <Stack>
                                                    <Typography sx={{ fontSize: '13px', color: 'red' }}>{errorImage}</Typography>
                                                </Stack>
                                            ) : null}
                                        </Stack>
                                        {formik.errors.image && formik.touched.image && <span
                                            style={{
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
                                            }}>{formik.errors.image}</span>}
                                    </Stack>


                                </Stack>

                                <Stack width='50%' gap='15px'>
                                    <Typography fontSize='12px'>Duty Period (End Date)</Typography>
                                    <Stack>
                                        <Datepicker
                                            value={formik.values.endYear}
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
                                            <label htmlFor="confirmationLetter" style={{ background: 'linear-gradient(183deg, rgba(2,142,213,1) 0%, rgba(2,108,162,1) 100%)', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', fontSize:'13px' }}>
                                                UPLOAD
                                                <input
                                                    type="file"
                                                    id="confirmationLetter"
                                                    name="confirmationLetter"
                                                    accept=".pdf"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;

                                                        if (file){
                                                            if (file.size <= 2 * 1024 * 1024){
                                                                formik.setFieldValue('confirmationLetter', file);
                                                                setErrorDocument('')
                                                                formik.setFieldError('confirmationLetter', '')
                                                            } else {
                                                                formik.setFieldValue('confirmationLetter', null);
                                                                setErrorDocument('Maximum file size is 2MB')
                                                            }
                                                        }
                                                    }}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            {formik.values.confirmationLetter !== null ? (
                                                    <span id="file-name" style={{ fontSize: '14px', color: '#333' }}>{formik.values.confirmationLetter?.name}</span>
                                            ) : errorDocument !== '' ? (
                                                <Stack>
                                                    <Typography sx={{ fontSize: '13px', color: 'red' }}>{errorDocument}</Typography>
                                                </Stack>
                                            ) : null}
                                        </Stack>
                                        {formik.errors.confirmationLetter && formik.touched.confirmationLetter && <span
                                            style={{
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
                                            }}>{formik.errors.confirmationLetter}</span>}
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack mt={1}>
                                <Typography style={{ fontSize: '14px', color: 'red' }}>*Maximum Size: 2MB</Typography>
                                <Typography style={{ fontSize: '14px', color: 'red' }}>*Extension Photo: .JPG, .PNG, .JPEG</Typography>
                                <Typography style={{ fontSize: '14px', color: 'red' }}>*Extension Confirmation Letter: .pdf</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent:'end' }} gap='30px'>
                            <Button sx={{ background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)', color:'white', width:'100px', fontSize:'13px'}} onClick={handleCancel}>Cancel</Button>
                            <CustomLoadingButton
                                loading={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                                variant="contained"
                                sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', width:'100px', fontSize:'13px'}}
                                size='medium'
                                type="submit"
                                disabled={formik.isSubmitting || !isFormComplete()}
                            >
                                <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loading ? 'Loading...' : 'Save'}</Typography>
                            </CustomLoadingButton>
                        </Stack>
                    </Stack>
                </form>
                }

                <ModalAlertInput
                nim={search}
                listCheckPeriod={listCheckPeriod}
                listStillActive={listStillActive}
                listError = {listError}
                setListError={(error) => setListError(error)}
                />

            </Stack>
            )}
        </PageWrapper>
    )
}