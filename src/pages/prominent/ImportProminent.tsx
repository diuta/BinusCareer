import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button,
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
         Table, 
         TableBody, 
         TableCell, 
         TableContainer, 
         TableHead, 
         TableRow, 
         TextField, 
         Typography} from "@mui/material";
import PageWrapper from "../../components/container/PageWrapper";
import { RiFileExcel2Fill } from "react-icons/ri";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import { addDays, format, formatDate, isValid, parse } from "date-fns";
import * as XLSX from 'xlsx';
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import { FieldArray, FormikErrors, FormikProvider, useFormik } from "formik";
import { Delete, Add as AddIcon } from '@mui/icons-material';
import useModal from "../../hooks/use-modal";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profile/selector";
import TableAjax from "../../components/common/table_ajax/TableAjax";
import { ColumnDef } from "@tanstack/react-table";
import { ErrorDataType, IAchievementCategory, IEvidence, IInputValue, ISubmitImport, ImportType } from "./Interface/IImportProminent";
import { useNavigate } from "react-router-dom";
import { ModalAlertImport } from "./components/ImportErrorTable";
import NumberPagination from "../../components/common/table_pagination/NumberPagination";

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

function convertToUTCWithoutChangingDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);

  const dateSent = new Date(year, month - 1, day);

  const localOffset = dateSent.getTimezoneOffset() * 60_000;

  const utcDate = new Date(dateSent.getTime() - localOffset);

  return utcDate.toISOString();
}

function isValidDate(stringDate) {
  const regex = /^([0-2]\d|3[01])-(0\d|1[0-2])-\d{4}$/;
  return regex.test(stringDate);
}

const generateId = () => `_${Math.random().toString(36).slice(2, 9)}`;

