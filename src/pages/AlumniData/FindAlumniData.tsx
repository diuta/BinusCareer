import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useFormik } from "formik";
import qs from "qs";
import { useCallback,useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import DatePicker from "../../components/common/Datepicker";
import MultiSelect from "../../components/common/multiselect/MultiSelect";
// server table imports
import ServerTableAjax from "../../components/common/table_ajax/ServerTableAjax";
import PageWrapper from "../../components/container/PageWrapper";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import { Option } from "../../interfaces/ITypes";
import { selectProfile } from "../../store/profile/selector";
import ChildAccordion from "./Components/ChildAccordion";
import DomicileAccordion from "./Components/DomicileAccordion";
import JobAccordion from "./Components/JobAccordion";
import PersonalDataAccordion from "./Components/PersonalDataAccordion";
import RequestApproval from "./Components/RequestApproval";
import {
  Dropdown,
  FindAlumniDataColumn,
  FindAlumniDataForm,
} from "./Interface/FindAlumniDataInterface";
import RangeYearpicker from "../../components/common/RangeYearpicker";

type ColumnType = ColumnDef<FindAlumniDataColumn> & {
  toggleable?: boolean;
};

const getColumns = (IsARO: boolean): ColumnType[] => {
  const columns: ColumnType[] = [
    {
      accessorKey: "alumniId",
      header: "NIM",
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      enableHiding: false,
    },
    {
      accessorKey: "campus",
      header: "Campus",
      enableHiding: false,
    },
    {
      accessorKey: "faculty",
      header: "Faculty",
      enableHiding: false,
    },
    {
      accessorKey: "program",
      header: "Program",
      enableHiding: false,
    },
    {
      accessorKey: "degree",
      header: "Degree",
      enableHiding: false,
    },
    {
      accessorKey: "entryYear",
      header: "Entry Year",
      enableHiding: false,
    },
    {
      accessorKey: "graduationYear",
      header: "Graduation Year",
      enableHiding: false,
    },
    {
      accessorKey: "graduationPeriod",
      header: "Graduation Period",
      enableHiding: false,
    },
    {
      accessorKey: "companyName",
      header: "Company Name",
      enableHiding: false,
    },
    {
      accessorKey: "companyCategory",
      header: "Company Category",
      enableHiding: false,
    },
    {
      accessorKey: "sector",
      header: "Sector",
      enableHiding: false,
    },
    {
      accessorKey: "position",
      header: "Position",
      enableHiding: false,
    },
    {
      accessorKey: "positionLevel",
      header: "Position Level",
      enableHiding: false,
    },
    {
      accessorKey: "jobCategory",
      header: "Job Category",
      enableHiding: false,
    },
    {
      accessorKey: "country",
      header: "Country",
      enableHiding: false,
    },
    {
      accessorKey: "province",
      header: "Province",
      enableHiding: false,
    },
    {
      accessorKey: "city",
      header: "City",
      enableHiding: false,
    },
    {
      accessorKey: "totalChild",
      header: "Total Child",
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "updateDate",
      header: "Updated Date",
      enableHiding: false,
      cell: ({ row }) => {
        const date = row.original.updateDate;
        return date
          ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
          : "";
      },
    },

    // these columns can be hidden
    {
      accessorKey: "collegeProgram",
      header: "College Program",
    },
    {
      accessorKey: "religion",
      header: "Religion",
    },
    {
      accessorKey: "binusSquare",
      header: "Binus Square",
      toggleable: IsARO,
    },
    {
      accessorKey: "graduationDate",
      header: "Graduation Date",
      toggleable: IsARO,
      cell: ({ row }) => {
        const date = row.original.graduationDate;
        return date
          ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
          : "";
      },
    },
    {
      accessorKey: "updateYear",
      header: "Update Year",
      toggleable: IsARO,
    },
    {
      accessorKey: "entryDate",
      header: "Entry Date",
      toggleable: IsARO,
      cell: ({ row }) => {
        const date = row.original.entryDate;
        return date
          ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
          : "";
      },
    },
    {
      accessorKey: "nationality",
      header: "Nationality",
    },
    {
      accessorKey: "binusianId",
      header: "Binusian ID",
      toggleable: IsARO,
    },
    {
      accessorKey: "minorProgram",
      header: "Minor Program",
      toggleable: IsARO,
    },
    {
      accessorKey: "studentTrack",
      header: "Student Track",
      toggleable: IsARO,
    },
    {
      accessorKey: "engagementCount",
      header: "Total Engagement",
      enableSorting: false,
    },
    {
      accessorKey: "totalEngagement",
      header: "Total Engagement Value",
      enableSorting: false,
    },
    {
      accessorKey: "endowmentCount",
      header: "Total Endowment",
      enableSorting: false,
    },
    {
      accessorKey: "totalEndowment",
      header: "Total Endowment Value",
      enableSorting: false,
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      header: "Action",
      cell: ({ row }) => <ActionCell row={row} />,
      enableHiding: false,
    },
  ];

  return columns;
};

function ActionCell({ row }) {
  const Navigate = useNavigate();

  const editCell = () => {
    Navigate(`/find-alumni/${row.original.alumniId}`);
  };

  return (
    <Stack direction="row" gap="10px" display="flex" justifyContent="center">
      <Button
        onClick={editCell}
        name="edit"
        variant="contained"
        sx={{
          minWidth: "30px",
          padding: "0px",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
        }}
      >
        <EditIcon />
      </Button>
    </Stack>
  );
}

const defaultHiddenColumns = [
  "collegeProgram",
  "religion",
  "binusSquare",
  "graduationDate",
  "updateYear",
  "entryDate",
  "nationality",
  "binusianId",
  "minorProgram",
  "studentTrack",
  "engagementCount",
  "totalEngagement",
  "endowmentCount",
  "totalEndowment",
  "gender",
];

export function FindAlumniData() {
  const userProfile = useSelector(selectProfile);
  const [degreeDropDown, setDegreeDropDown] = useState<Option[]>([]);
  const [graduationPeriodDropDown, setGraduationPeriodDropDown] = useState<
    Option[]
  >([]);

  const [buttonLoading, setButtonLoading] = useState(false);

  const [personalDataChecked, setPersonalDataChecked] =
    useState<boolean>(false);
  const [jobDataChecked, setJobDataChecked] = useState<boolean>(false);
  const [domicileDataChecked, setDomicileDataChecked] =
    useState<boolean>(false);
  const [childDataChecked, setChildDataChecked] = useState<boolean>(false);

  const [campusList, setCampusList] = useState<Option[]>([]);
  const [campusWatcher, setCampusWatcher] = useState<boolean>(false);
  const [facultyList, setfacultyList] = useState<Option[]>([]);
  const [facultyWatcher, setFacultyWatcher] = useState<boolean>(false);
  const [programList, setPogramList] = useState<Option[]>([]);
  const [programWatcher, setProgramWatcher] = useState<boolean>(false);

  const [data, setData] = useState<FindAlumniDataColumn[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const IsARO = userProfile?.rolePermissions.some(
    (permission) => permission.permissionName === "view-column-visibility-aro"
  );
  const columns = useMemo(() => getColumns(IsARO), []);

  const [openColumnVisibility, setOpenColumnVisibility] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination, rowSelection },
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.nim,
    onRowSelectionChange: setRowSelection,
    initialState: {
      columnVisibility: defaultHiddenColumns.reduce((acc, columnId) => {
        acc[columnId] = false;
        return acc;
      }, {} as Record<string, boolean>),
    },
  });

  const formik = useFormik<FindAlumniDataForm>({
    initialValues: {
      campus: [],
      faculty: [],
      program: [],
      degree: [],
      entryYear: [],
      graduationYear: [],
      graduationPeriod: [],
      startUpdate: null,
      endUpdate: null,
      name: "",
      nim: "",
      binusianId: "",
      placeOfBirth: "",
      dateOfBirth: null,
      isSOC: false,
      isRegisteredAlumni: false,
      companyName: "",
      companyCategory: [],
      sector: [],
      position: "",
      positionLevel: [],
      jobCategory: [],
      country: [],
      province: [],
      city: [],
      minAge: -1,
      maxAge: -1,
    },
    onSubmit: async (values) => {
      setButtonLoading(true);
      setDataWatcher(!dataWatcher);
    },
  });

  // Initialize local visibility state for columns
  const [visibilityState, setVisibilityState] = useState(
    table.getAllLeafColumns().reduce((acc, column) => {
      acc[column.id] = column.getIsVisible();
      return acc;
    }, {})
  );

  // Handle checkbox toggle in the local state
  const handleCheckboxChange = (columnId) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [columnId]: !prevState[columnId],
    }));
  };

  // Apply visibility changes to the table using setColumnVisibility
  const applyVisibilityChanges = () => {
    table.setColumnVisibility(visibilityState);
    setOpenColumnVisibility(false);
  };

  const getDegree = async () => {
    const response = await apiClient.get(ApiService.degree);
    setDegreeDropDown(response.data.listDropdown);
  };

  const getGraduationPeriod = async () => {
    const response = await apiClient.get(ApiService.getGraduationPeriod);
    const { minPeriod, maxPeriod } = response.data;

    const dropdownOptions: Dropdown[] = [];
    for (let year = minPeriod; year <= maxPeriod; year += 1) {
      dropdownOptions.push({ value: year.toString(), label: year.toString() });
    }

    setGraduationPeriodDropDown(dropdownOptions);
  };

  useEffect(() => {
    getDegree();
    getGraduationPeriod();
    getCampusesByRole();
    getFacultiesByRole();
    getProgramsByRole();
  }, []);

  // Filter sections
  useEffect(() => {
    getFacultiesByRole();
    getProgramsByRole();
  }, [campusWatcher]);
  useEffect(() => {
    getCampusesByRole();
    getProgramsByRole();
  }, [facultyWatcher]);
  useEffect(() => {
    getCampusesByRole();
    getFacultiesByRole();
  }, [programWatcher]);
  const refreshDropdown = (field: string) => {
    switch (field) {
      case "campus":
        setCampusWatcher(!campusWatcher);
        break;
      case "faculty":
        setFacultyWatcher(!facultyWatcher);
        break;
      case "program":
        setProgramWatcher(!programWatcher);
        break;
      default:
        break;
    }
  };
  const filterInvalidValue = (value: string[], list: Option[]) =>
    value.filter((item) => list.map((dt) => dt.value).includes(item));
  const getCampusesByRole = useCallback(async () => {
    const param = {
      useCurrentRole: true,
      facultyId: formik.values.faculty.length > 0 ? formik.values.faculty : [],
      programId: formik.values.program.length > 0 ? formik.values.program : [],
    };
    const response = await apiClient.get(ApiService.campus, {
      params: param,
      paramsSerializer: (p) => qs.stringify(p),
    });
    const mappedResponse = response.data.listDropdown;
    setCampusList(mappedResponse);
    formik.setFieldValue(
      "campus",
      filterInvalidValue(formik.values.campus, mappedResponse)
    );
  }, [facultyWatcher, programWatcher]);
  const getFacultiesByRole = useCallback(async () => {
    const param = {
      useCurrentRole: true,
      campusId: formik.values.campus.length > 0 ? formik.values.campus : [],
      programId: formik.values.program.length > 0 ? formik.values.program : [],
    };
    const response = await apiClient.get(ApiService.faculty, {
      params: param,
      paramsSerializer: (p) => qs.stringify(p),
    });
    const mappedResponse = response.data.listDropdown;
    setfacultyList(mappedResponse);
    formik.setFieldValue(
      "faculty",
      filterInvalidValue(formik.values.faculty, mappedResponse)
    );
  }, [campusWatcher, programWatcher]);
  const getProgramsByRole = useCallback(async () => {
    const param = {
      useCurrentRole: true,
      campusId: formik.values.campus.length > 0 ? formik.values.campus : [],
      facultyId: formik.values.faculty.length > 0 ? formik.values.faculty : [],
    };
    const response = await apiClient.get(ApiService.program, {
      params: param,
      paramsSerializer: (p) => qs.stringify(p),
    });
    const mappedResponse = response.data.listDropdown;
    setPogramList(mappedResponse);
    formik.setFieldValue(
      "program",
      filterInvalidValue(formik.values.program, mappedResponse)
    );
  }, [campusWatcher, facultyWatcher]);

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const search = e.target.value.toLowerCase();
      setSearchTerm(search);
      reset(!set);
    },
    1000
  );

  // serverside table experimenting
  const [rowCount, setRowCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [queryString, setQueryString] = useState<string>("");
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [set, reset] = useState(false);

  const getAlumniByFilter = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      const param = {
        campus: formik.values.campus,
        faculty: formik.values.faculty,
        program: formik.values.program,
        degree: formik.values.degree,
        entryYear: formik.values.entryYear,
        graduationYear: formik.values.graduationYear,
        graduationPeriod: formik.values.graduationPeriod,
        startUpdate: formik.values.startUpdate,
        endUpdate: formik.values.endUpdate,
        name: formik.values.name,
        nim: formik.values.nim,
        binusianId: formik.values.binusianId,
        placeOfBirth: formik.values.placeOfBirth,
        dateOfBirth: formik.values.dateOfBirth,
        isSOC: formik.values.isSOC,
        isRegisteredAlumni: formik.values.isRegisteredAlumni,
        companyName: formik.values.companyName,
        companyCategory: formik.values.companyCategory,
        sector: formik.values.sector,
        position: formik.values.position,
        positionLevel: formik.values.positionLevel,
        jobCategory: formik.values.jobCategory,
        country: formik.values.country,
        province: formik.values.province,
        city: formik.values.city,
        minAge: formik.values.minAge,
        maxAge: formik.values.maxAge,
      };
      const url = `${ApiService.findAlumni}?${query}&${qs.stringify(param)}`;
      const response = await apiClient.get(url).then((e) => e.data);
      setData(response.data);
      setRowCount(response.dataCount);
      setQueryString(query);
      if (page) setPagination(page);
      if (sort) setSorting(sort);
      setButtonLoading(false);
    }, [dataWatcher]
  );
  const visibleColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getIsVisible())
    .map((column) => column.columnDef);

  const serverTable = ServerTableAjax<FindAlumniDataColumn>({
    data,
    columns: visibleColumns,
    rowCount,
    page: pagination,
    sort: sorting,
    isMultiSort: false,
    onTableChange: getAlumniByFilter,
    pageReset: set,
    search: searchTerm,
  });

  return (
    <PageWrapper>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Stack sx={{ width: "100%" }}>
            <Typography variant="label">Campus</Typography>
            <MultiSelect
              data={campusList}
              value={formik.values.campus}
              onChange={(value) => {
                formik.setFieldValue("campus", value);
                refreshDropdown("campus");
              }}
              onClear={() => {
                formik.setFieldValue("campus", []);
                refreshDropdown("campus");
              }}
            >
              {campusList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Typography variant="label">Faculty</Typography>
            <MultiSelect
              data={facultyList}
              value={formik.values.faculty}
              onChange={(value) => {
                formik.setFieldValue("faculty", value);
                refreshDropdown("faculty");
              }}
              onClear={() => {
                formik.setFieldValue("faculty", []);
                refreshDropdown("faculty");
              }}
            >
              {facultyList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Typography variant="label">Program</Typography>
            <MultiSelect
              data={programList}
              value={formik.values.program}
              onChange={(value) => {
                formik.setFieldValue("program", value);
                refreshDropdown("program");
              }}
              onClear={() => {
                formik.setFieldValue("program", []);
                refreshDropdown("program");
              }}
            >
              {programList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{ marginTop: 2 }}
        >
          <Stack sx={{ width: "100%" }}>
            <Typography variant="label">Degree</Typography>
            <MultiSelect
              data={degreeDropDown}
              value={formik.values.degree}
              onChange={(value) => {
                formik.setFieldValue("degree", value);
              }}
              onClear={() => {
                formik.setFieldValue("degree", []);
              }}
            >
              {degreeDropDown.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Typography variant="label">Entry Year</Typography>
            <RangeYearpicker
              value={formik.values.entryYear}
              id="entryYear"
              onChange={(date) => formik.setFieldValue("entryYear", date)}
              clearIcon
            />
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Typography variant="label">Graduation Year</Typography>
            <RangeYearpicker
              value={formik.values.graduationYear}
              id="graduationYear"
              onChange={(date) => formik.setFieldValue("graduationYear", date)}
              clearIcon
            />
          </Stack>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ marginTop: 2 }}>
          <Stack width="100%">
            <Typography variant="label">Graduation Period</Typography>
            <MultiSelect
              data={graduationPeriodDropDown}
              value={formik.values.graduationPeriod}
              onChange={(value) => {
                formik.setFieldValue("graduationPeriod", value);
              }}
              onClear={() => {
                formik.setFieldValue("graduationPeriod", []);
              }}
            >
              {graduationPeriodDropDown.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>

          <Stack
            width="100%"
            sx={{
              marginLeft: { sx: 1, sm: 2, md: 4 },
              visibility: IsARO ? "visible" : "hidden",
            }}
          >
            <Typography variant="label">Last Update</Typography>
            <DatePicker
              value={formik.values.startUpdate}
              id="startUpdate"
              onChange={(dateString) => {
                formik.setFieldValue("startUpdate", dateString);
              }}
              dateFormat="dd-MM-yyyy"
              autoClose
              clearIcon
            />
          </Stack>
          <Box
            component="span"
            sx={{
              marginY: "auto",
              paddingTop: "20px",
              marginX: { sx: 1, sm: "7px", md: "15px" },
              visibility: IsARO ? "visible" : "hidden",
            }}
          >
            -
          </Box>
          <Stack
            width="100%"
            justifyContent="flex-end"
            sx={{ visibility: IsARO ? "visible" : "hidden" }}
          >
            <DatePicker
              value={formik.values.endUpdate}
              id="endUpdate"
              onChange={(dateString) => {
                formik.setFieldValue("endUpdate", dateString);
              }}
              dateFormat="dd-MM-yyyy"
              autoClose
              clearIcon
            />
          </Stack>
        </Stack>
        <Stack sx={{ marginY: "20px" }}>
          <PersonalDataAccordion
            formik={formik}
            checked={personalDataChecked}
            setChecked={setPersonalDataChecked}
          />
          <JobAccordion
            formik={formik}
            checked={jobDataChecked}
            setChecked={setJobDataChecked}
          />
          <DomicileAccordion
            formik={formik}
            checked={domicileDataChecked}
            setChecked={setDomicileDataChecked}
          />
          <ChildAccordion
            formik={formik}
            checked={childDataChecked}
            setChecked={setChildDataChecked}
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <CustomLoadingButton loading={buttonLoading} type="submit" variant="contained">
            Apply
          </CustomLoadingButton>
        </Stack>
      </form>
      <Divider sx={{ marginY: 2 }} />
      <Stack direction="row" gap="20px" justifyContent="flex-end">
        <Tooltip title="Column Visibility">
          <Button
            type="button"
            onClick={() => setOpenColumnVisibility(!openColumnVisibility)}
            sx={{
              minWidth: "30px",
              padding: "0px",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              marginY: "auto",
            }}
            variant="contained"
          >
            <ViewColumnIcon />
          </Button>
        </Tooltip>
        <Typography sx={{ marginY: "auto" }}>Search: </Typography>
        <TextField
          variant="outlined"
          placeholder="Search By"
          onChange={handleSearch}
        />
      </Stack>
      <Backdrop open={openColumnVisibility} sx={{ zIndex: "2" }}>
        <Stack
          sx={{
            background: "white",
            padding: 2,
            borderRadius: 3,
            width: "800px",
            translateX: "240px",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography color="initial" sx={{ fontSize: "26px" }}>
              Column Visibility
            </Typography>
            <Button
              onClick={() => setOpenColumnVisibility(!openColumnVisibility)}
            >
              <CloseIcon />
            </Button>
          </Stack>
          <Divider />
          <FormGroup>
            <Grid container spacing={2} padding={2}>
              {table
                .getAllLeafColumns()
                .filter((column) => {
                  const colDef = column.columnDef as ColumnType;
                  return (
                    column.getCanHide() &&
                    (colDef.toggleable || colDef.toggleable == undefined)
                  );
                })
                .map((column) => {
                  const colDef = column.columnDef as ColumnType;
                  return (
                    <Grid item xs={4} key={column.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            // checked={column.getIsVisible()}
                            // onChange={column.getToggleVisibilityHandler()}
                            checked={visibilityState[column.id]}
                            onChange={() => handleCheckboxChange(column.id)}
                          />
                        }
                        label={colDef.header?.toString()}
                        sx={{
                          "& .binus-FormControlLabel-label": {
                            fontSize: "12px",
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            <Stack direction="row" justifyContent="end" gap="10px">
              <Button
                variant="contained"
                sx={{ background: "#999999" }}
                onClick={() => setOpenColumnVisibility(!openColumnVisibility)}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={applyVisibilityChanges}>
                Apply
              </Button>
            </Stack>
          </FormGroup>
        </Stack>
      </Backdrop>
      <Stack
        direction="column"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          background: "white",
          border: "1px solid #CCC",
          mb: 2,
        }}
      >
        {serverTable}
      </Stack>
      {userProfile?.rolePermissions?.some(permission =>
        permission.permissionName === "export-alumni-data"
      ) && (
          <RequestApproval
            jobDataChecked={jobDataChecked}
            domicileDataChecked={domicileDataChecked}
            childDataChecked={childDataChecked}
            filters={formik}
          />
        )}
    </PageWrapper>
  );
}

ActionCell.propTypes = null;
