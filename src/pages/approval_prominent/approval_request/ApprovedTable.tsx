import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { format, parse } from "date-fns";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { BiSolidFileExport } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import * as XLSX from "xlsx";

import CustomLoadingButton from "../../../components/common/CustomLoadingButton";
import Datepicker from "../../../components/common/Datepicker";
import { ModalAlert } from "../../../components/common/modal-alert";
import ServerTableAjax from "../../../components/common/table_ajax/ServerTableAjax";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import { selectProfile } from "../../../store/profile/selector";
import { IExportData, IRowData } from "../interface/IListProminent";

type Data = {
  id: number;
  alumniId: string;
  alumniName: string;
  campusName: string;
  programName: string;
  facultyName: string;
  degreeName: string;
  date: Date;
  period: Date;
  approvalStatusName: string;
  status: string;

  approvalStatusId: number;
  achievementId: number[];
  approvalId: number;
  prominentId: number;
  achievement: string[];
  achievementCategory: string[];
  path: string[];
  binusSupport: string[];
  actionTypeName: string[];
  reason: string;
  dateIn: Date;
  sendBackReason: string;
  name: string;
};

function createData(
  id: number,
  alumniId: string,
  alumniName: string,
  campusName: string,
  programName: string,
  facultyName: string,
  degreeName: string,
  date: Date,
  period: Date,
  approvalStatusName: string,
  status: string,
  approvalStatusId: number,
  achievementId: number[],
  approvalId: number,
  prominentId: number,
  achievement: string[],
  achievementCategory: string[],
  path: string[],
  binusSupport: string[],
  actionTypeName: string[],
  reason: string,
  dateIn: Date,
  sendBackReason: string,
  name: string
): Data {
  return {
    id,
    alumniId,
    alumniName,
    campusName,
    programName,
    facultyName,
    degreeName,
    date,
    period,
    approvalStatusName,
    status,
    dateIn,
    approvalStatusId,
    achievementId,
    approvalId,
    prominentId,
    achievement,
    achievementCategory,
    path,
    binusSupport,
    actionTypeName,
    reason,
    sendBackReason,
    name,
  };
}

function createExportData(
  item : IExportData,
  achievementEvidence : string,
  index : number,
  header : string,
  ) {
  return {
      Periode: item.period
      ? format(new Date(item.period), "dd/MM/yyyy")
      : "Invalid Date",
      Date: item.date
      ? format(new Date(item.date), "dd/MM/yyyy")
      : "Invalid Date",
      NIM: item.nim || "",
      Name: item.name || "",
      Campus: item.campus || "",
      Faculty: item.faculty || "",
      Program: item.program || "",
      Degree: item.degree || "",
      "Achievement Category": header === "Achievement" ? item.achievement?.[index].achievementCategory : "",
      Achievement: header === "Achievement" ? item.achievement?.[index].achievementName : "",
      "Achievement Evidence": header === "Achievement" ? achievementEvidence : "",
      "Binus Support": header === "Binus Support" ? item.binusSupport?.[index] : "",
      Status: item.status|| "",
      "Action Type": item.actionType || "",
      Reason: item.reason || "",
      "Send Back Reason": item.sendBackReason || "",
      "Requested By" : item.requestedBy || "",
      "Requested Date": format(item.requestedDate, 'yyyy-MM-dd HH:mm')|| "",
  };
}

function convertToUTC(date: Date): string {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  const localOffset = localDate.getTimezoneOffset() * 60_000;
  const utcDate = new Date(localDate.getTime() - localOffset);
  return utcDate.toISOString();
}

