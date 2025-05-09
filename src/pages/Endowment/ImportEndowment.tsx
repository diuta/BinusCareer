import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
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
  Typography,
} from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { addDays, format, isValid, parse } from 'date-fns';
import { FastField, FieldArray, FormikErrors, FormikProvider, useFormik } from 'formik';
import { useCallback,useEffect, useMemo, useRef, useState } from 'react';
import { RiFileExcel2Fill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import TableAjax from '../../components/common/table_ajax/TableAjax';
import NumberPagination from '../../components/common/table_pagination/NumberPagination';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';
import { selectProfile } from '../../store/profile/selector';
import { ModalAlertImport } from './components/ModalAlertImport';
import TableRowComponent from './components/TableComponentImport';
import { TrMappingCampusProgram } from './Interface/IEndowmentMaster';
import { AddEndowmentDataType, EndowmentCategoryDataType, ErrorDataType, ImportType } from './Interface/IImportEndowment';

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

function isValidDate(stringDate) {
  const regex = /^([0-2]\d|3[01])-(0\d|1[0-2])-\d{4}$/;
  return regex.test(stringDate);
}

function convertToUTCWithoutChangingDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);

  const dateSent = new Date(year, month - 1, day);

  const localOffset = dateSent.getTimezoneOffset() * 60_000;

  const utcDate = new Date(dateSent.getTime() - localOffset);

  return utcDate;
}

