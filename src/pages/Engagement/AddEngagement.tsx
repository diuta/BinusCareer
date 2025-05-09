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
import { useFormik } from 'formik';
import React, { useEffect, useRef,useState } from 'react';
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
import { layoutPrivateStyle } from '../../styles/layout/private-routes';
import { AlumniDetailDataType } from './Interface/IAlumni';
import { EngagementCategory, EngagementCategoryDetail, TrMappingCampusProgram } from './Interface/IEngagementMaster';

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
        apiClient.post(`${ApiService.engagement}/alumni-detail`, tempNIM)
        .then(resp=>resp)
        .then(resp=>{
            const filtered = resp.data.find(x => x.alumniNim === nim);
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
                                <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.facultyName}</Typography>
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
                                <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.programName}</Typography>
                            </Box>
                            <Box sx={{flex:1}}>
                                <Typography sx={{textAlign: 'justify', fontSize:'14px', fontWeight:600, color:'#333333'}}>{alumniDetail.degreeName}</Typography>
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

export function AddEngagement() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [NIM, setNIM] = useState('');
    const [submitNim, setSubmitNim] = useState('');
    const [dataMhs, setDataMhs] = useState<AlumniDetailDataType[]>([]);
    const [mappingCampus, setMappingCampus] = useState<TrMappingCampusProgram[]>([]);
    const [category, setCategory] = useState<EngagementCategory[]>([]);
    const [categoryDetail, setCategoryDetail] = useState<EngagementCategoryDetail[]>([]);
    const userProfile = useSelector(selectProfile);
    const { binusianId, rolePermissions, currentRole } = userProfile;
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex: 0, 
		pageSize: 5, 
	});
    const getLastDateOfCurrentMonth = () => {
        const today = new Date(); 
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
        return lastDay;
    };
    
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [initialValues, setInitialValues] = useState({
        "alumniId": 0,
        "unitId": null,
        "engagementCategoryId": null,
        "engagementCategoryDetailId": null,
        "parentId": null,
        "period": format(getLastDateOfCurrentMonth(), 'dd-MM-yyyy'),
        "date": '',
        "nominal": '',
        "activity": '',
        "description": '',
        "linkEvidence": '',
        "proposalStatusId": 1,
        "reason": '',
        "dateIn": new Date(),
        "userIn": binusianId,
        "dateUp": new Date(),
        "userUp": binusianId
    });


      
    const uniqueEngagementCategory = [...new Set(category.map(item => JSON.stringify({ EngagementCategoryId: item.engagementCategoryId, EngagementCategoryName: item.engagementCategoryName })))]
    .map(item => JSON.parse(item));
    const uniqueEngagementCategoryDetail = [...new Set(categoryDetail.map(item => JSON.stringify({ EngagementCategoryDetailId: item.engagementCategoryDetailId, EngagementCategoryDetailName: item.engagementCategoryDetailName, Nominal: item.nominal })))]
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
        apiClient.post(`${ApiService.engagement}/alumni-detail`, tempNIM)
        .then(resp=>resp)
        .then(resp=>{
            setDataMhs(resp.data);
            if(resp.data.length > 0){
                setInitialValues((prevInitialValues) => ({
                    ...prevInitialValues,
                    "unitId": resp.data[0].mappingCampusProgramId
                }));
                const tempcampus = resp.data[0].mappingCampusProgramId;
                setRowSelection({
                    [tempcampus]: true
                });
            };
        });
    };

    useEffect(() => {
        apiClient.get(`${ApiService.engagement}/mappingcampus`)
        .then(resp=>resp)
        .then(resp=>{
            setMappingCampus(resp.data);
        });

        apiClient.get(`${ApiService.engagementCategory}`)
        .then(resp=>resp)
        .then(resp=>{
            setCategory(resp.data);
        });

        apiClient.get(`${ApiService.engagementCategoryDetail}`)
        .then(resp=>resp)
        .then(resp=>{
            setCategoryDetail(resp.data);
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

    const validationSchema = Yup.object({
        "unitId": Yup.string().nullable().required("Unit Name is Required"),
        "engagementCategoryId": Yup.number().nullable().required("Category Name is Required"),
        "engagementCategoryDetailId": Yup.number().nullable().required("Category Detail Name is Required"),
        "period": Yup.string().required("Period is Required"),
        "date": Yup.string().required("Date is Required"),
        "nominal": Yup.number().nullable().required("Nominal is Required"),
        "activity": Yup.string().nullable().required("Activity is Required"),
        "description":Yup.string().nullable().required("Description is Required"),
        "linkEvidence": Yup.string().url('Invalid URL Format').nullable().required("Link Evidence is Required"),
    });

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        validateOnChange:true,
        onSubmit: async (values, {resetForm}) => {
            setIsLoading(true);
            const updatedValues = {
                ...values,
                alumniId: dataMhs[0].alumniId
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
                engagementCategoryId: formik.values.engagementCategoryId,
                engagementCategoryDetailId: formik.values.engagementCategoryDetailId,
                parentId: formik.values.parentId,
                period: handlePeriodChange(formik.values.period),
                date: handleDateChange(formik.values.date),
                nominal: formik.values.nominal,
                activity: formik.values.activity,
                description: formik.values.description,
                linkEvidence: formik.values.linkEvidence,
                proposalStatusId: 1,
                reason: formik.values.reason,
                dateIn: new Date(),
                userIn: binusianId,
                dateUp: new Date(),
                userUp: binusianId
            };

            apiClient.post(`${ApiService.engagement}?currentRole=${currentRole}`, JSON.stringify(data))
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
                            navigate('/engagement/approval');
                        },
                        onClose:() => {
                            setIsLoading(false);
                            navigate('/engagement/approval');
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
        if(!(rolePermissions.some(item => item.permissionName === 'add-engagement'))){
            showModal({
                title: 'Failed',
                message:
                    'You Do Not Have Permission To Add Engagement',
                options: {
                    variant: 'failed',
                    onOk: () => {
                        navigate('/engagement/view')
                    },
                    onClose() {
                        navigate('/engagement/view')
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
        if (name == 'nominal' && textFieldRef.current) {
            textFieldRef.current.value = formatNumber(value);
        }
        debounce(name, name == 'nominal' ? parseNumber(value) : value);
      };
      
      const textFieldRef = useRef<HTMLInputElement>(null);

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
            {(submitNim && dataMhs.length > 0 && dataMhs[0].mappingCampusProgramId) &&
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
                                            dateFormat="dd-MM-yyyy"
                                            value={formik.values.period}
                                            id='period'
                                            name='period'
                                            onChange={(periods) => {
                                                formik.setFieldValue('period', periods);
                                            }}
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
                                            dateFormat="dd-MM-yyyy"
                                            value={formik.values.date}
                                            id='date'
                                            name='date'
                                            onChange={(dates) =>{
                                                formik.setFieldValue('date', dates);
                                            }}
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
                                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
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
                                                    <TableCell key={cell.id}  sx={{fontSize:'12px'}}>
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
                                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                                    <Box sx={{flex:1}}>
                                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Category</Typography>
                                    </Box>
                                    <Box sx={{flex:1}}>
                                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Category Detail</Typography>
                                    </Box>
                                    <Box sx={{flex:1}}>
                                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Nominal</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                                    <Box sx={{flex:1}}>
                                        <Select
                                            label="engagementCategory"
                                            id="engagementCategory"
                                            value={formik.values.engagementCategoryId}
                                            onFocus={() => formik.setFieldTouched('engagementCategoryId', true)}
                                            onChange={(event) => {
                                                formik.setFieldValue('engagementCategoryId', event.target.value)
                                            }}
                                            placeholder='Select an option'
                                            sx={{width: "100%"}}
                                        >
                                            {uniqueEngagementCategory.map((ec) => (
                                                <MenuItem key={ec.EngagementCategoryId} value={ec.EngagementCategoryId}>
                                                    {ec.EngagementCategoryName}
                                                </MenuItem>
                                            ))} 
                                        </Select>
                                        {formik.touched.engagementCategoryId && formik.errors.engagementCategoryId && (
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
                                                {formik.errors.engagementCategoryId}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{flex: 1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:'ellipsis'}}>
                                        <Select
                                            label="engagementCategoryDetail"
                                            id="engagementCategoryDetail"
                                            value={formik.values.engagementCategoryDetailId}
                                            onFocus={() => formik.setFieldTouched('engagementCategoryDetailId', true)}
                                            onChange={(event) => {
                                                formik.setFieldValue('engagementCategoryDetailId', event.target.value);
                                                const defNominal = uniqueEngagementCategoryDetail.find(item => String(item.EngagementCategoryDetailId) === String(event.target.value));
                                                if(defNominal){
                                                    if(textFieldRef.current){
                                                        textFieldRef.current.value = formatNumber(defNominal.Nominal);
                                                    }
                                                    formik.setFieldValue('nominal',defNominal.Nominal);
                                                }
                                            }}
                                            placeholder='Select an option'
                                            sx={{
                                                width:"100%",
                                                whiteSpace:"nowrap",
                                                overflow:"hidden",
                                                textOverflow:'ellipsis'
                                            }}
                                            renderValue={(value) => {
                                                const selectedItem = uniqueEngagementCategoryDetail.find(item => item.EngagementCategoryDetailId === value);
                                                return (
                                                    <Typography noWrap sx={{fontSize:'14px'}}>
                                                        {selectedItem ? selectedItem.EngagementCategoryDetailName : ''}
                                                    </Typography>
                                                );
                                            }}
                                        >
                                            {uniqueEngagementCategoryDetail.map((ecd) => (
                                                <MenuItem key={ecd.EngagementCategoryDetailId} value={ecd.EngagementCategoryDetailId}>
                                                    {ecd.EngagementCategoryDetailName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.engagementCategoryDetailId && formik.errors.engagementCategoryDetailId && (
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
                                                {formik.errors.engagementCategoryDetailId}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{flex:1}}>
                                        <TextField 
                                            inputRef={textFieldRef}
                                            variant="outlined" 
                                            sx={{width: '100%'}}
                                            id='nominal'
                                            name='nominal'
                                            onChange={textFieldChangeHandler}
                                            onBlur={formik.handleBlur}
                                            helperText={formik.touched.nominal && formik.errors.nominal}
                                            error={formik.touched.nominal && Boolean(formik.errors.nominal)}
                                            autoComplete='off'
                                        />
                                    </Box>
                                </Stack>
                                <Stack direction='row' gap='10px' sx={{width: '100%'}}>
                                    <Box sx={{flex:1}}>
                                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Activity</Typography>
                                    </Box>
                                    <Box sx={{flex:1}}>
                                        <Typography sx={{textAlign:'justify', fontSize:'12px', fontWeight:400}}>Link Evidence</Typography>
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
                                            placeholder='Ex: Guest Lecture Algorithm and Programming'
                                            helperText={formik.touched.activity && formik.errors.activity}
                                            error={formik.touched.activity && Boolean(formik.errors.activity)}
                                        />
                                    </Box> 
                                    <Box sx={{flex:1}}>
                                        <TextField 
                                            variant="outlined" 
                                            multiline rows='two'  
                                            id='linkEvidence'
                                            name='linkEvidence'
                                            onChange={textFieldChangeHandler}
                                            onBlur={formik.handleBlur}
                                            sx={{width: '100%'}}
                                            helperText={formik.touched.linkEvidence && formik.errors.linkEvidence}
                                            error={formik.touched.linkEvidence && Boolean(formik.errors.linkEvidence)}
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
                                        placeholder='Ex: Guest Lecture Algorithm and Programming'
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
                                                navigate('/engagement/view');
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
                                            disabled={isLoading || formik.isSubmitting || (!formik.isValid && Object.keys(formik.touched).length > 0)}
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