export default function RequestTable() {
  const [data, setData] = useState<Data[]>([]);
  const [originalData, setOriginalData] = useState<Data[]>([]);
  const [approve, setApprove] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [dataPages, setDataPages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecords] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [totalResults, setTotalResults] = useState(0);
  const [loadingApply, setLoadingApply] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [endPeriod, setEndPeriod] = useState<Date | null>(null);
  const [startPeriod, setStartPeriod] = useState<Date | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [exportData, setExportData] = useState<IExportData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tempStartPeriod, setTempStartPeriod] = useState<any>("");
  const [tempEndPeriod, setTempEndPeriod] = useState<any>("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelected([]);
    setApprove(newValue);
  };

  const handleApply = () => {
    setStartPeriod(parse(tempStartPeriod, 'dd-MM-yyyy', new Date()));
    setEndPeriod(parse(tempEndPeriod, 'dd-MM-yyyy', new Date()));
    reset(!set);
    // fetchData("");
  };

  const handleTempStartPeriod = (date) => {
    setTempStartPeriod(date);
  };

  const handleTempEndPeriod = (date) => {
    setTempEndPeriod(date);
  };

  const handleClickOpen = (row: Data) => {
    const approvalStatus = approve === 0 ? 1 : approve === 1 ? 2 : approve;
    const { achievementId, id, approvalStatusId, prominentId } = row;
    const refIdStr =
      achievementId && achievementId.length > 0 ? achievementId.join(",") : "";

    const url = `${prominentId}`;
    navigate(url);
  };

  const EditTableButton = useCallback(
    (row: Data, handleClickOpens: (row: Data) => void) => (
      <Button
        variant="contained"
        sx={{
          borderRadius: "999px",
          width: "36px",
          height: "36px",
          minWidth: "fit-content",
          padding: 0,
        }}
        onClick={() => {
          handleClickOpens(row)
        }}
      >
        <VisibilityIcon />
      </Button>
    ),
    [handleClickOpen]
  );

  const columns = React.useMemo<ColumnDef<Data>[]>(() => {
    const baseColumns: ColumnDef<Data>[] = [
      {
        accessorKey: "period",
        header: "Period",
        cell: (info) => {
          const value = info.getValue() as string;
          const dateValue = new Date(value);
          return !isNaN(dateValue.getTime())
            ? dateValue.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Invalid Date";
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => {
          const value = info.getValue() as string;
          const dateValue = new Date(value);
          return !isNaN(dateValue.getTime())
            ? dateValue.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Invalid Date";
        },
      },
      {
        accessorKey: "alumniId",
        header: "NIM",
        size: 1,
      },
      {
        accessorKey: "alumniName",
        header: "Name",
      },
      {
        accessorKey: "campusName",
        header: "Campus",
      },
      {
        accessorKey: "facultyName",
        header: "Faculty",
      },
      {
        accessorKey: "programName",
        header: "Program",
      },
      {
        accessorKey: "degreeName",
        header: "Degree",
      },
      {
        accessorKey: "dateIn",
        header: "Requested Date",
        cell: (info) => {
          const value = info.getValue() as string;
          const dateValue = new Date(value);

          // Check if the date is valid
          return !isNaN(dateValue.getTime())
            ? format(dateValue, 'dd LLLL yyyy, HH:mm')
            : "Invalid Date";
        },
      },
      {
        accessorKey: "name",
        header: "Requested By",
      },
    ];

    if (approve === 1) {
      baseColumns.push({
        accessorKey: "reason",
        header: "Reason",
      });
    }

    baseColumns.push(
      {
        accessorKey: "approvalStatusName",
        header: "Status",
      },
      {
        accessorKey: "sendBackReason",
        header: "Send Back Reason",
      },
      {
        accessorKey: "prominentId",
        header: "Detail",
        size: 1,
        enableSorting: false,
        cell: (info) => EditTableButton(info.row.original, handleClickOpen),
      }
    );

    return baseColumns;
  }, [approve, EditTableButton, rowsPerPage]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const fetchData = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      if ((startPeriod && !endPeriod) || (!startPeriod && endPeriod)) {
        setSnackbarMessage("Please fill both startPeriod and endPeriod");
        setSnackbarType("info");
        setSnackbarOpen(true);
        return;
      }
      const dataTemp = {
        approvalStatus: approve === 0 ? 1 : approve === 1 ? 2 : approve,
        approvalStatusIdDTO: [2, 3],
        search: searchValue,
        end: endPeriod ? convertToUTC(endPeriod) : undefined,
        start: startPeriod ? convertToUTC(startPeriod) : undefined,
      };
      try {
        setLoadingApply(true);
        const response = await apiClient.post(
          `${ApiService.getProminentList}?${query}`,
          dataTemp
        );

        const { totalCount, data: responseData } = response.data;

        const formattedData = responseData.map((item) =>
          createData(
            item.id,
            item.alumniId,
            item.alumniName,
            item.campusName,
            item.programName,
            item.facultyName,
            item.degreeName,
            new Date(item.date),
            new Date(item.period),
            item.approvalStatusName,
            item.status,
            item.approvalStatusId,
            item.achievementId,
            item.approvalId,
            item.prominentId,
            item.achievement,
            item.achievementCategory,
            item.path,
            item.binusSupport,
            item.actionTypeName,
            item.reason || "-",
            new Date(item.dateIn),
            item.sendBackReason || "-",
            item.name
          )
        );

        setDataPages((prevDataPages) => ({
          ...prevDataPages,
          [pagination.pageIndex]: formattedData,
        }));

        setOriginalData(formattedData);
        setData(formattedData);
        setTotalRecords(totalCount);
        setTotalResults(totalCount);

        if (page) setPagination(page);
        if (sort) setSorting(sort);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoadingApply(false);
    },
    [rowsPerPage, approve, startPeriod, endPeriod, searchValue]
  );

  const [set, reset] = useState(false);

  const serverTable = ServerTableAjax<Data>({
    data,
    columns,
    rowCount: totalResults,
    page: pagination,
    sort: sorting,
    isMultiSort: true,
    onTableChange: fetchData,
    pageReset: set,
    search: searchValue,
  });

  const userProfile = useSelector(selectProfile);

  const { email, fullName, rolePermissions } = userProfile;

  const handleSearch = useCallback(
    _.debounce(async (value) => {
      if (!value) {
        setData(originalData);
        setDataPages({ 1: originalData });
        setTotalRecords(originalData.length);
        setCurrentPage(1);
        return;
      }

      const searchParams = {
        search: value,
        approvalStatus: approve === 0 ? 1 : approve === 1 ? 2 : approve,
        approvalStatusIdDTO: [2, 3],
        pageNumber: 1,
        pageSize: rowsPerPage,
      };

      try {
        const response = await apiClient.post(
          ApiService.getProminentList,
          searchParams,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const { data: fetchedData, totalCount } = response.data;

        const formattedData = fetchedData.map((item) =>
          createData(
            item.id,
            item.alumniId,
            item.alumniName,
            item.campusName,
            item.programName,
            item.facultyName,
            item.degreeName,
            new Date(item.date),
            new Date(item.period),
            item.approvalStatusName,
            item.status,
            item.approvalStatusId,
            item.achievementId,
            item.approvalId,
            item.prominentId,
            item.achievement,
            item.achievementCategory,
            item.path,
            item.binusSupport,
            item.actionTypeName,
            item.reason || "-",
            new Date(item.dateIn),
            item.sendBackReason || "-",
            item.name
          )
        );

        if (Array.isArray(formattedData) && formattedData.length > 0) {
          setData(formattedData);
          setDataPages((prevPages) => ({ ...prevPages, 1: formattedData }));
          setTotalRecords(totalCount);
          setCurrentPage(1);
          const allSelectedIds = formattedData.map((item) => item.id);
          setSelected(allSelectedIds);
        } else {
          setData([]);
          setDataPages({ 1: [] });
          setTotalRecords(0);
          setSelected([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 300),
    [rowsPerPage, originalData]
  );

  useEffect(() => {
    if(rolePermissions.some(item => item.permissionName === 'export-approval-prominent')){
      getDataForExport(pagination.pageIndex);
    }
  }, [endPeriod, startPeriod]);

  const getDataForExport = async (pageNumber: number) => {
    setLoadingExport(true);
    const pageData = dataPages[pageNumber] || [];

    const dataTemp = {
      userEmail: email,
      userName: fullName,
      approvalStatus: approve === 0 ? 1 : approve === 1 ? 2 : approve,
      end: endPeriod ? convertToUTC(endPeriod) : undefined,
      start: startPeriod ? convertToUTC(startPeriod) : undefined,
    };

    const response = await apiClient.get(`${ApiService.exportExcel}?start=${tempStartPeriod || ""}&end=${tempEndPeriod || ""}`);
    setExportData(response.data);
    setLoadingExport(false);
  };

  const handleExport = () => {
    setLoadingExport(true);
    if (exportData.length > 0) {
      try {
        const transformedData: IRowData[] = [];

        exportData.forEach((item, index) => {
          const achievementCount = item.achievement.length;
    
                for (let i = 0; i < achievementCount; i+=1) {
                  const achievementEvidence =
                      item.achievement?.[i].achievementEvidence?.map((p) => `\u2022 ${p.evidence}`).join("\n") || "";
                  transformedData.push(createExportData(item, achievementEvidence, i, "Achievement"));
                }
                for (let i = 0; i < item.binusSupport.length; i+=1) {
                  transformedData.push(createExportData(item, "", i, "Binus Support"));
                }
        });

        const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(transformedData);
    
            const wrapTextStyle = {
                alignment: {
                wrapText: true,
                },
            };
    
            for (let R = 1; R <= transformedData.length; R+=1) {
                const cell = ws[XLSX.utils.encode_cell({ r: R, c: 10 })];
                if (cell) {
                cell.s = wrapTextStyle;
                }
            }
    
            const colWidths = transformedData.reduce((acc: any, row: any) => {
                Object.keys(row).forEach((key, index) => {
                const value = row[key] ? row[key].toString() : "";
                acc[index] = Math.max(acc[index] || 10, value.length + 2);
                });
                return acc;
            }, []);
    
            ws["!cols"] = colWidths.map((w: number) => ({ wch: w }));
    
            XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    
            XLSX.writeFile(wb, "approval_prominent.xlsx");

        setSnackbarMessage("Export Successful!");
        setSnackbarType("success");
        setSnackbarOpen(true);
      } catch {
        setSnackbarMessage("Export failed. Please try again.");
        setSnackbarType("failed");
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("Please select at least one data!");
      setSnackbarType("info");
      setSnackbarOpen(true);
    }

    setLoadingExport(false);
  };

  const handleInputChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchTerm = e.target.value.trim().toLocaleLowerCase();
    setSearchValue(searchTerm);
    reset(!set);
  }, 1000);

  const navigate = useNavigate();

  return (
    <Stack>
      <Typography variant="h6">History</Typography>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack
          direction="row"
          gap="10px"
          alignItems="flex-end"
          margin="15px 0px"
        >
          <Stack gap="10px">
            <Typography fontSize="12px">Start Period</Typography>
            <Datepicker
              value={tempStartPeriod}
              onChange={handleTempStartPeriod}
              id="startPeriod"
              dateFormat="dd-MM-yyyy"
              autoClose
              clearIcon
            />
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ paddingBottom: "10px" }}
          >
            <Typography fontWeight={700}>-</Typography>
          </Stack>
          <Stack gap="10px">
            <Typography fontSize="12px">End Period</Typography>
            <Datepicker
              value={tempEndPeriod}
              onChange={handleTempEndPeriod}
              id="endPeriod"
              dateFormat="dd-MM-yyyy"
              autoClose
              clearIcon
            />
          </Stack>
          <CustomLoadingButton
            loading={loadingApply}
            onClick={handleApply}
            color="primary"
            sx={{ width: "100px" }}
          >
            <Typography fontSize="13px" fontWeight="600">
              Search
            </Typography>
          </CustomLoadingButton>
        </Stack>
      </Stack>

      <Divider sx={{ marginY: "20px" }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="10px"
        margin="15px 0px"
      >
        {rolePermissions.some(item => item.permissionName === 'export-approval-prominent') && (
          <CustomLoadingButton
            color="success"
            loading={loadingExport}
            startIcon={<BiSolidFileExport />}
            onClick={() => handleExport()}
            sx={{ width: "110px" }}
          >
            <Typography fontWeight="600" fontSize="13px">
              Export
            </Typography>
          </CustomLoadingButton>
        )}
        <Box sx={{flexGrow:1}}/>
        <Stack direction="row" gap="10px" alignItems="center">
          <Typography fontSize="14px">Search:</Typography>
          <TextField
            variant="outlined"
            placeholder="Search By"
            onChange={handleInputChange}
          />
        </Stack>
      </Stack>
      <Stack direction="row" gap="2px">
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              borderBottom: 3,
              borderColor: "primary.main",
              marginBottom: "-20px",
            }}
          >
            <Tabs
              value={approve}
              onChange={handleTabChange}
              variant="standard"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                "& button": {
                  marginRight: "1px",
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                },
                "& .MuiTab-root": {
                  backgroundColor: "lightgray",
                  color: "black",
                },
                "& .Mui-selected": {
                  color: "white !important",
                  backgroundColor: "primary.main",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab
                label="Add Data"
                sx={{
                  backgroundColor: approve !== 0 ? "lightgray" : "primary.main",
                  fontSize: "12px",
                }}
              />
              <Tab
                label="Edit Data"
                sx={{
                  backgroundColor: approve !== 1 ? "lightgray" : "primary.main",
                  fontSize: "12px",
                }}
              />
            </Tabs>
          </Box>
        </Box>
      </Stack>

      {approve === 1 ? (
        <Box sx={{ width: "100%" }} marginTop="20px">
          <Paper sx={{ width: "100%", mb: 2, pb: 1 }}>{serverTable}</Paper>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }} marginTop="20px">
          <Paper sx={{ width: "100%", mb: 2, pb: 1 }}>{serverTable}</Paper>
        </Box>
      )}
      <ModalAlert
        open={snackbarOpen}
        variant={snackbarType}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
        onOk={handleCloseSnackbar}
      />
    </Stack>
  );
}
