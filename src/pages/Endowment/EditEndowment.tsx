import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Column, ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowData, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FormikErrors, useFormik } from 'formik';
import { useEffect, useRef,useState,  } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import Datepicker from "../../components/common/Datepicker"
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';
import { selectProfile } from '../../store/profile/selector';
import { layoutPrivateStyle } from '../../styles/layout/private-routes';
import { AlumniDetailDataType } from './Interface/IAlumni';
import { IFormValues, ViewEditDataType } from './Interface/IEditEndowment';
import { EndowmentCategory,  TrMappingCampusProgram } from './Interface/IEndowmentMaster';

type AlumniDetailType = {
    "NIM": string
};

function GetMhs({nim}){
    const [alumniDetail, setAlumniDetail] = useState<AlumniDetailDataType[]>([]);

    const tempNIM: AlumniDetailType[] = [];
    tempNIM.push({
        "NIM": nim
    });

    const queryString = tempNIM
    .map((item, index) => `data[${index}].NIM=${item.NIM}`)
    .join('&');

    useEffect(() => {
        apiClient.post(`${ApiService.endowment}/alumni-detail`, tempNIM)
        .then(resp=>resp)
        .then(resp=>{
            const filtered = resp.data;
            setAlumniDetail(filtered);
        })
    },[]);
    
    return(
        <div>
            <Stack  direction='column' gap='10px' sx={{width: '100%'}}>
                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>NIM</Typography>
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Name</Typography>
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Campus</Typography>
                    </Box>
                </Stack>
                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail[0]?.alumniNim}</Typography>
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail[0]?.alumniName}</Typography>
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail[0]?.campusName}</Typography>
                    </Box>
                </Stack>
                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                    <Box sx={{flex:1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Faculty</Typography>
                    </Box>
                    <Box sx={{flex:1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Program</Typography>
                    </Box>
                    <Box sx={{flex:1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Degree</Typography>
                    </Box>
                </Stack>
                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail[0]?.facultyName}</Typography>
                    </Box>
                    <Box sx={{flex:1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail[0]?.programName}</Typography>
                    </Box>
                    <Box sx={{flex:1}}>
                        <Typography sx={{textAlign:'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail[0]?.degreeName}</Typography>
                    </Box>
                </Stack>
            </Stack>
        </div>
    );
}

const formatNumber = (input) => {
    const valueString = input?.toString().trim();
    if (valueString === '' || !valueString) {
        return '';
    }

    if (/^0+$/.test(valueString)) {
        return '0';
    }

    const cleanedValue = valueString.replace(/^0+/, '').replace(/[\s,.]/g, '');

    const [integerPart, decimalPart] = cleanedValue.split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
};

const parseNumber = (formattedString) => {
    const valueString = formattedString.trim();

    if (valueString === '') {
        return '';
    }

    const cleanedValue = valueString.replace(/\./g, '');
    return /^0+$/.test(cleanedValue) ? '0' : cleanedValue.replace(/^0+/, '');
};

declare module '@tanstack/react-table' {
    interface ColumnMetas<TData extends RowData, TValue> {
      filterVariant?: 'text' | 'range' | 'select'
    }
  }

  function IndeterminateCheckbox({
    indeterminate,
    className = "",
    ...rest
  }: { indeterminate?: boolean } & React.ComponentPropsWithoutRef<
    typeof Checkbox
  >) {
    const ref = useRef<HTMLInputElement>(null!);
  
    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [indeterminate, rest.checked]);
  
    return <Checkbox sx={{ padding: 0 }} inputRef={ref} {...rest} />;
  }

  const columns: ColumnDef<TrMappingCampusProgram>[] = [
    {
        id: 'select',
        cell: ({ row, table }) => (
          <Stack className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: () => {
                  table.resetRowSelection();
                  row.toggleSelected();
                },
              }}
            />
          </Stack>
        ),
      },
    {
      accessorKey: "campusName",
      header: "Campus",
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "facultyName",
      header: "Faculty",
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "programName",
      header: "Program",
      meta: {
        filterVariant: "text",
      },
    },
  ];

  function Filter({
    column,
    table,
  }: {
    column: Column<any, unknown>;
    table: any;
  }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};
  
    const filteredRows = table.getFilteredRowModel().rows;
    const uniqueValues = new Set<string>();
  
    filteredRows.forEach((row: any) => {
      const value = row.original[column.id];
      if (value !== undefined) {
        uniqueValues.add(value);
      }
    });
  
    const sortedUniqueValues = [...uniqueValues].sort().slice(0, 5000);
  
    return filterVariant === "select" ? (
      <Stack>
        <Select
          value={columnFilterValue?.toString() || ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {sortedUniqueValues.map((value) => (
            <MenuItem value={value} key={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    ) : filterVariant === "text" ? (
      <TextField
        value={columnFilterValue ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search ${column.columnDef.header}`}
        size="small"
      />
    ) : null;
  }

export function EditEndowment() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const { id } = useParams();
    const [tempData, setTempData] = useState<ViewEditDataType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mappingCampus, setMappingCampus] = useState<TrMappingCampusProgram[]>([]);
    const [category, setCategory] = useState<EndowmentCategory[]>([]);
    const [proposalStatus, setProposalStatus] = useState();
    const fieldsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex: 0, 
		pageSize: 5, 
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [alumni, setAlumni] = useState({
        alumniNIM: '',
        alumniName: '',
        campusName: '',
        facultyName: '',
        programName: '',
        degreeName: ''
    });

    const callId = parseInt(id || '', 10) || 0;
    const [submitNIM, setSubmitNIM] = useState('');
    const tempNIM: AlumniDetailType[] = [];
    tempNIM.push({
        "NIM": submitNIM
    });
    const queryString = `data[0].NIM=${submitNIM}`;


    const handleGetNim = () => {
        apiClient.post(`${ApiService.endowment}/alumni-detail`, tempNIM)
        .then(resp=>resp)
        .then(resp=>{
            if(resp.data.length > 0){
                setAlumni({
                    alumniNIM: resp.data[0].alumniId,
                    alumniName: resp.data[0].alumniName,
                    campusName: resp.data[0].campusName,
                    facultyName: resp.data[0].facultyName,
                    programName: resp.data[0].programName,
                    degreeName: resp.data[0].degreeName
                })
            };
        });
    };

    useEffect(() => {
        handleGetNim();
    }, [submitNIM]);

    

    const table = useReactTable({
        data: mappingCampus,
        columns,
        filterFns: {
          select: (rows, ids, filterValue) => true,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination, rowSelection, columnFilters },
        getSortedRowModel: getSortedRowModel(),
        getRowId: (row) => row.mappingCampusProgramId,
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFacetedUniqueValues: getFacetedUniqueValues(),
      });
    const totalRows = table.getPrePaginationRowModel().rows.length;

    useEffect(() => {
        const selectedIds = Object.keys(table.getSelectedRowModel().rowsById).map(String);
        const selectedId = selectedIds.length > 0 ? selectedIds[0] : null;
        formik.setFieldValue('unitId', selectedId); 
    
    }, [table.getState().rowSelection]);
    
    const uniqueEndowmentCategory = [...new Set(category.map(item => JSON.stringify({ EndowmentCategoryId: item.endowmentCategoryId, EndowmentCategoryName: item.endowmentCategoryName })))]
    .map(item => JSON.parse(item));

    const userProfile = useSelector(selectProfile);

    const { binusianId, currentRole, rolePermissions } = userProfile;

    let tempPeriod = new Date();
    let tempDate = new Date();

    const [initialValues, setInitialValues] = useState({
        "endowmentId": callId,
        "alumniId": 0,
        "unitId": null,
        "endowmentCategoryId": null,
        "parentId": 0,
        "period": '',
        "date": '',
        "debit": 0,
        "kredit": 0,
        "activity": null,
        "description": null,
        "proposalStatusId": 2,
        "reason": null,
        "dateIn": new Date(),
        "userIn": binusianId,
        "dateUp": new Date(),
        "userUp": binusianId,
    });

    const validate = (values: IFormValues ) => {
        const validateError: FormikErrors<IFormValues> = {};
          if (!values.period) {
            validateError.period = "Period is Required";
          }
      
          if (!values.date) {
            validateError.date = "Date is Required";
          }
          
          if (alumni.programName != "-" && !values.unitId) {
            validateError.unitId = "Unit Name is Required";
          }
      
          if (!values.endowmentCategoryId) {
            validateError.endowmentCategoryId = "Category is Required";
          }
      
          if ((values.debit === "" || values.debit == null) && (values.kredit === "" || values.kredit == null)) {
            validateError.debit = "At least Debit or Kredit must be filled";
            validateError.kredit = "At least Debit or Kredit must be filled";
          }
          if(values.debit && isNaN(Number(values.debit))){
            validateError.debit = "Invalid Debit format";
          }
          if(values.kredit && isNaN(Number(values.kredit))){
            validateError.kredit = "Invalid Kredit format";
          }
          
          if(!values.activity){
            validateError.activity = "Activity is Required";
          }
  
          if(!values.description){
            validateError.description = "Description is Required";
          }

          if(!values.reason){
            validateError.reason = "Reason is Required";
          }

          return validateError;
    };
    


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

    useEffect(() => {
        apiClient.get(`${ApiService.endowment}?id=${id}`)
        .then(resp=>resp)
        .then(resp=>{
            const temp = resp.data.find(item => item.endowmentId === callId);
            setSubmitNIM(temp.alumniId);
        })
    }, [callId]);

    function formatDateToDDMMYYYY(isoString) {
        const date = new Date(isoString);
    
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    }
    

    const [parent, setParent] = useState(callId);
    useEffect(() => {
        apiClient.get(`${ApiService.endowment}/edit?id=${id}`)
        .then(resp=>resp)
        .then(resp=>{
            tempPeriod = resp.data[0].period;
            tempDate = resp.data[0].date;
            setProposalStatus(resp.data[0].proposalStatusId);
            if(resp.data[0].proposalStatusId != 4){
                showModal({
                    title: 'Failed',
                    message:
                        'This data is waiting for approval and cannot be edited until approved',
                    options: {
                        variant: 'failed',
                        onOk:() => {
                            navigate('/endowment/view');
                        },
                        onClose:() => {
                            navigate('/endowment/view');
                        }
                    },
                });
            }
            if(resp.data[0].parentId != null){
                setParent(resp.data[0].parentId);
            }else{
                setParent(callId);
            }
            setInitialValues({
                "endowmentId": callId,
                "alumniId": resp.data[0].alumniId,
                "unitId": resp.data[0].unitId,
                "endowmentCategoryId": resp.data[0].endowmentCategoryId,
                "parentId": parent,
                "period": formatDateToDDMMYYYY(resp.data[0].period),
                "date": formatDateToDDMMYYYY(resp.data[0].date),
                "debit": resp.data[0].debit,
                "kredit": resp.data[0] ? resp.data[0].kredit : null,
                "activity": resp.data[0].activity,
                "description": resp.data[0].description,
                "proposalStatusId": 2,
                "reason": null,
                "dateIn": new Date(),
                "userIn": binusianId,
                "dateUp": new Date(),
                "userUp": binusianId
            });

            if(fieldsRef.current.activity){
                fieldsRef.current.activity.value = resp.data[0].activity;
            }
            if(fieldsRef.current.description){
                fieldsRef.current.description.value = resp.data[0].description ;
            }
            if(fieldsRef.current.debit){
                fieldsRef.current.debit.value = formatNumber(resp.data[0].debit);
            }
            if(fieldsRef.current.kredit){
                fieldsRef.current.kredit.value = formatNumber(resp.data[0].kredit);
            }
            setRowSelection({
                [resp.data[0].unitId] : true
            });
            formik.setFieldValue('period', formatDateToDDMMYYYY(resp.data[0].period));
            formik.setFieldValue('date', formatDateToDDMMYYYY(resp.data[0].date));
        });
    },[callId, id, parent])


    useEffect(() => {
        apiClient.get(`${ApiService.endowment}/parent?id=${id}`)
        .then(resp=>resp)
        .then(resp=>{
            setTempData(resp.data);
        });
    }, []);

    const getLastActivity = (tempId: number) =>{
        const initialRecord = tempData.find(item => item.endowmentId == tempId);
        if(!initialRecord){
            return [];
        }
        const relatedRecords = tempData.filter(item => item.endowmentId == initialRecord.parentId || item.endowmentId == initialRecord.endowmentId);
        const activities = tempData.map(record => {
            if(record.parentId == null){
                return `Added by ${record.userIn} - ${format(record.dateIn, 'dd MMMM yyyy. HH:mm')}`
            }
            if(record.parentId != null){
                return `Edited by ${record.userIn} - ${format(record.dateIn, 'dd MMMM yyyy. HH:mm')}`
            }
            return null
        }).filter(Boolean);

        return activities;
    };

    const handlePeriodChange = (periods) => {
        if (typeof periods === 'string') {
            const [day, month, year] = periods.split('-');
            const dateObject = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            return dateObject;
          }
          if (periods instanceof Date) {
            return periods;
          }
          return null;
    };

    const handleDateChange = (date) => {
        if (typeof date === 'string') {
          const [day, month, year] = date.split('-');
          const dateObject = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
          return dateObject;
        }
        if (date instanceof Date) {
          return date;
        }
        return null;
      };
    
    const [changed, setChanged] = useState({});

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validate,
        validateOnChange:true,
        onSubmit: (values) => {
            setIsLoading(true);
            for(const key in values){
                if(values[key] !== formik.initialValues[key]){
                    changed[key] = values[key];
                }
            }

            const formattedPeriod = handlePeriodChange(values.period);
            const formattedDate = handleDateChange(values.date);


            const data = {
                ...formik.values,
                ...changed,
                period: formattedPeriod,
                date: formattedDate,
                parentId: parent,
                dateUp: new Date(),
                userUp: binusianId
            }
        
            apiClient.post(`${ApiService.endowment}/update?currentRole=${currentRole}`, JSON.stringify(data))
            .then(resp => resp)
            .then(resp => {
                if(resp.status === 200){
                    showModal({
                    title: 'Success',
                    message:
                        'Request Data Edited Successfully',
                    options: {
                        variant: 'success',
                        onOk:() => {
                            setIsLoading(false);
                            navigate('/endowment/approval');
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
                        'Data Edit Failed',
                    options: {
                        variant: 'failed',
                        onOk:() => {
                            setIsLoading(false);
                        },
                        onClose:() => {
                            setIsLoading(false);
                        }
                    },
                });
            });
        },
    });

    useEffect(() => {
        formik.setFieldValue('date', formatDateToDDMMYYYY(tempDate));
        formik.setFieldValue('period',formatDateToDDMMYYYY(tempPeriod));
    }, []);

    useEffect(() => {
        if(!(rolePermissions.some(item => item.permissionName === 'edit-endowment'))){
            showModal({
                title: 'Failed',
                message:
                    'You Do Not Have Permission To Edit Endowment',
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

    const debounce = useDebouncedCallback((field, value) => {
        formik.setFieldTouched(field,true)
        formik.setFieldValue(field, value);
      }, 250);
    
    const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      const { name, value } = e.target;
      if (name == 'debit' && fieldsRef.current.debit) {
        fieldsRef.current.debit.value = formatNumber(value);
      }
      else if(name == 'kredit' && fieldsRef.current.kredit){
          fieldsRef.current.kredit.value = formatNumber(value);
      }
      debounce(name, (name == 'debit' ||  name == 'kredit') ? parseNumber(value) : value);
    };

    return(
        <PageWrapper>
                {submitNIM && <GetMhs nim={submitNIM} />}
            <Divider sx={{marginY: "20px"}}/>
            <form onSubmit={formik.handleSubmit}>
                <Stack  direction='column' gap='15px' sx={{width: '100%'}}>
                    <Stack direction='row' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Period</Typography>
                        </Box>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Date</Typography>
                        </Box>
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Stack sx={{width:'100%'}}>
                            <Datepicker 
                                dateFormat="dd-MM-yyyy"
                                value={formik.values.period}
                                id='period'
                                name='period'
                                onChange={(periods) => {
                                    formik.setFieldValue('period', periods);
                                }}
                                autoClose
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
                                }}
                                >
                                    {typeof formik.errors.period === 'string' ? formik.errors.period : ''}
                                </Typography>
                            )}
                        </Stack>
                        <Stack sx={{width: '100%'}}>
                            <Datepicker 
                                dateFormat="dd-MM-yyyy"
                                value={formik.values.date}
                                id='date'
                                name='date'
                                onChange={(dates) => {
                                    formik.setFieldValue('date', dates);
                                }}
                                autoClose
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
                                }}
                                >
                                    {typeof formik.errors.date === 'string' ? formik.errors.date : ''}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Unit Name</Typography>
                        </Box>
                    </Stack>
                    <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCCCCC' }}>
                            <TableContainer sx={{ minHeight: "400px" }}>
                                <Table>
                                    <TableHead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableCell key={header.id}>
                                            <Stack
                                                onClick={header.column.getToggleSortingHandler()}
                                                style={{ cursor: "pointer", fontWeight: "bold", fontSize:'12px' }}
                                            >
                                                {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                                )}
                                                {{
                                                asc: " 🔼",
                                                desc: " 🔽",
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </Stack>
                                            {header.column.getCanFilter() && (
                                                <Stack>
                                                <Filter column={header.column} table={table} />
                                                </Stack>
                                            )}
                                            </TableCell>
                                        ))}
                                        </TableRow>
                                    ))}
                                    </TableHead>
                                    <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} sx={{fontSize:'12px'}}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                            </TableCell>
                                        ))}
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Stack direction='row' gap='20px' justifyContent='space-between' width="100%" sx={{ padding: 2 }}>
                                <Stack>
                                    <Typography sx={{marginY: 'auto', fontSize:'12px'}}>{table.getSelectedRowModel().rows.length} Rows Selected</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='center' gap='20px'>
                                    <Typography sx={{marginY: 'auto', fontSize:'12px'}}>{totalRows} Results</Typography>
                                    <Stack direction='row' sx={{marginY: 'auto'}} gap='10px'>
                                        <Typography sx={{marginY: 'auto', fontSize:'12px'}}>Show:</Typography>
                                        <Select
                                            value={pagination.pageSize}
                                            onChange={(e) => table.setPageSize(Number(e.target.value))}
                                            sx={{ width: 70, ' .binus-InputBase-input': { padding: '7px 10px 6px 8px !important'},  }}
                                        >
                                            <MenuItem value={5}><Typography sx={{fontSize:'12px'}}>5</Typography></MenuItem>
                                            <MenuItem value={10}><Typography sx={{fontSize:'12px'}}>10</Typography></MenuItem>
                                            <MenuItem value={50}><Typography sx={{fontSize:'12px'}}>50</Typography></MenuItem>
                                        </Select>
                                    </Stack>
                                    <Pagination
                                        count={table.getPageCount()}
                                        onChange={(_, page) => table.setPageIndex(page-1)}
                                        color="primary"
                                        size='small'
                                        sx={{marginY: 'auto', fontSize:'12px'}}
                                    />
                                    <Stack direction='row' sx={{ marginY: 'auto' }} gap='10px'>
                                        <Typography sx={{ marginY: 'auto', fontSize:'12px' }}>Jump to:</Typography>
                                        <Select
                                            value={pagination.pageIndex}
                                            onChange={(e) => table.setPageIndex(Number(e.target.value))}
                                            sx={{ width: 70, ' .binus-InputBase-input': { padding: '7px 10px 6px 8px !important'}, fontSize:'12px'  }}
                                            SelectDisplayProps={{ style: { fontSize: 12 } }}
                                        >
                                            {Array.from({ length: table.getPageCount() }, (_, i) => (
                                                <MenuItem key={i} value={i} sx={{fontSize:'12px'}}>
                                                    {i + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                     <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Category</Typography>
                        </Box>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Debit</Typography>
                        </Box>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Kredit</Typography>
                        </Box>
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <Select
                                label="endowmentCategory"
                                id="endowmentCategory"
                                value={formik.values.endowmentCategoryId}
                                onChange={(event) => {
                                    formik.setFieldValue('endowmentCategoryId', event.target.value)
                                }}
                                sx={{width: "100%"}}
                            >
                                {uniqueEndowmentCategory.map((ec) => (
                                    <MenuItem key={ec.EndowmentCategoryId} value={ec.EndowmentCategoryId}>
                                        {ec.EndowmentCategoryName}
                                    </MenuItem>
                                ))} 
                            </Select>
                            {formik.touched.endowmentCategoryId && formik.errors.endowmentCategoryId && (
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
                                }}
                                >
                                    {formik.errors.endowmentCategoryId}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{flex:1}}>
                            <TextField 
                                inputRef={(el) => (fieldsRef.current.debit) = el}
                                variant="outlined" 
                                sx={{width: '100%'}}
                                id='debit'
                                name='debit'
                                onChange={textFieldChangeHandler}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.debit && formik.errors.debit ? formik.errors.debit : ''}
                                error={formik.touched.debit && Boolean(formik.errors.debit)}
                                autoComplete='off'
                            />
                        </Box> 
                        <Box sx={{flex:1}}>
                            <TextField 
                                inputRef={(el) => (fieldsRef.current.kredit) = el}
                                variant="outlined" 
                                sx={{width: '100%'}}
                                id='kredit'
                                name='kredit'
                                onChange={textFieldChangeHandler}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.kredit && formik.errors.kredit ? formik.errors.kredit : ''}
                                error={formik.touched.kredit && Boolean(formik.errors.kredit)}
                                autoComplete='off'
                            />
                        </Box> 
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Activity</Typography>
                        </Box>
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <TextField 
                                inputRef={(el) => (fieldsRef.current.activity) = el}
                                variant="outlined" 
                                multiline rows='two'
                                id='activity'
                                name='activity'
                                onChange={textFieldChangeHandler}
                                onBlur={formik.handleBlur}
                                sx={{width: '100%'}}
                                placeholder='Ex: Gerakan 10rb'
                                helperText={formik.touched.activity && formik.errors.activity}
                                error={formik.touched.activity && Boolean(formik.errors.activity)}
                            />
                        </Box> 
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Description</Typography>
                        </Box>
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <TextField 
                                inputRef={(el) => (fieldsRef.current.description) = el}
                                variant="outlined" 
                                multiline rows='two' 
                                id='description'
                                name='description'
                                onChange={textFieldChangeHandler}
                                onBlur={formik.handleBlur}
                                placeholder='Ex: Gerakan 10rb'
                                sx={{width: '100%'}}
                                helperText={formik.touched.description && formik.errors.description}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                        />
                        </Box> 
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Reason</Typography>
                        </Box>
                    </Stack>
                    <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                        <Box sx={{flex:1}}>
                            <TextField 
                            variant="outlined" 
                            multiline rows='two' 
                            id='reason'
                            name='reason'
                            onChange={textFieldChangeHandler}
                            onBlur={formik.handleBlur}
                            sx={{width: '100%'}}
                            helperText={formik.touched.reason && formik.errors.reason}
                            error={formik.touched.reason && Boolean(formik.errors.reason)}
                        />
                        </Box> 
                    </Stack>
                    <div>
                        <Typography sx={{color:'#666666', fontSize:'12px', fontWeight:400}}>Last Activity:</Typography>
                        <div>
                            {getLastActivity(callId).map((activity, index) => (
                                <Typography sx={{fontSize:'12px', fontWeight:600}}>{activity}</Typography>
                            ))}
                        </div>
                    </div>
                    <Stack direction='row' justifyContent='flex-end'gap='20px' sx={{width:'100%'}}>
                        <Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                                size='medium'
                                onClick={() => {
                                    navigate('/endowment/view');
                                }}
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
                                sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                                size='medium'
                                type='submit'
                                disabled={formik.isSubmitting || !formik.isValid || proposalStatus != 4}
                            >
                                <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{isLoading ? 'Loading...' : 'Save'}</Typography>
                            </CustomLoadingButton>
                        </Box>
                    </Stack>
                </Stack>
            </form>
        </PageWrapper>
    );
}

GetMhs.propTypes = null;