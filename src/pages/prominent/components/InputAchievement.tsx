import { FieldArray, FormikErrors, FormikProvider, FormikTouched, useFormik } from "formik";
import { IAchievement, IAchievementCategory, IEvidence } from "../Interface/IInputProminent";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import * as Yup from 'yup';
import { Add as AddIcon, DeleteRounded as DeleteIcon } from '@mui/icons-material';
import { useEffect, useState } from "react";

const generateId = () => `_${Math.random().toString(36).slice(2, 9)}`;

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return true;
    } catch {
        return false;
    }
}  

export function InputAchievement ({
    achievementRows,
    setAchievementRows,
    achievementCategory,
    setErrorEvidenceParent,
    setErrorFileParent,
    setErrorAchievement,
    name,
    nim,
}: {
    achievementRows: IAchievement[];
    setAchievementRows: (data) => void;
    achievementCategory : IAchievementCategory[];
    setErrorEvidenceParent: (data) => void;
    setErrorFileParent: (data) => void;
    setErrorAchievement : (data) => void;
    name : string;
    nim: string
}) {
    const [errorEvidence, setErrorEvidence] = useState("");
    const [errorFile, setErrorFile] = useState([""]);
    const [openAchievementEvidence, setOpenAchievementEvidence] = useState(false);
    const [prevData, setPrevData] = useState<any[]>([]);
    
    const formik = useFormik<IAchievement>({
        initialValues:{
            achievementCategory: 0,
            achievementName: '',
            achievementEvidence: [{ id:generateId() ,evidenceType: 'URL', evidence: null }],
        },
        validationSchema: Yup.object().shape({
            achievementCategory: Yup.number().min(1, "Achievement Category is Required").required('Achievement Category is Required'),
            achievementName: Yup.string()
                .required("Achievement Name is Required"),
          }),
          onSubmit: (values) => {
            if (values.achievementEvidence.length > 1){
                setAchievementRows([...achievementRows, values])
                setErrorEvidenceParent((previousData) => [...previousData, errorEvidence]);
                setErrorFileParent((previousData) => [...previousData, errorFile]);
                formik.resetForm()
            } else {
                setErrorEvidence("There must be at least 1 evidence")
            }

            if (achievementRows.length === 0){
                setErrorAchievement("");
            }
        }
    })

    const handleAddEvidence = (push) => {
        const lastIndex = formik.values.achievementEvidence.length - 1;
        const lastEvidence = formik.values.achievementEvidence[lastIndex];
        
        
        if (!lastEvidence.evidence) {
            setErrorFile(prevErrorFile => {
                const newErrorFile = [...prevErrorFile];
                if (!newErrorFile[lastIndex]) {
                        newErrorFile[lastIndex] = "";
                }
                newErrorFile[lastIndex] = "Evidence cannot be empty";
                return newErrorFile;
            });
        } else {
            if (typeof lastEvidence.evidence === "string" && !isValidUrl(lastEvidence.evidence)){
                setErrorFile(prevErrorFile => {
                    const newErrorFile = [...prevErrorFile];
                    if (!newErrorFile[lastIndex]) {
                            newErrorFile[lastIndex] = "";
                    }
                    newErrorFile[lastIndex] = "Invalid URL";
                    return newErrorFile;
                });
                return;
            }
            // Clear the error if the current evidence is valid
            setErrorFile(prevErrorFile => {
                    const newErrorFile = [...prevErrorFile];
                if (newErrorFile[lastIndex]) {
                        newErrorFile[lastIndex] = "";
                }
                return newErrorFile;
            });
            
            // Push new evidence row
            push({ id: generateId(), evidenceType: 'URL', evidence: null });
        }
    };

    function getNameById(id: number) {
        const target = achievementCategory.find((item) => item.achievementCategoryId === id);
        return target ? target.achievementCategoryName : "-";
    }

    const addName = (evidence : IEvidence) => {
        let fileName = ''
        if(evidence.evidence instanceof File){
          fileName = evidence.evidence.name;
        }
  
        return(
          <span 
          style={{ fontSize: '14px', color: '#333' }}>
              {fileName}
          </span>
        )
    };

    const handleOpenEvidenceDialog = () => {
        setPrevData(formik.values.achievementEvidence);
        setOpenAchievementEvidence(true);
    };  
    
    const validateEvidence = () => {
        const { achievementEvidence } = formik.values;
        let newErrorEvidence = "";
        let hasError = false;
        if (achievementEvidence.length == 1) {
            newErrorEvidence = "At least one evidence is required";
            hasError = true;
            setErrorEvidence(newErrorEvidence);
            if (hasError) {
                setOpenAchievementEvidence(false);
                return;
            }
        }
        setErrorEvidence(newErrorEvidence);
        setOpenAchievementEvidence(false);
    };

    const handleCancelEvidence = () => {
        if (formik.values.achievementEvidence.length == 1) {
            setErrorEvidence("There must be at least 1 evidence");
        }
        formik.setFieldValue(`achievementEvidence`, prevData)
        setErrorFile([""])
        setOpenAchievementEvidence(false);
    }  

    useEffect(() => {
        setPrevData(formik.values.achievementEvidence);
    },[openAchievementEvidence])

    return(
        <FormikProvider value={formik}>
            <Stack spacing={1}>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="start"
                >
                    <Stack minWidth='28%'>
                        <TextField
                        select
                        variant="outlined"
                        name="achievementCategory"
                        value={formik.values.achievementCategory}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.achievementCategory && 
                            Boolean(formik.errors.achievementCategory)
                        }
                        sx={{fontSize: '13px' }}
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
                        {formik.touched.achievementCategory && formik.errors.achievementCategory && (
                            <Typography marginTop={1} fontSize="12px" color="#9F041B">
                                {formik.errors.achievementCategory}
                            </Typography>
                        )}
                    </Stack>
                    <Stack minWidth='36%'>
                        <TextField
                        variant="outlined"
                        name="achievementName"
                        value={formik.values.achievementName}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.achievementName && 
                            Boolean(formik.errors.achievementName)
                        }
                        sx={{    
                            fontSize: '13px'
                        }}
                        />
                        {formik.touched.achievementName && formik.errors.achievementName && (
                            <Typography marginTop={1} fontSize="12px" color="#9F041B">
                                {formik.errors.achievementName}
                            </Typography>
                        )}
                    </Stack>

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
                        onClick={() => handleOpenEvidenceDialog()}
                        >
                        Upload Evidence
                        </Button>
                        {errorEvidence !== "" && (
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
                                {errorEvidence}
                            </Typography>
                        )}
                    </Stack>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon 
                                    sx={{
                                        border: '2px solid white', borderRadius:'10px' 
                                    }}
                                    />}
                        onClick={() => formik.handleSubmit()}
                        sx={{ 
                            mt: 2, 
                            backgroundColor: '#FF9800', 
                            minWidth:'12%' , 
                            fontSize: '13px'
                        }}
                    >
                        Add
                    </Button>
                            
                </Stack>
            </Stack>
            <Dialog open={openAchievementEvidence} onClose={validateEvidence} maxWidth="md" fullWidth>
                <DialogTitle>Achievement Evidence</DialogTitle>
                <DialogContent>
                    <Stack direction='row' mb={2}>
                        <Stack spacing={1} width="45%">
                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Name</Typography>
                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                {name}
                            </Typography>
                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Achievement Category</Typography>
                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                               {getNameById(formik.values.achievementCategory)}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}  width="45%">
                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>NIM</Typography>
                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                {nim}
                            </Typography>
                            <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Achievement</Typography>
                            <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                               {formik.values.achievementName || "-" }
                            </Typography>
                        </Stack>
                    </Stack>
                    <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }} mb={1}> Achievement Evidence</Typography>
                    <FieldArray name="achievementEvidence">
                    {({ push, remove }) => (
                        <Stack spacing={2} minWidth='800px'>
                        {formik.values.achievementEvidence && formik.values.achievementEvidence.map((evidence, idx) => (
                            <Stack key={evidence.id} direction="row" alignItems="center" spacing={2}>
                                <Stack direction='row' border='1px solid #CCCCCC' minWidth='82%' borderRadius='7px' alignItems="center">
                                    <Select
                                        name={`achievementEvidence[${idx}].evidenceType`}
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
                                        name={`achievementEvidence[${idx}].evidence`}
                                        value={evidence.evidence}
                                        onChange={(event) => {
                                            const {value} = event.target;
                                            formik.setFieldValue(`achievementEvidence[${idx}].evidence`, value);
                                    
                                            // Clear error when a value is entered
                                            if (value) {
                                                setErrorFile(prevErrorFile => {
                                                    const newErrorFile = [...prevErrorFile];
                                                    newErrorFile[idx] = "";
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
                                            htmlFor={`achievementEvidence[${idx}].evidence`} 
                                            style={{ 
                                            opacity: '1', color: '#808080', cursor: 'pointer', marginRight: '10px', paddingLeft:'3%'}} >
                                                {formik.values.achievementEvidence[idx].evidence!== null ? (
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
                                            id={`achievementEvidence[${idx}].evidence`}
                                            name={`achievementEvidence[${idx}].evidence`}
                                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                                            onChange={
                                                (event) => {
                                                    const file = event.target.files ? event.target.files[0] : null;

                                                    if(file){
                                                        if (file.size > 2_097_152) {
                                                            formik.setFieldValue(`achievementEvidence[${idx}].evidence`, null);
    
                                                            setErrorFile(prevErrorFile => {
                                                                const newErrorFile = [...prevErrorFile];
                                                                if (!newErrorFile[idx]) {
                                                                    newErrorFile[idx] = "";
                                                                }
                                                                newErrorFile[idx] = `File size exceeds 2 MB`;
                                                                return newErrorFile;
                                                                }
                                                            );
    
                                                        } else {
                                                            formik.setFieldValue(`achievementEvidence[${idx}].evidence`, file);
                                                            
                                                            setErrorFile(prevErrorFile => {
                                                                const newErrorFile = [...prevErrorFile];
                                                                if (!newErrorFile[idx]) {
                                                                    newErrorFile[idx] = "";
                                                                }
                                                                newErrorFile[idx] = ""
                                                                return newErrorFile;
                                                            }); 
                                                        }
                                                    }
                                                }
                                            }
                                            style={{ minWidth: '70%' , display:'none'}}
                                            />
                                            {formik.values.achievementEvidence[idx] !== null ? addName(formik.values.achievementEvidence[idx]) : null}
                                        </Stack>
                                    )}
                                    {errorFile[idx] ? (
                                        <span 
                                        style={{ fontSize: '12px', color: 'red'}}>
                                            {errorFile[idx]}
                                        </span>
                                    )
                                    : null}
                                </Stack>
                                {idx === formik.values.achievementEvidence.length - 1 ? (
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
                <Typography fontWeight="600" fontSize="14px" mt={2}>
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
        
        </FormikProvider>
    )

}