const handleTemplate = (setIsTemplateLoading: (loading: boolean) => void) => {
  setIsTemplateLoading(true);
  apiClient.get(ApiService.endowmentTemplate,{
    responseType:'blob',
  })
  .then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EndowmentImportTemplate.xlsx`);
    document.body.append(link);
    link.click();
    setIsTemplateLoading(false);
  })
};

export function ImportEndowment() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [files, setFiles] = useState<FileList | null>(null);
  const [excelData, setExcelData] = useState<ImportType[]>([]);
  const [originalData, setOriginalData] = useState<ImportType[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [mappingCampus, setMappingCampus] = useState<TrMappingCampusProgram[]>([]);
  const [category, setCategory] = useState<EndowmentCategoryDataType[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listError, setListError] = useState<ErrorDataType[]>([]);
  const [sort, setSort] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [errorPage, setErrorPage] = useState<number>(0);
  const [errorPageSize, setErrorPageSize] = useState<number>(10);
  const [errorRowCount, setErrorRowCount] = useState(0);
  const [errors, setErrors] = useState<{ nim?: string, rowNumber: number, errorMessage: string }[]>([]);
  const [errorFormat, setErrorFormat] = useState(false);
  const expectedHeaders = ["NIM", "Period (dd-mm-yyyy)", "Date (dd-mm-yyyy)", "Unit Name", "Category", "Debit", "Kredit", "Activity", "Description"];
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    setFiles(droppedFiles);
    handleFile(droppedFiles[0]);
  };

  const renderErrorMessages = (errorData: ErrorDataType) => {
    const errorMessages = errorData.errorMessage.split(";");
    return (
      <div>
        {errorMessages.map((msg, index) => (
          <span key={`${errorData.rowNumber}-${msg.trim()}`}>
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

  const columns = useMemo<ColumnDef<ErrorDataType>[]>(
    () => [
      {
        accessorKey: 'nim',
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
        },
      }
    ],
    []
  );

  type AlumniDetailType = {
    "NIM": string
  };

  const getErrorImport = useCallback(
    async (Page: number, PageSize:number, tempError:{ nim?: string, rowNumber: number, errorMessage: string }[]) => {
        apiClient.post(`${ApiService.endowment}/importError?page=${Page+1}&pageSize=${PageSize}`, tempError)
        .then(resp=>resp)
        .then(resp=>{
          setListError(resp.data.data);
          setErrorRowCount(resp.data.rowCount);
        });
    },[]
  );

  useEffect(() => {
    if (errors.length > 0) {
      getErrorImport(errorPage, errorPageSize, errors);
    }
  }, [errorPage, errorPageSize, errors, getErrorImport]);

  const handleFile = (file: File) => {
    setIsFileLoading(true);
    setError(false);
    setListError([]);
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
      const arrayBuffer = (event.target as FileReader).result as ArrayBuffer;
      if (arrayBuffer) {
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = parsedData[0] as string[];
        let tempNIM: { NIM: string }[] = [];
        const tempErrors: { nim?: string, rowNumber: number, errorMessage: string }[] = [];
        const listNim = parsedData.slice(1).map((row:any[], rowIndex: number) => {
          const tempId = row[0];
          tempNIM.push({
            "NIM": `${tempId}`,
          });
        });
        const queryString = tempNIM
        .map((item, index) => `data[${index}].NIM=${item.NIM}`)
        .join('&');
        const fetchData = async () => {
          const resp = await apiClient.post(`${ApiService.endowment}/alumni-detail`, tempNIM);
          return resp.data
        }
        try{
          const headersMismatch = !expectedHeaders.every((header, index) => header === headers[index]);
          const dataAlumni = await fetchData();
          const rows = parsedData.slice(1).map((row: any[], rowIndex: number) => {
            const requiredFields = [row[0], row[1], row[2], row[4], row[7], row[8]];
            const tempFilter = dataAlumni.find((item) => item.alumniNim == row[0]);
            const rowErrors: string[] = [];
            const {
              alumniName: name = '',
              campusName: campus = '',
              facultyName: faculty = '',
              programName: program = '',
              degreeName: degree = ''
            } = tempFilter ?? {};
            if(program !== '-'){
              requiredFields.push(row[3]);
            }
            const emptyFieldIndex = requiredFields.findIndex(field => field === undefined || field === null || field === "");
            const period: string | null = null;
            const date: string | null = null;
            if(!isValidDate(row[1]) || !isValidDate(row[2])){
              rowErrors.push("Invalid Data Format");
            }
            const rowData: ImportType = {
              id: rowIndex,
              nim: row[0],
              name,
              campus,
              faculty,
              program,
              degree,
              period: row[1],
              date: row[2],
              unitName: row[3],
              category: row[4],
              debit: row[5],
              kredit: row[6],
              activity: row[7],
              description: row[8]
            };
            const isRow5Filled = row[5] !== undefined && row[5] !== null && row[5] !== "";
            const isRow6Filled = row[6] !== undefined && row[6] !== null && row[6] !== "";
            if(headersMismatch){
              setErrorFormat(true);
              throw new Error('error');
            }
            if ((!isRow5Filled && !isRow6Filled) || (emptyFieldIndex !== -1 || !row[1] || !row[2])) {
              rowErrors.push("Empty Data Detected");
            }
            if(isRow5Filled && isNaN(row[5])){
              rowErrors.push("Invalid Data Format");
            }
            if(isRow6Filled && isNaN(row[6])){
              rowErrors.push("Invalid Data Format");
            }
            if(!tempFilter){
              rowErrors.push("NIM Not Found");
            }
            else if((!campus || !faculty|| !program)){
              rowErrors.push("Alumni Program Not Found");
            }
            if (rowErrors.length > 0) {
              tempErrors.push({
                nim: String(row[0]),
                rowNumber: rowIndex + 2,
                errorMessage: rowErrors.join('; ')
              });
            }
            return rowData;
          });
          if(tempErrors.length > 0){
            setErrors(tempErrors);
            setError(true);
            throw new Error('error');
          }

          setExcelData(rows);
          setOriginalData(rows);
          tempNIM = [];
          setIsFileLoading(false);
        }
        catch{
          setIsFileLoading(false);
        }
      }
    });
    reader.readAsArrayBuffer(file);
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

  const handleApply = () => {
    if(error){
      setOpenDialog(true);
    }
    else if(errorFormat){
      showModal({
        title:"The Excel Format is Invalid",
        message:"Please use provided import template",
        options: {
          variant: 'failed',
          onOk:() => setErrorFormat(false),
          onClose:() => setErrorFormat(false),
        },
      });
    }
    else if(showTable){
      setExcelData(originalData);
      setPageIndex(0);
      setRowCount(originalData.length);
      setPageCount(Math.ceil(originalData.length / pageSize));
      formik.resetForm({
        values: { items: originalData }
      });
    }
    else{
      setShowTable(true);
      setRowCount(excelData.length);
      setPageCount(Math.ceil(excelData.length / pageSize));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      if(selectedFiles[0].type === "text/csv" || selectedFiles[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
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
            onOk:() => setIsLoading(false),
            onClose:() => setIsLoading(false),
          },
        });
      }
    }
  };

  const userProfile = useSelector(selectProfile);

  const { binusianId, currentRole, rolePermissions } = userProfile;
  const handleDeleteRow = (index: number) => {
    setExcelData((prevoriginalData) => {
      const updatedData = prevoriginalData.filter((_, rowIndex) => rowIndex !== index);
      formik.setFieldValue('excelData', updatedData);
      setRowCount(updatedData.length);
      setPageCount(Math.ceil(updatedData.length / pageSize));
      return updatedData;
    });
  };

  const uniqueUnit = [...new Set(mappingCampus.map(item => JSON.stringify({value: item.mappingCampusProgramId, label: `(${item.mappingCampusProgramId}) - ${item.campusName} - ${item.facultyName} - ${item.programName}`})))]
  .map(item => JSON.parse(item));
  const uniqueEndowmentCategory = [...new Set(category.map(item => JSON.stringify({ value: item.endowmentCategoryId, label: item.endowmentCategoryName })))]
  .map(item => JSON.parse(item));


  useEffect(() => {
    apiClient.get(`${ApiService.endowment}/mappingcampus`)
    .then(resp=>resp)
    .then(resp=>{
        setMappingCampus(resp.data);
    });
    apiClient.get(`${ApiService.endowmentCategory}`)
    .then(resp=>resp)
    .then(resp=>{
        setCategory(resp.data);
    });
  },[]);

  const validate = (values: { items: ImportType[] }) => {
    const validateError: { items: FormikErrors<ImportType>[] } = { items: [] };
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    values.items.forEach((item, index) => {
      const itemErrors: FormikErrors<ImportType> = {};

      if (!item.nim) {
        itemErrors.nim = "NIM is Required";
      }

      if (!item.name) {
        itemErrors.name = "Alumni not Found";
        itemErrors.campus = "Alumni not Found";
        itemErrors.faculty = "Alumni not Found";
        itemErrors.program = "Alumni not Found";
        itemErrors.degree = "Alumni not Found";
      }

      if((!item.campus || !item.faculty || !item.program) && item.name){
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

      if (item.program !== "-" && !item.unitName) {
        itemErrors.unitName = "Unit Name is Required";
      }

      if (!item.category) {
        itemErrors.category = "Category is Required";
      }

      if ((item.debit === "" || item.debit == null) && (item.kredit === "" || item.kredit == null)) {
        itemErrors.debit = "At least Debit or Kredit must be filled";
        itemErrors.kredit = "At least Debit or Kredit must be filled";
      }

      if(item.debit && isNaN(Number(item.debit))){
        itemErrors.debit = "Invalid Debit format";
      }

      if(item.kredit && isNaN(Number(item.kredit))){
        itemErrors.kredit = "Invalid Kredit format";
      }

      if(!item.activity){
        itemErrors.activity = "Activity is Required";
      }

      if(!item.description){
        itemErrors.description = "Description is Required";
      }

      if (Object.keys(itemErrors).length > 0) {
        validateError.items[index] = itemErrors;
      }
    });

    return validateError.items.length > 0 ? validateError : {};
  };

  const mapExcelDataToDropDown = (tempExcelData) => tempExcelData.map((row) => {
    const matchedUnit = uniqueUnit.find((unit) => unit.label === row.unitName);
    const matchedCategory = uniqueEndowmentCategory.find((cat) => cat.label === row.category);

    return {
      ...row,
      unitName: matchedUnit ? matchedUnit.value : '',
      category: matchedCategory ? matchedCategory.value : '',
    };
  });


  const formik = useFormik({
    initialValues: { items: excelData },
    enableReinitialize: true,
    validateOnChange: true,
    validate,
    onSubmit: async (values) => {
      setIsLoading(true);
      setOriginalData(values.items);
      const tempAddDTO: AddEndowmentDataType[] = [];
      const tempValues = mapExcelDataToDropDown(values.items);
      tempValues.forEach(x => {
        tempAddDTO.push({
          alumniId: String(x.nim),
          unitId: x.unitName == "" ? null : x.unitName,
          endowmentCategoryId: Number(x.category),
          parentId: null,
          period: convertToUTCWithoutChangingDate(x.period),
          date: convertToUTCWithoutChangingDate(x.date),
          debit: x.debit === undefined || x.debit === '' ? null : Number(x.debit),
          kredit: x.kredit === undefined || x.kredit === '' ? null : Number(x.kredit),
          activity: x.activity,
          description: x.description,
          proposalStatusId: 1,
          reason: '',
          dateIn: new Date(),
          userIn: binusianId,
          dateUp: new Date(),
          userUp: binusianId
        })
      });
      apiClient.post(`${ApiService.endowment}/import-endowment?currentRole=${currentRole}`, JSON.stringify(tempAddDTO))
      .then(resp => resp)
      .then(resp => {
        if(resp.status === 200){
          showModal({
            title: 'Success',
            message:
              'Request Data Added Successfully',
            options: {
              variant: 'success',
              onOk:() => {
                setIsLoading(false);
                navigate('/endowment/approval')
              },
              onClose:() => {
                setIsLoading(false);
                navigate('/endowment/approval')
              }
            },
          });
        }
      })
      .catch(error_ => {
        showModal({
          title: 'Failed',
          message:
            'Request Data Add Failed',
          options: {
            variant: 'failed',
            onOk:() => setIsLoading(false),
            onClose:() => setIsLoading(false),
          },
        });
      });
    },
  });

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    setPageCount(Math.ceil(excelData.length / newSize));
    setPageIndex(0);
  };

  const paginatedItems = useMemo(() => formik.values.items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), [formik.values.items, pageIndex, pageSize]);

  useEffect(() => {
    if(!(rolePermissions.some(item => item.permissionName === 'add-endowment'))){
      showModal({
        title: 'Failed',
        message:
            'You Do Not Have Permission To Add Endowment',
        options: {
            variant: 'failed',
            onOk: () => {
                navigate('/endowment/view')
            },
            onClose() {
                navigate('/endowment/view')
            },
        },
      });
    }
  }, []);

  return (
    <PageWrapper>
      <Stack direction='row' justifyContent='flex-end'>
        <CustomLoadingButton
          variant="contained"
          color='success'
          sx={{ width: '22%' }}
          size='medium'
          startIcon={<RiFileExcel2Fill size='25px' />}
          loading={isTemplateLoading}
          onClick={() => handleTemplate(setIsTemplateLoading)}
        >
          <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>
            DOWNLOAD TEMPLATE
          </Typography>
        </CustomLoadingButton>
      </Stack>
      <Stack>
        <Typography sx={{fontSize:'12px', fontWeight:400}}>Import Excel</Typography>
      </Stack>
      <Stack sx={{marginTop:'5px'}}>
        <Typography color="red" sx={{fontSize:'10px', fontWeight:400}}>Ensure you fill in the green columns in the Excel template according to the options on the master list</Typography>
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
                  <Typography sx={{fontSize:'14px', fontWeight:400, color:'#999999'}}>Drag and Drop File Here</Typography>
                </div>
                )}
              </label>
            </>
          ): (
            <Box sx={{ marginTop: '20px', textAlign: 'center', width: '100%', paddingBottom:'20px' }}>
              <Typography sx={{fontSize:'12px', fontWeight:400}}>Selected Files:</Typography>
              {[...files].map((file, idx) => (
                <Typography key={file.name} sx={{fontSize:'12px', fontWeight:400}}>{file.name}</Typography>
              ))}
              <Button variant="outlined" onClick={handleClearFiles} sx={{ marginTop: '10px', width:'15%' }} size='large'>
                <Typography sx={{fontSize:'13px', fontWeight:400}}>Clear Files</Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Stack>
        <Stack direction='row' justifyContent='flex-end' sx={{ width: '100%', paddingTop: '20px' }}>
          <CustomLoadingButton
            variant="contained"
            color='primary'
            sx={{ width: '10%' }}
            size='medium'
            loading={isFileLoading}
            onClick={handleApply}
          >
            <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Apply</Typography>
          </CustomLoadingButton>
        </Stack>
        <Divider sx={{ marginY: '20px' }} />
        {showTable && (
          rowCount > 0 ? (
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ marginTop: '20px', backgroundColor:'white' }}>
                  <TableContainer sx={{maxHeight: 800, overflowY: 'auto',backgroundColor: 'white'}}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>NIM</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Name</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Campus</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Faculty</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Program</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Degree</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Period</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Date</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Unit Name</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Category</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Debit</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Kredit</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Activity</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Description</Typography></TableCell>
                          <TableCell><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Actions</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <FieldArray name="items">
                          {({ remove }) => (
                            paginatedItems.map((row, rowIndex) => {
                              const globalIndex = pageIndex * pageSize + rowIndex;
                              return(
                                <TableRow key={row.id}>
                                  {Object.keys(row).filter(key => key !== 'id').map((key) => (
                                    <TableCell key={key}>
                                      <FastField name={`items[${globalIndex}].${key}`}>
                                        {({field}) => (
                                          <TableRowComponent
                                            rowName={key}
                                            index={globalIndex}
                                            formik={formik}
                                            uniqueEndowmentCategory={uniqueEndowmentCategory}
                                            uniqueUnit={uniqueUnit}
                                          />
                                        )}
                                      </FastField>
                                    </TableCell>
                                  ))}
                                  <TableCell>
                                    <IconButton color="secondary" onClick={() => handleDeleteRow(rowIndex)}>
                                      <Delete color="primary" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          )}
                        </FieldArray>
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
                      sx={{ width: '100px' }}
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
                      sx={{ width: '100px' }}
                      size='medium'
                      type="submit"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Save</Typography>
                    </CustomLoadingButton>
                  </Box>
                </Stack>
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
                data={listError}
                pageSizeOptions={[10, 25, 50]}
                rowCount={errorRowCount}
                page={errorPage}
                pageSize={errorPageSize}
                onPageChange={setErrorPage}
                onPageSizeChange={setErrorPageSize}
                onSortChange={setSort}
              />
            </>
          }
          buttonTitle="Confirm"
          open={openDialog}
          onOk={() => setOpenDialog(false)}
          onClose={() => setOpenDialog(false)}
          boxWidth='40%'
        />
    </PageWrapper>
  );
};