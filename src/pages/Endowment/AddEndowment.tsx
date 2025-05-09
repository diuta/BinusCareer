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
import React, { useEffect, useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import Datepicker from '../../components/common/Datepicker';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client'; 
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';   
import { selectProfile } from '../../store/profile/selector';
import { layoutPrivateStyle } from '../../styles/layout/private-routes';
import { IFormValues } from './Interface/IAddEndowment';
import { AlumniDetailDataType } from './Interface/IAlumni';
import { EndowmentCategory, TrMappingCampusProgram } from './Interface/IEndowmentMaster';

export function GetMhs({nim}){
    const { showModal } = useModal();
    const [nimFound, setNimFound] = useState(false);
    const [alumniDetail, setAlumniDetail] = useState({
        alumniName: '',
        campusName: '',
        facultyName: '',
        programName: '',
        degreeName: '',
        mappingCampusProgramId: ''
    });
    type AlumniDetailType = {
        "NIM": string
    };

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
            const filtered = resp.data[0];
            if((filtered && filtered?.mappingCampusProgramId)){
                setAlumniDetail({
                    alumniName: filtered.alumniName,
                    campusName: filtered.campusName,
                    facultyName: filtered.facultyName,
                    programName: filtered.programName,
                    degreeName: filtered.degreeName,
                    mappingCampusProgramId: filtered.mappingCampusProgramId
                });
                setNimFound(true);
            }
            else if((!filtered?.mappingCampusProgramId) || !filtered){
                setNimFound(false);
                showModal({
                    title: 'Failed',
                    message:
                        !filtered ? 'NIM Not Found' : 'Alumni Program Not Found',
                    options: {
                        variant: 'failed',
                        onOk: () => {
                            setNimFound(false);
                        },
                        onClose() {
                            setNimFound(false);
                        },
                    },
                });
            }
        })
    },[nim]);
    
    return(
        <div>
            {nimFound && (
                <>
                    <Divider sx={{marginY: "20px"}}/>
                    <Stack  direction='column' gap='10px' sx={{width: '100%'}}>
                        <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                            <Box sx={{flex: 1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Name</Typography>
                            </Box>
                            <Box sx={{flex: 1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Campus</Typography>
                            </Box>
                            <Box sx={{flex: 1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Faculty</Typography>
                            </Box>
                        </Stack>
                        <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                            <Box sx={{flex: 1}}>
                                <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.alumniName}</Typography>
                            </Box>
                            <Box sx={{flex: 1}}>
                                <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.campusName}</Typography>
                            </Box>
                            <Box sx={{flex: 1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.facultyName}</Typography>
                            </Box>
                        </Stack>
                        <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Program</Typography>
                            </Box>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400, color:'#666666'}}>Degree</Typography>
                            </Box>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign:'justify'}}> </Typography>
                            </Box>
                        </Stack>
                        <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.programName}</Typography>
                            </Box>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign:'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.degreeName}</Typography>
                            </Box>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign:'justify', fontWeight:'bold'}}> </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </>
            )}
        </div>
    );
}

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
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

  const formatNumber = (input) => {
    const valueString = input.toString().trim();

    if (valueString === '') {
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

export function AddEndowment() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [NIM, setNIM] = useState('');
    const [submitNim, setSubmitNim] = useState('');
    const [dataMhs, setDataMhs] = useState<AlumniDetailDataType[]>([]);
    const [mappingCampus, setMappingCampus] = useState<TrMappingCampusProgram[]>([]);
    const [category, setCategory] = useState<EndowmentCategory[]>([]);
    const userProfile = useSelector(selectProfile);
    const { binusianId, rolePermissions, currentRole } = userProfile;
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const fieldsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
	const [pagination, setPagination] = useState({
		pageIndex: 0, 
		pageSize: 5, 
	});
    const getLastDateOfCurrentMonth = () => {
        const today = new Date(); 
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
        return format(lastDay, 'dd-MM-yyyy');
    };
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [initialValues, setInitialValues] = useState({
        "alumniId": 0,
        "unitId": null,
        "endowmentCategoryId": null,
        "parentId": null,
        "period": getLastDateOfCurrentMonth(),
        "date": '',
        "debit": '',
        "kredit": '',
        "activity": '',
        "description": '',
        "proposalStatusId": 1,
        "reason": '',
        "dateIn": new Date(),
        "userIn": binusianId,
        "dateUp": new Date(),
        "userUp": binusianId
    });
      
    const uniqueEndowmentCategory = [...new Set(category.map(item => JSON.stringify({ EndowmentCategoryId: item.endowmentCategoryId, EndowmentCategoryName: item.endowmentCategoryName })))]
    .map(item => JSON.parse(item));

    const table = useReactTable({
        data: mappingCampus,
        columns,
        filterFns: {
          select: (rows, id, filterValue) => true,
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


    type AlumniDetailType = {
        "NIM": string
    };

    const tempNIM: AlumniDetailType[] = [];
    tempNIM.push({
        "NIM": NIM
    });

    const queryString = tempNIM
    .map((item, index) => `data[${index}].NIM=${item.NIM}`)
    .join('&');


    const handleGetNim = () => {
        setSubmitNim(NIM);
        apiClient.post(`${ApiService.endowment}/alumni-detail`, tempNIM)
        .then(resp=>resp)
        .then(resp=>{
            setDataMhs(resp.data);
            if(resp.data.length > 0){
                setInitialValues((prevInitialValues) => ({
                    ...prevInitialValues,
                    "unitId": resp.data[0].mappingCampusProgramId !== '-' ? resp.data[0].mappingCampusProgramId : null
                }));
                const tempcampus = resp.data[0].mappingCampusProgramId;
                if(resp.data[0].mappingCampusProgramId !== '-')
                setRowSelection({
                    [tempcampus]: true
                });
                else setRowSelection({});
            };
        });
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

    const validate = (values: IFormValues ) => {
        const validateError: FormikErrors<IFormValues> = {};
      
          if (!values.period) {
            validateError.period = "Period is Required";
          }
      
          if (!values.date) {
            validateError.date = "Date is Required";
          }
      
          if (dataMhs[0].mappingCampusProgramId !== "-" && !values.unitId) {
            validateError.unitId = "Unit Name is Required";
          }
      
          if (!values.endowmentCategoryId) {
            validateError.endowmentCategoryId = "Category is Required";
          }
      
          if (!values.debit && !values.kredit) {
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

          return validateError;
    };
  
    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validate,
        validateOnChange:true,
        onSubmit: async (values, {resetForm}) => {
            setIsLoading(true);
            const updatedValues = {
                ...values,
                alumniId: dataMhs[0].alumniNim
            }

            const changedFields = {};
            for(const key in updatedValues){
                if(updatedValues[key] !== formik.initialValues[key]){
                    changedFields[key] = updatedValues[key];
                }
            }

            const data = {
                alumniId: updatedValues.alumniId,
                unitId: formik.values.unitId,
                endowmentCategoryId: formik.values.endowmentCategoryId,
                parentId: formik.values.parentId,
                period: handlePeriodChange(formik.values.period),
                date: handleDateChange(formik.values.date),
                debit: parseInt(formik.values.debit,10),
                kredit: parseInt(formik.values.kredit,10),
                activity: formik.values.activity,
                description: formik.values.description,
                proposalStatusId: 1,
                reason: formik.values.reason,
                dateIn: new Date(),
                userIn: binusianId,
                dateUp: new Date(),
                userUp: binusianId
            };
            
            apiClient.post(`${ApiService.endowment}?currentRole=${currentRole}`, JSON.stringify(data))
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
                            navigate('/endowment/approval');
                        },
                        onClose:() => {
                            setIsLoading(false);
                            navigate('/endowment/approval');
                        }
                    },
                    });
                }
            })
            .catch(error_ => {
                showModal({
                    title: 'Failed',
                    message:
                        'Data Add Failed',
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
            resetForm();
        },
    });

    const handleChange = (event) =>{
      setNIM(event.target.value);
    }


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
            <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                <Typography sx={{fontSize:'12px', fontWeight:400}}> NIM</Typography>
            </Stack>
            <Stack  direction='row' gap='10px' sx={{width: '100%', marginTop:'10px'}}>
                <TextField 
                    variant="outlined" 
                    value={NIM}
                    onChange={handleChange}
                    sx={{width: '100%'}}
                    placeholder='Input Your NIM'
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{...layoutPrivateStyle.modalChangeButton, width:'120px'}}
                    size='medium'
                    onClick={handleGetNim}
                >
                    <Typography sx={{fontSize:'13px', fontWeight:600}}>
                        Search
                    </Typography>
                    
                </Button>
            </Stack>
            {submitNim && 
                <GetMhs nim={submitNim} />
            }
            {((submitNim && dataMhs.length > 0 && dataMhs[0].mappingCampusProgramId)) &&
                <>
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
                                            value={formik.values.period}
                                            id='period'
                                            name='period'
                                            onChange={(periods) => {
                                                formik.setFieldValue('period', periods);
                                            }}
                                            dateFormat="dd-MM-yyyy"
                                            clearIcon
                                            autoClose
                                        />
                                        {formik.errors.period && (
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
                                    <Stack sx={{width: '100%'}}>
                                        <Datepicker 
                                            value={formik.values.date}
                                            id='date'
                                            name='date'
                                            onChange={(dates) =>{
                                                formik.setFieldValue('date', dates);
                                            }}
                                            dateFormat="dd-MM-yyyy"
                                            clearIcon
                                            autoClose
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
                                <Stack direction='row' sx={{width: '100%'}}>
                                    <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Unit Name</Typography>
                                </Stack>
                                <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCCCCC'}}>
                                    <TableContainer sx={{ minHeight: "400px" }}>
                                        <Table>
                                            <TableHead>
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableCell key={header.id}>
                                                    <Stack
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        style={{ cursor: "pointer", fontWeight: "bold", fontSize:'12px'  }}
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
                                                    sx={{ width: 70, ' .binus-InputBase-input': { padding: '7px 10px 6px 8px !important'}, fontSize:'12px'  }}
                                                    SelectDisplayProps={{ style: { fontSize: 12 } }}
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
                                {formik.errors.unitId && (
                                    <Typography 
                                        sx={{ 
                                            color: '#9F041B',
                                            fontFamily: 'font-family: Open Sans, sans-serif',
                                            fontWeight: 200,
                                            fontSize: '1em',
                                            lineHeight: '1.66',
                                            textAlign: 'left',
                                            marginRight: '14px',
                                            marginBottom: 0,
                                            marginLeft: '14px'
                                        }}
                                    >
                                        {formik.errors.unitId}
                                    </Typography>
                                )}
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
                                            placeholder='Select an option'
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
                                            type='text'
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
                                            type='text'
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
                                        variant="outlined" 
                                        multiline rows='two' 
                                        id='description'
                                        name='description'
                                        onChange={textFieldChangeHandler}
                                        onBlur={formik.handleBlur}
                                        sx={{width: '100%'}}
                                        placeholder='Ex: Gerakan 10rb'
                                        helperText={formik.touched.description && formik.errors.description}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                    />
                                    </Box> 
                                </Stack>
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
                                            variant="contained"
                                            color="primary"
                                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
                                            sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                                            size='medium'
                                            type='submit'
                                            disabled={formik.isSubmitting || !formik.isValid}
                                        >
                                            <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Save</Typography>
                                        </CustomLoadingButton>
                                    </Box>
                                </Stack>
                            </Stack>
                    </form>
                </>
            }
        </PageWrapper>
    );
}

GetMhs.propTypes = null;
IndeterminateCheckbox.propTypes = null;