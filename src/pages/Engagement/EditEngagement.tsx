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
import { useFormik } from 'formik';
import { useEffect, useRef,useState,  } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import * as Yup from 'yup';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import Datepicker from "../../components/common/Datepicker"
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import useModal from '../../hooks/use-modal';
import { selectProfile } from '../../store/profile/selector';
import { layoutPrivateStyle } from '../../styles/layout/private-routes';
import { AlumniDetailDataType } from './Interface/IAlumni';
import { ViewEditDataType } from './Interface/IEditEngagement';
import { EngagementCategory, EngagementCategoryDetail, TrMappingCampusProgram } from './Interface/IEngagementMaster';

function GetMhs({nim}){
    const [alumniDetail, setAlumniDetail] = useState<AlumniDetailDataType[]>([]);
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
            const filtered = resp.data;
            setAlumniDetail(filtered);
        })
    },[])
    
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

export function EditEngagement() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const { id } = useParams();
    const [tempData, setTempData] = useState<ViewEditDataType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mappingCampus, setMappingCampus] = useState<TrMappingCampusProgram[]>([]);
    const [category, setCategory] = useState<EngagementCategory[]>([]);
    const [categoryDetail, setCategoryDetail] = useState<EngagementCategoryDetail[]>([]);
    const [proposalStatus, setProposalStatus] = useState();
    const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex: 0, 
		pageSize: 5, 
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const fieldsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const callId = parseInt(id || '', 10) || 0;

    const [submitNIM, setSubmitNIM] = useState('');

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
    
    const uniqueEngagementCategory = [...new Set(category.map(item => JSON.stringify({ EngagementCategoryId: item.engagementCategoryId, EngagementCategoryName: item.engagementCategoryName })))]
    .map(item => JSON.parse(item));
    const uniqueEngagementCategoryDetail = [...new Set(categoryDetail.map(item => JSON.stringify({ EngagementCategoryDetailId: item.engagementCategoryDetailId, EngagementCategoryDetailName: item.engagementCategoryDetailName, Nominal: item.nominal })))]
    .map(item => JSON.parse(item));

    const userProfile = useSelector(selectProfile);

    const { binusianId, currentRole, rolePermissions } = userProfile;

    let tempPeriod = new Date();
    let tempDate = new Date();



    const [initialValues, setInitialValues] = useState({
        "engagementId": callId,
        "alumniId": 0,
        "unitId": null,
        "engagementCategoryId": null,
        "engagementCategoryDetailId": null,
        "parentId": 0,
        "period": '',
        "date": '',
        "nominal": 0,
        "activity": null,
        "description": null,
        "linkEvidence": null,
        "proposalStatusId": 2,
        "reason": null,
        "dateIn": new Date(),
        "userIn": binusianId,
        "dateUp": new Date(),
        "userUp": binusianId
    });

    const validationSchema = Yup.object({
        "unitId": Yup.string().nullable().required("Unit Name is Required"),
        "engagementCategoryId": Yup.number().nullable().required("Category Name is Required"),
        "engagementCategoryDetailId": Yup.number().nullable().required("Category Detail Name is Required"),
        "period": Yup.string().nullable().required("Period is Required"),
        "date": Yup.string().nullable().required("Date is Required"),
        "nominal": Yup.number().nullable().required("Nominal is Required"),
        "activity": Yup.string().nullable().required("Activity is Required"),
        "description":Yup.string().nullable().required("Description is Required"),
        "linkEvidence": Yup.string().url('Invalid URL Format').nullable().required("Link Evidence is Required"),
        "reason": Yup.string().nullable().required("Reason is Required"),
    });
    


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

    useEffect(() => {
        apiClient.get(`${ApiService.engagement}?id=${id}`)
        .then(resp=>resp)
        .then(resp=>{
            const temp = resp.data.find(item => item.engagementId === callId);
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
        apiClient.get(`${ApiService.engagement}/edit?id=${id}`)
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
                            navigate('/engagement/view');
                        },
                        onClose:() => {
                            navigate('/engagement/view');
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
                "engagementId": callId,
                "alumniId": resp.data[0].alumniId,
                "unitId": resp.data[0].unitId,
                "engagementCategoryId": resp.data[0].engagementCategoryId,
                "engagementCategoryDetailId": resp.data[0].engagementCategoryDetailId,
                "parentId": parent,
                "period": formatDateToDDMMYYYY(resp.data[0].period),
                "date": formatDateToDDMMYYYY(resp.data[0].date),
                "nominal": parseInt(resp.data[0].nominal,10),
                "activity": resp.data[0].activity,
                "description": resp.data[0].description,
                "linkEvidence": resp.data[0].linkEvidence,
                "proposalStatusId": 2,
                "reason": null,
                "dateIn": new Date(),
                "userIn": binusianId,
                "dateUp": new Date(),
                "userUp": binusianId
            });

            if(fieldsRef.current.nominal){
                fieldsRef.current.nominal.value = formatNumber(resp.data[0].nominal);
            }
            if(fieldsRef.current.activity){
                fieldsRef.current.activity.value = resp.data[0].activity;
            }
            if(fieldsRef.current.linkEvidence){
                fieldsRef.current.linkEvidence.value = resp.data[0].linkEvidence;
            }
            if(fieldsRef.current.description){
                fieldsRef.current.description.value = resp.data[0].description ;
            }
            
            setRowSelection({
                [resp.data[0].unitId] : true
            });
            formik.setFieldValue('period', formatDateToDDMMYYYY(resp.data[0].period));
            formik.setFieldValue('date', formatDateToDDMMYYYY(resp.data[0].date));
        });
    },[callId, id, parent]);


    useEffect(() => {
        apiClient.get(`${ApiService.engagement}/parent?id=${id}`)
        .then(resp=>resp)
        .then(resp=>{
            setTempData(resp.data);
        });
    }, []);

    const formatDateTime = (inputDate: any) => {
        let date: Date;
        if (typeof inputDate === 'string') {
            date = new Date(inputDate);
        } else if (inputDate instanceof Date) {
            date = inputDate;
        } else {
            throw new TypeError('Invalid Date');
        }

        if (isNaN(date.getTime())) {
            throw new TypeError('Invalid Date');
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const getLastActivity = (tempId: number) =>{
        const initialRecord = tempData.find(item => item.engagementId == tempId);
        if(!initialRecord){
            return [];
        }
        const relatedRecords = tempData.filter(item => item.engagementId == initialRecord.parentId || item.engagementId == initialRecord.engagementId);
        const activities = tempData.map(record => {
            if(record.parentId == null){
                return `Added by ${record.userIn} - ${formatDateTime(record.dateIn)}`
            }
            if(record.parentId != null){
                return `Edited by ${record.userIn} - ${formatDateTime(record.dateIn)}`
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
        validationSchema,
        validateOnChange:true,
        onSubmit: (values) => {
            setIsLoading(true);
            for(const key in values){
                if(values[key] !== formik.initialValues[key]){
                    changed[key] = values[key];
                }
            }

            const originalData = Object.keys(changed).map((key) => `${key}: ${formik.initialValues[key]}`);
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
            

            const editData = {
                data
            }

            apiClient.post(`${ApiService.engagement}/update?currentRole=${currentRole}`, JSON.stringify(data))
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
                            navigate('/engagement/approval');
                        },
                        onClose:() => {
                            setIsLoading(false);
                            navigate('/engagement/approval')
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

    const debounce = useDebouncedCallback((field, value) => {
        formik.setFieldTouched(field,true);
        formik.setFieldValue(field, value);
      }, 250);
    
    const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      const { name, value } = e.target;
      if (name == 'nominal' && fieldsRef.current.nominal) {
        fieldsRef.current.nominal.value = formatNumber(value);
      }
      debounce(name, name == 'nominal' ? parseNumber(value) : value);
    };

    useEffect(() => {
        formik.setFieldValue('date', formatDateToDDMMYYYY(tempDate));
        formik.setFieldValue('period',formatDateToDDMMYYYY(tempPeriod));
    }, []);

    useEffect(() => {
        if(!(rolePermissions.some(item => item.permissionName === 'edit-engagement'))){
            showModal({
                title: 'Failed',
                message:
                    'You Do Not Have Permission To Edit Engagement',
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
                                }}
                                >
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
                                            <MenuItem value={5} sx={{fontSize:'12px'}}>5</MenuItem>
                                            <MenuItem value={10} sx={{fontSize:'12px'}}>10</MenuItem>
                                            <MenuItem value={50} sx={{fontSize:'12px'}}>50</MenuItem>
                                        </Select>
                                    </Stack>
                                    <Pagination
                                        count={table.getPageCount()}
                                        onChange={(_, page) => table.setPageIndex(page-1)}
                                        color="primary"
                                        size="small"
                                        sx={{marginY: 'auto', fontSize:'12px'}}
                                    />
                                    <Stack direction='row' sx={{ marginY: 'auto' }} gap='10px'>
                                        <Typography sx={{ marginY: 'auto' , fontSize:'12px'}}>Jump to:</Typography>
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
                            onChange={(event) => {
                                formik.setFieldValue('engagementCategoryId', event.target.value)
                            }}
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
                            onChange={(event) => {
                                formik.setFieldValue('engagementCategoryDetailId', event.target.value);
                                const defNominal = uniqueEngagementCategoryDetail.find(item => String(item.EngagementCategoryDetailId) === String(event.target.value));
                                if(defNominal && fieldsRef.current.nominal) {
                                        fieldsRef.current.nominal.value = formatNumber(defNominal.Nominal);
                                        debounce('nominal', defNominal.Nominal);
                                    }
                            }}
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
                                inputRef={(el) => (fieldsRef.current.nominal = el)}
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
                                inputRef={(el) => (fieldsRef.current.activity) = el}
                                variant="outlined" 
                                multiline rows='two'
                                id='activity'
                                name='activity'
                                onChange={textFieldChangeHandler}
                                onBlur={formik.handleBlur}
                                sx={{width: '100%'}}
                                placeholder='Ex: Guest Lecture Algorihm and Programming'
                                helperText={formik.touched.activity && formik.errors.activity}
                                error={formik.touched.activity && Boolean(formik.errors.activity)}
                            />
                        </Box> 
                        <Box sx={{flex:1}}>
                            <TextField 
                                inputRef={(el)  => (fieldsRef.current.linkEvidence) = el}
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
                            inputRef={(el) => (fieldsRef.current.description) = el}
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
                                <Typography sx={{color:'#000000', fontSize:'12px', fontWeight:600}}>{activity}</Typography>
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
                                    navigate('/engagement/view');
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
                                <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Save</Typography>
                            </CustomLoadingButton>
                        </Box>
                    </Stack>
                </Stack>
            </form>
        </PageWrapper>
    );
}

GetMhs.propTypes = null;