const handleTemplate = (setIsTemplateLoading: (loading: boolean) => void) => {
  setIsTemplateLoading(true);
  apiClient.get(ApiService.getProminentTemplate,{
    responseType:'blob',
  })
  .then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ProminentImportTemplate.xlsx`);
    document.body.append(link);
    link.click();
    setIsTemplateLoading(false);
  })
};

const getAchievementCategoryId = async (achievementName : string) => {
  const response = await apiClient.get(`${ApiService.prominent}/achievement-category-id?achievementName=${achievementName}`);
  return response.data.categoryId;
}

export default function ImportProminent () {
    const [files, setFiles] = useState<FileList | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [excelData, setExcelData] = useState<ImportType[]>([]);
    const [originalData, setOriginalData] = useState<ImportType[]>([]);

    const [openAchievementEvidence, setOpenAchievementEvidence] = useState(false);
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState<number | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const [achievementCategory, setAchievementCategory] = useState<IAchievementCategory[]>([]);
    const [prevData, setPrevData] = useState<any[]>([]);
    const [errorFile, setErrorFile] = useState<string[][]>([])
    
    const [openErrorTable, setOpenErrorTable] = useState(false);
    const [errorTable, setErrorTable] = useState<ErrorDataType[]>([]);
    const [errorPage, setErrorPage] = useState<number>(0);
    const [errorPageSize, setErrorPageSize] = useState<number>(10);
    const [pagedErrorTable, setPagedErrorTable] = useState<ErrorDataType[]>([]);
    
    const [openSubmitError, setOpenSubmitError] = useState(false);
    const [submitError, setSubmitError] = useState<IInputValue[]>([]);
    const [submitErrorPage, setSubmitErrorPage] = useState<number>(0);
    const [submitErrorPageSize, setSubmitErrorPageSize] = useState<number>(10);
    const [pagedErrorSubmit, setPagedErrorSubmit] = useState<IInputValue[]>([]);
    
    const [sort, setSort] = useState<string>('');

    const expectedHeaders = ["NIM","Period (dd-mm-yyyy)","Date (dd-mm-yyyy)","Achievement Category","Achievement","Achievement Evidence","Binus Support"];
    
    const [pageIndex, setPageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [rowCount, setRowCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const { showModal } = useModal();
    const { binusianId} = useSelector(selectProfile);
    const Navigate = useNavigate();

    
    const validate = (values: { items: ImportType[] }) => {
      const validateError: { items: FormikErrors<ImportType>[] } = { items: [] };
      
      values.items.forEach((item, index) => {
        const itemErrors: FormikErrors<ImportType> = {};
        
        if (!item.alumniId) {
          itemErrors.alumniId = "NIM is Required";
        }
    
        if (!item.name) {
          itemErrors.name = "Alumni not Found";
          itemErrors.campus = "Alumni not Found";
          itemErrors.faculty = "Alumni not Found";
          itemErrors.program = "Alumni not Found";
          itemErrors.degree = "Alumni not Found";
        }

        if(!item.campus || !item.faculty || !item.program || !item.degree){
          itemErrors.name = "Alumni Program not Found";
          itemErrors.campus = "Alumni Program not Found";
          itemErrors.faculty = "Alumni Program not Found";
          itemErrors.program = "Alumni Program not Found";
          itemErrors.degree = "Alumni Program not Found";
        }
    
        if (!item.period) {
          itemErrors.period = "Period is Required";
        }
        else if(!isValidDate(item.period)){
          itemErrors.period = "Invalid period format (dd-mm-yyyy)";
        }
        else{
          const parsedPeriod = parse(item.period, 'dd-MM-yyyy', new Date());
          if(!isValid(parsedPeriod)){
            itemErrors.period = "Invalid period format (dd-mm-yyyy)";
          }
        }
    
        if (!item.date) {
          itemErrors.date = "Date is Required";
        }
        else if(!isValidDate(item.date)){
          itemErrors.date = "Invalid date format (dd-mm-yyyy)";
        }
        else{
          const parsedDate = parse(item.date, 'dd-MM-yyyy', new Date());
          if(!isValid(parsedDate)){
            itemErrors.date = "Invalid date format (dd-mm-yyyy)";
          }
        }
    
        if (!item.achievementCategory && item.achievementEvidence[0].evidence !== '' && !item.binusSupport) {
          itemErrors.achievementCategory = "Achievement Category is Required";
        }
    
        if (!item.achievementName && item.achievementEvidence[0].evidence !== '' && !item.binusSupport) {
          itemErrors.achievementName = "Achievement Name is Required";
        }

        if (item.achievementCategory && item.achievementName && item.achievementEvidence.length === 1 && !item.binusSupport) {
          itemErrors.achievementEvidence = "Achievement Evidence minimum 1";
        }
    
        if (!item.binusSupport && item.achievementEvidence[0].evidence === '') {
          itemErrors.binusSupport = "Binus Support is Required";
        }
    
        if (Object.keys(itemErrors).length > 0) {
          validateError.items[index] = itemErrors;
        }
      });
    
      return validateError.items.length > 0 ? validateError : {};
    };

    const uploadFiles = async (groupedData: IInputValue[]) => {
      const param: ISubmitImport[] = [];
    
      const uploadPromises = groupedData.map(async (row) => {
        const rowData: ISubmitImport = {
          alumniId: row.alumniId.toString(),
          period: row.period,
          date: row.date,
          achievements: await Promise.all(
            row.achievements.map(async (achievement) => ({
              achievementCategory: achievement.achievementCategory,
              achievementName: achievement.achievementName,
              achievementEvidence: await Promise.all(
                achievement.achievementEvidence.map(async (evidence) => {
                  if (evidence.evidence !== '') {
                    if (evidence.evidence instanceof File) {
                      const formFile = new FormData();
                      formFile.append('uploadedFile', evidence.evidence);
                      formFile.append('alumniId', row.alumniId);
                    
                      const upload = await apiClient.post(
                        `${ApiService.prominent}/upload-to-share-point`,
                        formFile,
                        { headers: { "Content-Type": "multipart/form-data" } }
                      );
                    
                      return {
                        evidenceType: evidence.evidenceType,
                        evidence: upload.data.filePath,
                      };
                    }
                    
                    return {
                      evidenceType: evidence.evidenceType,
                      evidence: evidence.evidence || '',
                    };
                    
                  }
    
                  return {
                    evidenceType: evidence.evidenceType,
                    evidence: '',
                  };
                })
              ),
            }))
          ),
          binusSupport: row.binusSupport,
          userIn: binusianId,
        };
    
        param.push(rowData);
      });
    
      await Promise.all(uploadPromises);
    
      const response = await apiClient.post(
        `${ApiService.prominent}/import-prominent`, JSON.stringify(param)
      );
    };
    
    const formik = useFormik({
      initialValues: { items: excelData },
      enableReinitialize: true,
      validate,
      onSubmit: async (values) => {
        setIsLoading(true);
        try {
          const groupedData = groupDataByAlumniIdPeriodDate(values.items);     
          groupedData.map((item) => {
            if (item.achievements.length === 0 || item.binusSupport.length === 0){
              submitError.push(item)
            }
          })

          if (submitError.length > 0){
            throw new Error("Error Input");
          }
          await uploadFiles(groupedData);
    
          showModal({
            title: 'Success',
            message: 'Import Data Request is Submitted Successfully',
            options: {
              variant: 'success',
              onOk: () => Navigate('/prominent/approval'),
            },
          });
          setIsLoading(false);
        } catch {
          if (submitError.length > 0){
            setOpenSubmitError(true);
            setIsLoading(false);
          } else {
            showModal({
              title: 'Failed',
              message: 'Check again the inputted data',
              options: {
                variant: 'failed',
                onOk: () => setIsLoading(false)
              },
            });
          }
        }
      }
    });

    const groupDataByAlumniIdPeriodDate = (data: ImportType[]): IInputValue[] => {
      if (!data || data.length === 0) return []; // Handle empty or undefined data
    
      const groupedData: { [key: string]: IInputValue } = {};
    
      data.forEach((row) => {
        const key = `${row.alumniId}-${row.period}-${row.date}`;
    
        if (!groupedData[key]) {
          // Initialize a new entry
          groupedData[key] = {
            alumniId: row.alumniId,
            period: convertToUTCWithoutChangingDate(row.period),
            date: convertToUTCWithoutChangingDate(row.date),
            achievements: [],
            binusSupport: "",
            userIn: binusianId,
          };
        }
    
        // Find the index of the existing achievement
        const existingAchievementIndex = groupedData[key].achievements.findIndex(
          (achievement) =>
            achievement.achievementName === row.achievementName &&
            achievement.achievementCategory === row.achievementCategory
        );
    
        if (existingAchievementIndex === -1) {
          // Add a new achievement if it doesn't exist
          if (row.achievementCategory !== "") {
            groupedData[key].achievements.push({
              achievementCategory: row.achievementCategory,
              achievementName: row.achievementName,
              achievementEvidence: row.achievementEvidence.filter(
                (e) => e.evidence !== "" && e.evidence !== null
              ),
            });
          }
        } else {
          // If it exists, merge evidence
          const existingAchievement = groupedData[key].achievements[existingAchievementIndex];
          const newEvidence = row.achievementEvidence.filter(
            (e) => e.evidence !== "" && e.evidence !== null
          );
    
          // Avoid duplicating evidence
          existingAchievement.achievementEvidence = [
            ...existingAchievement.achievementEvidence,
            ...newEvidence.filter(
              (newEv) =>
                !existingAchievement.achievementEvidence.some(
                  (oldEv) => oldEv.evidence === newEv.evidence
                )
            ),
          ];
        }
    
        // Merge binusSupport, ignoring null or empty values
        if (row.binusSupport && row.binusSupport !== "") {
          const currentSupports = groupedData[key].binusSupport
            .split(",")
            .filter((s) => s !== "");
          if (!currentSupports.includes(row.binusSupport)) {
            currentSupports.push(row.binusSupport);
          }
          groupedData[key].binusSupport = currentSupports.join(",");
        }
      });
    
      return Object.values(groupedData);
    };
    
    const renderErrorMessages = (errorData: ErrorDataType) => {
      const errorMessages = errorData.errorMessage.split(";");
      return (
        <div>
          {errorMessages.map((msg, index) => (
            <span key={`${errorData.rowNumber}`}>
                {errorMessages.length > 1 ?(
                  `${index + 1}. ${msg.trim()}`
                  ) : (
                    `${msg.trim()}`
                  )
                }
              <br />
            </span>
          ))}
        </div>
      );
    };

    const submitErrorColumns = useMemo<ColumnDef<IInputValue>[]>(
      () => [
        {
          accessorKey: 'alumniId',
          header: 'NIM',
        },
        {
          accessorKey: 'period',
          header: 'Period',
          cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy'),
        },
        {
          accessorKey: 'date',
          header: 'Date',
          cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy'),
        },
        {
          header: 'Message',
          cell: info => "There must be at least 1 Achievement and Binus Support",
        }
      ],
      [errorPage, errorPageSize]
    );
    
    const columns = useMemo<ColumnDef<ErrorDataType>[]>(
      () => [
        {
          accessorKey: 'alumniNIM',
          header: 'NIM',
        },
        {
          accessorKey: 'rowNumber',
          header: 'Row Number',
        },
        {
          accessorKey: 'errorMessage',
          header: 'Notes',
          cell: info => {
            const errorData = info.row.original;
            return renderErrorMessages(errorData);
          }
        }
      ],
      [submitErrorPage, submitErrorPageSize]
    );

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        setFiles(droppedFiles);
        handleFile(droppedFiles[0]);
    };

    const addUniqueIdsToData = (data: ImportType[]) =>
      data.map((entry) => ({
        ...entry,
        achievementEvidence: entry.achievementEvidence.map((evidence) => ({
          ...evidence,
          id: generateId(),
          isOld: true,
        })),
    }));
    
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (selectedFiles) {
        if(selectedFiles[0].type == "text/csv" || selectedFiles[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
          setFiles(selectedFiles);
          handleFile(selectedFiles[0]);
        }
        else{
          showModal({
            title: 'Failed',
            message:
                'Invalid File Type',
            options: {
                variant: 'failed',
            },
            });
        }
      }
    };
    
    const handleFile = (file: File) => {
      setLoadingFile(true);
      const reader = new FileReader();
      
      reader.addEventListener('load', async (event) => {
        const arrayBuffer = (event.target as FileReader).result as ArrayBuffer;
        
        if (arrayBuffer) {
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          setErrorFile([]);
          setErrorTable([]);
          const headers = parsedData[0] as string[];

          let tempNIM: { NIM: string }[] = [];
          const tempErrors:  ErrorDataType[] = [];

          const listNim = parsedData.slice(1).map((row:any[]) => {
            const tempId = row[0];
            tempNIM.push({
              "NIM": `${tempId}`
            });
          });
          
          const queryString = tempNIM
          .map((item, index) => `data[${index}].NIM=${item.NIM}`)
          .join('&');
          
          const fetchData = async () => {
            const resp = await apiClient.get(`${ApiService.prominent}/detail?${queryString}`);
            return resp.data;
          };

          const headersMismatch = !expectedHeaders.every((header, index) => header === headers[index]);
          if(headersMismatch){
            showModal({
              title: 'The Excel Format Is Invalid',
              message: 'Please use the provided import template',
              options: { 
                  variant: 'failed' ,
              },
            });
            setLoadingFile(false);
            return;
          }
          try {
            const dataAlumni = await fetchData();
            const rows = await Promise.all(parsedData.slice(1).map(async (row: any[],rowIndex) => {
              const rowErrors: string[] = [];
              const tempFilter = dataAlumni.find((item) => item.alumniId == row[0]);
              const {
                alumniName: alumniName = '',
                campusName : campusName = '',
                facultyName: facultyName = '',
                programName: programName = '',
                degreeName: degreeName = ''
              } = tempFilter ?? {};
              
              if (row.length === 0){
                return {
                  alumniId: "",
                  name: alumniName,
                  campus : campusName,
                  faculty : facultyName,
                  program : programName,
                  degree : degreeName,
                  period: row[1],
                  date : row[2],
                  achievementCategory : "",
                  achievementName : "",
                  achievementEvidence: [],
                  binusSupport : "",
                };
              }

              for (let i = 0; i<3 ;i+=1){
                if (row[i]=== undefined || row[i] === null || row[i] === ""){
                  rowErrors.push("Empty Data Detected (nim period date)");
                }
              }
              
              const period: string = '';
              const date: string ='';
              if(!isValidDate(row[1]) || !isValidDate(row[2])){
                rowErrors.push("Invalid Data Format");
              }
              
              const binusSupport = row[6] || '';
              const achievementCategoryName = row[3] || '';
              const achievementName = row[4] || '';
              const achievementEvidenceRaw = row[5] || "";
              const achievementEvidence = achievementEvidenceRaw.split('\r\n');

              let achievementId = '';
              if (row[3] !== '') {
                achievementId = await getAchievementCategoryId(row[3]);
              }

              if ((!achievementCategoryName || achievementId === "0") && !binusSupport) {
                rowErrors.push("Achievement Category is invalid");
              }

              if ((!achievementName || !achievementEvidenceRaw) && !binusSupport) {
                rowErrors.push("Empty Data Detected");
              }

              if ((achievementCategoryName || achievementName || achievementEvidenceRaw) && binusSupport){
                rowErrors.push("Invalid Data Format");
              }              
              
              
              const rowData: ImportType = {
                alumniId: row[0],
                name: alumniName,
                campus : campusName,
                faculty : facultyName,
                program : programName,
                degree : degreeName,
                period: row[1],
                date : row[2],
                achievementCategory : achievementId === '0' ? '' : achievementId,
                achievementName,
                achievementEvidence: achievementEvidence.map((evidence) => ({ evidenceType: 'URL', evidence })),
                binusSupport,
              };

              if (!row[1] || !row[2]) {
                  rowErrors.push("Empty Data Detected");
                }

              if(!tempFilter){
                rowErrors.push("NIM Not Found");
              }
              else if(!alumniName || !campusName || !facultyName || !programName || !degreeName){
                rowErrors.push("Alumni Program Not Found");
              }
              if (rowErrors.length > 0) {
                tempErrors.push({
                  alumniNIM: row[0],
                  rowNumber: rowIndex + 2,
                  errorMessage: rowErrors.join(';')
                });
              }
              for (let j = 0 ; j < rowData.achievementEvidence.length ; j+=1){
                setErrorFile(prevErrorFile => {
                  const newErrorEvidence = [...prevErrorFile];
                  
                  if (!newErrorEvidence[rowIndex]) {
                      newErrorEvidence[rowIndex] = [];
                  }
                  
                  newErrorEvidence[rowIndex][j] = "";
                  
                  return newErrorEvidence;
                });
              }
              return rowData;
            }));

            if(tempErrors.length > 0){
              tempErrors.sort((a: ErrorDataType, b: ErrorDataType) => a.rowNumber - b.rowNumber);
              setErrorTable(tempErrors);
              throw new Error("There is error");
            }

            const validRows = rows.filter((row) => row.alumniId !== "") ?? [];
            
            let processedData = addUniqueIdsToData(validRows);
            processedData = processedData.map((item) => {
                item.achievementEvidence.push({id: generateId(), evidenceType : 'URL', evidence : null, isOld : false})

                return item;
            })
            setExcelData(processedData);
            setOriginalData(processedData);
            
            tempNIM = [];
            setLoadingFile(false);
            
          } catch (error) {
            console.log(error);
            setLoadingFile(false);
          }
        }
      });
      
      reader.readAsArrayBuffer(file);
    };
    
    
    const handleApply = () => {
      if (errorTable.length > 0){
        setOpenErrorTable(true)
      } else if (showTable){
        setExcelData(originalData);
        setPageIndex(0);
        setRowCount(originalData.length);
        setPageCount(Math.ceil(originalData.length / pageSize));
        formik.resetForm({
          values: { items: originalData }
        });
      } else {
        setShowTable(true);
        setRowCount(excelData.length);
        setPageCount(Math.ceil(excelData.length / pageSize));
      }
    };

    const handleClearFiles = () => {
        setFiles(null);
        setExcelData([]);
        setOriginalData([]);
        setShowTable(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    };

    function getNameById(id: string) {
      const target = achievementCategory.find((item) => item.achievementCategoryId === parseInt(id,10));
      return target ? target.achievementCategoryName : "Name not found";
    }

    const getAchievementCategory = async () => {
      const response = await apiClient.get(`${ApiService.prominent}/prominent-achievement-category`)
      setAchievementCategory(response.data.listGetProminentAchievementCategoryResponseDTO)
    }
    
    const currentPageData = () => {
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      return excelData.slice(startIndex, endIndex);
    };

    const handlePageSizeChange = (event) => {
      const newSize = Number(event.target.value);
      setPageSize(newSize);
      setPageCount(Math.ceil(excelData.length / newSize));
      setPageIndex(0);
    };

    const paginatedItems = useMemo(() => formik.values.items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), [formik.values.items, pageIndex, pageSize]);  

    const handleDeleteRow = (index: number) => {
      setExcelData((prevoriginalData) => {
        const updatedData = prevoriginalData.filter((_, rowIndex) => rowIndex != index);
        formik.setFieldValue('excelData', updatedData);
        setRowCount(updatedData.length);
        setPageCount(Math.ceil(updatedData.length / pageSize));
        return updatedData;
      });
    };

    const handleFormikChange = (index) => async (event) => {
      const { name, value } = event.target;
      const updatedData = [...excelData];
      
      if (name === 'alumniId') {
          const newNIM = value;
          updatedData[index].alumniId = newNIM;
          setExcelData(updatedData); // Update state immediately with the new NIM
          formik.setFieldValue('items',updatedData)
  
          if (newNIM.length === 10) {
              try {
                  const tempNIMDetail: { NIM: string }[] = [{ "NIM": newNIM }];
                  const queryString = tempNIMDetail
                  .map((item, i) => `data[${i}].NIM=${item.NIM}`)
                  .join('&');
                  const response = await apiClient.get(`${ApiService.prominent}/detail?${queryString}`);
                  
                  updatedData[index] = {
                      ...updatedData[index], 
                      name: response.data.find((item) => item.alumniId === newNIM)?.name || '', 
                      campus: response.data.find((item) => item.alumniId === newNIM)?.campus || '', 
                      faculty: response.data.find((item) => item.alumniId === newNIM)?.faculty || '', 
                      program: response.data.find((item) => item.alumniId === newNIM)?.program || '', 
                      degree: response.data.find((item) => item.alumniId === newNIM)?.degree || ''
                  };

                  setExcelData(updatedData); // Update state again with API response data
                  formik.setFieldValue('items',updatedData)
              } catch (error) {
                console.error("Error fetching alumni details:", error);
              }
          } else {
              // Clear the dependent fields if NIM is not valid
              updatedData[index] = {
                  ...updatedData[index],
                  name: '',
                  campus: '',
                  faculty: '',
                  program: '',
                  degree: ''
              };
              setExcelData(updatedData); // Update state immediately
              formik.setFieldValue('items',updatedData)
          }
      } else {
          const newVal = value;
          updatedData[index][name] = newVal;
          setExcelData(updatedData); // Update state immediately for non-NIM fields
          formik.setFieldValue('items',updatedData)
      }
  
      formik.handleChange(event);
    };

    const handleOpenEvidenceDialog = (index: number) => {
      setCurrentAchievementIndex(index);
      setPrevData(formik.values.items[index].achievementEvidence);
      setOpenAchievementEvidence(true);
    };

    const handleCancelEvidence = () => {
      setOpenAchievementEvidence(false);
      formik.setFieldValue(`items[${currentAchievementIndex}].achievementEvidence`, prevData)
    }

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

    useEffect(() => {
      if (errorTable.length > 0) {
        const paging = errorPage*errorPageSize;
        const pagedData = errorTable.slice(paging, (paging + errorPageSize)-1);
        setPagedErrorTable(pagedData)
      }
    }, [errorPage, errorPageSize, errorTable, openErrorTable]);

    useEffect(() => {
      if (submitError.length > 0) {
        const paging = submitErrorPage*submitErrorPageSize;
        const pagedData = submitError.slice(paging, (paging + submitErrorPageSize)-1);
        setPagedErrorSubmit(pagedData)
      }
    }, [submitErrorPage, submitErrorPageSize, submitError, openSubmitError]);

    useEffect(() => {
      if(currentAchievementIndex){
          setPrevData(formik.values.items[currentAchievementIndex].achievementEvidence);
      }
    },[currentAchievementIndex])

    useEffect(() => {
      getAchievementCategory();
    }, [])

    return (
        <PageWrapper>
          <Stack direction='row' justifyContent='flex-end'>
            <CustomLoadingButton
                startIcon={<RiFileExcel2Fill size='25px' />}
                variant="contained"
                color='success'
                sx={{ width: '22%' }}
                size='medium'
                loading={loadingDownload}
                onClick={() => handleTemplate(setLoadingDownload)}
            >
               <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>
                DOWNLOAD TEMPLATE
              </Typography>
            </CustomLoadingButton>
          </Stack>
          <Stack>
            <Typography sx={{fontSize:'12px'}}>Import Excel</Typography>
          </Stack>
          <Stack sx={{marginTop:'5px'}}>
            <Typography color="red" sx={{fontSize:'10px'}}>Ensure you fill in the green columns in the Excel template according to the options on the master list</Typography>
          </Stack>
          <Stack sx={{marginTop:'2px'}}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid lightgray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              {!files ? (
                <>
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      width: '98%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    {!files && (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: '20px',
                        marginBottom: '20px',
                        border: '2px dashed #ccc',
                        padding: '20px',
                        borderRadius: '4px'
                      }}
                    >
                      <Typography fontSize='14px'>Drag and Drop File Here</Typography>
                    </div>
                    )}
                  </label>
                </>
              ): (
                <Box sx={{ marginTop: '20px', textAlign: 'center', width: '100%', paddingBottom:'20px' }}>
                  <Typography fontSize='12px'>Selected Files:</Typography>
                  {[...files].map((file, idx) => (
                    <Typography key={file.name} fontSize='12px'>{file.name}</Typography>
                  ))}
                  <Button variant="outlined" 
                  onClick={handleClearFiles} 
                  sx={{ marginTop: '10px' , width:'10%',fontSize:'13px'}}>
                    Clear Files
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
          <Stack direction='row' justifyContent='flex-end' sx={{ width: '100%', paddingTop: '20px' }}>
            <CustomLoadingButton
              loading={loadingFile}
              startIcon={loadingFile ? <CircularProgress size={20} color="inherit" /> : undefined}
              variant="contained"
              color='primary'
              sx={{ width: '150px', fontSize:'13px' }}
              size='medium'
              onClick={handleApply}
            >
              <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loadingFile ? 'Loading...' : 'Apply'}</Typography>
              </CustomLoadingButton>
          </Stack>
          <Divider sx={{ marginY: '20px' }} />
          {showTable && (
            rowCount > 0 ? (
              <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                  <Box sx={{ marginTop: '20px', backgroundColor:'white' }}>
                    <TableContainer sx={{backgroundColor: 'white'}}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>NIM</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Name</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Campus</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Faculty</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Program</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Degree</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Period</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Date</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Achievement Category</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Achievement Detail</TableCell>
                            <TableCell sx={{ minWidth:'215px', fontSize:'12px', fontWeight:600 }}>Achievement Evidence</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Binus Support</TableCell>
                            <TableCell sx={{ fontSize:'12px', fontWeight:600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentPageData().map((row: { [key: string]: any }, rowIndex: number) => (
                            <TableRow key={row.key}>
                              {Object.keys(row).map((key: string) => (
                                <TableCell key={key}>
                                  {key === "achievementEvidence" ? (
                                    <Stack minWidth='20%'>
                                      {formik.values.items[rowIndex].achievementEvidence[0].evidence !== '' ? (
                                          <Button
                                            variant="contained"
                                            startIcon={<AddIcon sx={{ border: '2px solid white', borderRadius: '10px' }} />}
                                            sx={{ backgroundColor: '#FF9800', fontSize: '13px', width: '100%' }}
                                            onClick={() => handleOpenEvidenceDialog(rowIndex)}
                                          >
                                            Upload Evidence
                                          </Button>
                                      ) : (
                                        <TextField disabled />
                                      )}
                                    </Stack>
                                  ) : key === 'achievementCategory' ? (
                                    <TextField
                                      select
                                      variant="outlined"
                                      name={key}
                                      value={formik.values.items[rowIndex][key] || ''} 
                                      onChange={handleFormikChange(rowIndex)}
                                      sx={{ minWidth: '200px', fontSize: '13px' }}
                                      disabled={formik.values.items[rowIndex][key] === '' && formik.values.items[rowIndex].achievementName === '' }
                                      helperText={key && formik.errors.items?.[rowIndex]?.[key]}
                                      error={formik.touched.items?.[rowIndex]?.[key] && Boolean(formik.errors.items?.[rowIndex]?.[key])}
                                    >
                                      <MenuItem value=''>Select Category</MenuItem>
                                      {achievementCategory?.map((achievementCategoryList) => (
                                        <MenuItem
                                          key={achievementCategoryList.achievementCategoryId.toString()}
                                          value={achievementCategoryList.achievementCategoryId.toString()}
                                        >
                                          {achievementCategoryList.achievementCategoryName}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  ) : key === 'achievementName' ? (
                                    <TextField
                                      name={key}
                                      value={formik.values.items[rowIndex][key]}
                                      onChange={handleFormikChange(rowIndex)}
                                      onBlur={formik.handleBlur}
                                      size="small"
                                      sx={{ width: '150px', maxWidth: '150px' }}
                                      disabled={formik.values.items[rowIndex][key] === '' && formik.values.items[rowIndex].achievementCategory === ''}
                                      helperText={key && formik.errors.items?.[rowIndex]?.[key]}
                                      error={formik.touched.items?.[rowIndex]?.[key] && Boolean(formik.errors.items?.[rowIndex]?.[key])}
                                    />
                                  ) : key === 'binusSupport' ? (
                                    <TextField
                                      name={key}
                                      value={formik.values.items[rowIndex][key]}
                                      onChange={handleFormikChange(rowIndex)}
                                      onBlur={formik.handleBlur}
                                      size="small"
                                      sx={{ width: '150px', maxWidth: '150px' }}
                                      disabled={formik.values.items[rowIndex][key] === '' && (formik.values.items[rowIndex].achievementCategory !== '' || formik.values.items[rowIndex].achievementName !== '')}
                                      helperText={key && formik.errors.items?.[rowIndex]?.[key]}
                                      error={formik.touched.items?.[rowIndex]?.[key] && Boolean(formik.errors.items?.[rowIndex]?.[key])}
                                    />
                                  ) : (
                                    <TextField
                                      name={key}
                                      value={formik.values.items[rowIndex][key]}
                                      onChange={handleFormikChange(rowIndex)}
                                      onBlur={formik.handleBlur}
                                      size="small"
                                      sx={{ width: '150px', maxWidth: '150px' }}
                                      disabled={key === 'name' || key === 'campus' || key === 'faculty' || key === 'program' || key === 'degree'}
                                      helperText={key && formik.errors.items?.[rowIndex]?.[key]}
                                      error={formik.touched.items?.[rowIndex]?.[key] && Boolean(formik.errors.items?.[rowIndex]?.[key])}
                                    />
                                  )}
                                </TableCell>
                              ))}
                              <TableCell>
                                <IconButton
                                  color="secondary"
                                  onClick={() => {
                                    handleDeleteRow(rowIndex);
                                  }}
                                >
                                  <Delete color="primary" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Stack direction='row' justifyContent='flex-end' sx={{ marginTop: '20px', marginRight: '20px', marginBottom: '20px', alignItems: 'center', paddingBottom:'20px' }} gap='10px'>
                    <Typography sx={{ marginRight: '10px', fontSize:'12px', fontWeight:400 }}>{rowCount} Results</Typography>
                    <Typography sx={{fontSize:'12px', fontWeight:400}}>Show: </Typography>
                    <Select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ width: 70, ' .binus-InputBase-input': { padding: '7px 10px 6px 8px !important'},  }}
                      SelectDisplayProps={{ style: { fontSize: 12 } }}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                    <NumberPagination
                      pageIndex={pageIndex}
                      pageCount={pageCount}
                      setPageIndex={setPageIndex}
                    />
                  </Stack> 
                  </Box>
                  <Stack direction='row' justifyContent='flex-end' gap='20px' sx={{ width: '100%', marginTop: '20px' }}>
                    <Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ width: '120px', fontSize:'13px' }}
                        size='medium'
                        onClick={handleClearFiles}
                      >
                        <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Cancel</Typography>
                      </Button>
                    </Box>
                    <Box>
                      <CustomLoadingButton
                        loading={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
                        variant="contained"
                        color="primary"
                        sx={{ width: '120px' }}
                        size='medium'
                        type="submit"
                        disabled={formik.isSubmitting || !formik.isValid}
                      >
                        <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{isLoading ? 'Loading...' : 'Save'}</Typography>
                      </CustomLoadingButton>
                    </Box>
                  </Stack>

                  <Dialog open={openAchievementEvidence} onClose={() => setOpenAchievementEvidence(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Achievement Evidence</DialogTitle>
                    <DialogContent>
                      {currentAchievementIndex !== null &&
                      <>
                        <Stack direction='row' mb={2}>
                            <Stack spacing={1} width="45%">
                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Name</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                    {formik.values.items[currentAchievementIndex].name}
                                </Typography>
                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Achievement Category</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                {getNameById(formik.values.items[currentAchievementIndex].achievementCategory)}
                                </Typography>
                            </Stack>
                            <Stack spacing={1}  width="45%">
                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>NIM</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                    {formik.values.items[currentAchievementIndex].alumniId}
                                </Typography>
                                <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }}>Achievement</Typography>
                                <Typography sx={{ fontWeight:600, fontSize:{xs:'10px', sm:'12px' , md:'14px'} }}>
                                {formik.values.items[currentAchievementIndex].achievementName}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Typography sx={{ fontSize:{xs:'8px', sm:'10px' , md:'12px'} }} mb={1}> Achievement Evidence</Typography>
                      </>
                      }
                      {currentAchievementIndex !== null && (
                        <FieldArray name={`items[${currentAchievementIndex}].achievementEvidence`}>
                        {({ push, remove }) => (
                            <Stack spacing={2} minWidth='800px'>
                            {formik.values.items[currentAchievementIndex].achievementEvidence && formik.values.items[currentAchievementIndex].achievementEvidence.map((evidenceValue, idx) => (
                                <Stack key={evidenceValue.id} direction="row" alignItems="center" spacing={2}>
                                    <Stack direction='row' border='1px solid #CCCCCC' minWidth='82%' borderRadius='7px' alignItems='center'>
                                        <Select
                                            name={`items[${currentAchievementIndex}].achievementEvidence[${idx}].evidenceType`}
                                            value={evidenceValue.evidenceType}
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
                                        {evidenceValue.evidenceType === 'URL' ? (
                                            <Stack minWidth='67%'>
                                              {evidenceValue.isOld == true ? 
                                                (
                                                    <TextField
                                                    name={`formik.values.items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                    value={evidenceValue.evidence}
                                                    variant='outlined' 
                                                    onClick={
                                                        ()=>{
                                                            const url = typeof evidenceValue.evidence === "string" ? evidenceValue.evidence : "";
                                                            const formattedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `http://${url}`;
                                                            window.open(typeof evidenceValue.evidence === "string" ? formattedUrl : "", "blank")
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
                                                  name={`formik.values.items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                  value={evidenceValue.evidence}
                                                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                    formik.setFieldValue(
                                                      `items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`,
                                                      event.target.value
                                                    );
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
                                                )}
                                            </Stack>
                                            ) : (
                                            <Stack width='67%' display='flex' alignItems='center' direction='row'>
                                                <label 
                                                htmlFor={`items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`} 
                                                style={{ 
                                                opacity: '1', color: '#808080', cursor: 'pointer', marginRight: '10px', paddingLeft:'3%'}} >
                                                    {formik.values.items[currentAchievementIndex].achievementEvidence[idx].evidence!== null ? (
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
                                                id={`items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                name={`items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`}
                                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                onChange={
                                                    (event) => {
                                                        const file = event.target.files ? event.target.files[0] : null;

                                                        if (file) {
                                                          if (file.size < 2_097_152) {
                                                            formik.setFieldValue(`items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`, file);
  
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
  
                                                            } else {
                                                              formik.setFieldValue(`items[${currentAchievementIndex}].achievementEvidence[${idx}].evidence`, null);
  
                                                              setErrorFile(prevErrorFile => {
                                                                const newErrorFile = [...prevErrorFile];
                                                                if (!newErrorFile[currentAchievementIndex]) {
                                                                    newErrorFile[currentAchievementIndex] = [];
                                                                }
                                                                newErrorFile[currentAchievementIndex][idx] = `File size exceeds 2 MB`;
                                                                return newErrorFile;
                                                                }
                                                              );
                                                          }
                                                        }
                                                    }
                                                }
                                                style={{ minWidth: '80%' , display:'none'}}
                                                />
                                                {formik.values.items[currentAchievementIndex].achievementEvidence[idx] !== null ? addName(formik.values.items[currentAchievementIndex].achievementEvidence[idx]) : null}
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
                                    {idx === formik.values.items[currentAchievementIndex].achievementEvidence.length - 1 ? (
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
                                        onClick={() => {
                                          if (formik.values.items[currentAchievementIndex].achievementEvidence[idx].evidence) {
                                            const { evidence } = formik.values.items[currentAchievementIndex].achievementEvidence[idx];
                                            
                                            if (evidence && typeof evidence === "string") {
                                              try {
                                                const url = new URL(evidence);
                                                setErrorFile(prevErrorFile => {
                                                  const newErrorFile = [...prevErrorFile];
                                                  if (!newErrorFile[currentAchievementIndex]) {
                                                    newErrorFile[currentAchievementIndex] = [];
                                                  }
                                                  newErrorFile[currentAchievementIndex][idx] = ``;
                                                  return newErrorFile;
                                                });
                                                push({ id: generateId(), evidenceType: 'URL', evidence: null, isOld: false });
                                              } catch {
                                                setErrorFile(prevErrorFile => {
                                                  const newErrorFile = [...prevErrorFile];
                                                  if (!newErrorFile[currentAchievementIndex]) {
                                                    newErrorFile[currentAchievementIndex] = [];
                                                  }
                                                  newErrorFile[currentAchievementIndex][idx] = `Invalid URL`;
                                                  return newErrorFile;
                                                });
                                              }
                                            } else {
                                              setErrorFile(prevErrorFile => {
                                                const newErrorFile = [...prevErrorFile];
                                                if (!newErrorFile[currentAchievementIndex]) {
                                                  newErrorFile[currentAchievementIndex] = [];
                                                }
                                                newErrorFile[currentAchievementIndex][idx] = ``;
                                                return newErrorFile;
                                              });
                                              push({ id: generateId(), evidenceType: 'URL', evidence: null, isOld: false });
                                            }
                                          } else {
                                            setErrorFile(prevErrorFile => {
                                              const newErrorFile = [...prevErrorFile];
                                              if (!newErrorFile[currentAchievementIndex]) {
                                                newErrorFile[currentAchievementIndex] = [];
                                              }
                                              newErrorFile[currentAchievementIndex][idx] = `Evidence cannot be empty`;
                                              return newErrorFile;
                                            });
                                          }
                                          
                                        }}
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
                                            onClick={() => {
                                              remove(idx);
                                            }}
                                            sx={{
                                                minWidth: '12%',
                                                textAlign: 'center',
                                            }}
                                            >
                                            <Delete
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
                            <Button sx={{ background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)', color: 'white' , minWidth:'100px'}} onClick={handleCancelEvidence}>Cancel</Button>
                            <Button 
                            sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color: 'white', minWidth:'100px' }}
                            onClick={() => setOpenAchievementEvidence(false)}>Save</Button>
                        </Stack>
                    </DialogActions>
                </Dialog>
                </form>
                </FormikProvider>
            ) : (
              <Stack alignContent="center" alignItems="center">
                <Typography>
                  No Data Shown
                </Typography>
              </Stack>
            )
          )}

          <ModalAlertImport
            variant="failed"
            title="Failed to Import Excel"
            message={
              <>
                <Typography>
                  Please check the following issues before continue
                </Typography>
                <TableAjax
                  columns={columns}
                  data={pagedErrorTable}
                  pageSizeOptions={[10, 25, 50]}
                  rowCount={errorTable.length}
                  page={errorPage}
                  pageSize={errorPageSize}
                  onPageChange={setErrorPage}
                  onPageSizeChange={setErrorPageSize}
                  onSortChange={setSort}
                />
              </>
            }
            buttonTitle="Confirm"
            open={openErrorTable}
            onOk={() => setOpenErrorTable(false)}
            onClose={() => setOpenErrorTable(false)}
            boxWidth='40%'
          />

          <ModalAlertImport
            variant="failed"
            title="Failed"
            message={
              <>
                <Typography>
                  Please check the following issues
                </Typography>
                <TableAjax
                  columns={submitErrorColumns}
                  data={pagedErrorSubmit}
                  pageSizeOptions={[10, 25, 50]}
                  rowCount={submitError.length}
                  page={submitErrorPage}
                  pageSize={submitErrorPageSize}
                  onPageChange={setSubmitErrorPage}
                  onPageSizeChange={setSubmitErrorPageSize}
                  onSortChange={setSort}
                />
              </>
            }
            buttonTitle="Confirm"
            open={openSubmitError}
            onOk={() => {
              setOpenSubmitError(false)
              setSubmitError([])
            }}
            onClose={() => {
              setOpenSubmitError(false)
              setSubmitError([])
            }}
            boxWidth='40%'
          />
        </PageWrapper>
      );
}