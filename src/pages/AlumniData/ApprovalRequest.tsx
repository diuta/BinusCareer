import { useState, useCallback } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { ApiService } from "../../constants/ApiService";
import apiClient from "../../config/api-client";
import qs from "qs";
import {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import PageWrapper from "../../components/container/PageWrapper";
import DatePicker from "../../components/common/Datepicker";
import {
  RequestApprovalData,
  RequestApprovalFilters,
} from "./Interface/RequestApprovalInterface";

import ServerTableAjax from "../../components/common/table_ajax/ServerTableAjax";
import UnitNameBackdrop from "./Components/UnitNameBackdrop";
import { RiFolderReceivedFill } from "react-icons/ri";
import { useDebouncedCallback } from "use-debounce";

import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profile/selector";

type ColumnType = ColumnDef<RequestApprovalData>;

const getColumns = (openUnitName, activeTab): ColumnType[] => {
  const columns: ColumnType[] = [
    {
      accessorKey: "requestor",
      header: "Requestor",
    },
    {
      accessorKey: "binusianId",
      header: "BinusianId",
    },
    {
      header: "Unit Name",
      cell: ({ row }) => {
        const rowApprovalId = row.original.approvalId; // Adjust based on your row data structure
        return (
          <Stack
            direction="row"
            gap="10px"
            display="flex"
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={() => openUnitName(rowApprovalId)}
              sx={{ width: "150px", zIndex: 0, fontSize: "13px" }}
            >
              View Details
            </Button>
          </Stack>
        );
      },
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "requestDate",
      header: "Request Date",
      cell: ({ getValue }) => {
        const dateValue = getValue() as string;
        const formattedDate = new Date(dateValue).toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return formattedDate;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      header: "Action",
      cell: ({ row }) => <ActionCell row={row} />,
    },
  ];

  if (activeTab === "history") {
    columns.splice(-1, 0, {
      accessorKey: "sendBackReason",
      header: "Send Back Reason",
    });
  }

  return columns;
};

function ActionCell({ row }) {
  const Navigate = useNavigate();

  const editCell = () => {
    Navigate(`/approval-request/${row.original.approvalId}`);
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
        <VisibilityIcon />
      </Button>
    </Stack>
  );
}

export function ApprovalRequest() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [set, reset] = useState(false);

  const [data, setData] = useState<RequestApprovalData[]>([]);
  const [originalData, setOriginalData] = useState<RequestApprovalData[]>([]);
  const userProfile = useSelector(selectProfile);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openUnitName, setOpenUnitName] = useState(false);
  const [currentApprovalId, setCurrentApprovalId] = useState<string | null>(
    null
  );

  const handleOpenUnitName = (approvalId: string) => {
    setCurrentApprovalId(approvalId);
    setOpenUnitName(true);
  };

  const handleCloseUnitName = () => {
    setOpenUnitName(false);
    setCurrentApprovalId(null);
  };

  const columns = getColumns(handleOpenUnitName, activeTab);
  const [rowCount, setRowCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [queryString, setQueryString] = useState<string>("");
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setDataWatcher(!dataWatcher);
  };

  const formik = useFormik<RequestApprovalFilters>({
    initialValues: {
      startDate: null,
      endDate: null,
    },
    onSubmit: async (values) => {
      setDataWatcher(!dataWatcher);
    },
  });

  const getApprovalByFilter = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      const param = {
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        tableTab: activeTab,
      };
      const url = `${ApiService.requestApproval}?${query}&${qs.stringify(
        param
      )}`;
      const response = await apiClient.get(url).then((e) => e.data);

      const fetchedData = response.data;

      setData(fetchedData);
      setOriginalData(fetchedData);
      setRowCount(response.dataCount);
      setQueryString(query);
      if (page) setPagination(page);
      if (sort) setSorting(sort);
    },
    [dataWatcher]
  );

  const serverTable = ServerTableAjax<RequestApprovalData>({
    data,
    columns,
    rowCount,
    page: pagination,
    sort: sorting,
    isMultiSort: false,
    onTableChange: getApprovalByFilter,
    pageReset: set,
    search: searchTerm,
  });

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const search = e.target.value.toLowerCase();
      setSearchTerm(search);
      reset(!set);
    },
    1000
  );

  const handleExport = async () => {
    const response = await apiClient.get(
      `${ApiService.requestApproval}/export`,
      {
        params: {
          startPeriod: formik.values.startDate,
          endPeriod: formik.values.endDate,
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a link element, set its href to the blob URL, and trigger download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "Approvals.xlsx"); // Set the file name
    document.body.append(link);
    link.click();

    // Clean up by removing the link element and revoking the blob URL
    link.remove(); // Use `remove` instead of `removeChild`
    URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper>
      {activeTab === "history" && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack direction="row" gap="10px">
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="body1" gutterBottom fontSize="12px">
                Start Period
              </Typography>
              <DatePicker
                value={formik.values.startDate}
                id="startDate"
                onChange={(dateString) => {
                  formik.setFieldValue("startDate", dateString);
                }}
                dateFormat="dd-MM-yyyy"
                autoClose
                clearIcon
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="body1" style={{ marginTop: "25px" }}>
                -
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="body1" gutterBottom fontSize="12px">
                End Period
              </Typography>
              <DatePicker
                value={formik.values.endDate}
                id="endDate"
                onChange={(dateString) => {
                  formik.setFieldValue("endDate", dateString);
                }}
                dateFormat="dd-MM-yyyy"
                autoClose
                clearIcon
              />
            </Box>

            <Box display="flex" alignItems="center" alignSelf="flex-end">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#F57C00",
                  color: "#fff",
                  fontSize: "13px",
                }}
                onClick={() => setDataWatcher(!dataWatcher)}
              >
                Search
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}

      {activeTab === "history" && <Divider style={{ margin: "20px 0" }} />}

      <Stack sx={{ mx: "auto", width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          sx={{ mx: "auto" }}
        >
          <Stack width="100%">
            <Stack
              direction="row"
              justifyContent="space-between"
              display="flex"
              width="100%"
            >
              <Stack
                sx={{
                  my: "auto",
                  display: activeTab == "history" ? "visible" : "hidden",
                }}
              >
                {userProfile?.rolePermissions?.some(permission =>
                  permission.permissionName === "export-approval-request-data"
                ) && (
                    <Button
                      variant="contained"
                      startIcon={
                        <RiFolderReceivedFill style={{ transform: "scaleX(-1)" }} />
                      }
                      sx={{
                        backgroundColor: "green",
                        background:
                          "linear-gradient(45deg, green 100%, green 100%)",
                        paddingX: "20px",
                        fontSize: "13px",
                        display: activeTab == "history" ? "visible" : "none",
                      }}
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                  )}
              </Stack>
              <Stack direction="row">
                <Typography sx={{ marginY: "auto" }}>Search: </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Search By"
                  onChange={handleSearch}
                />
              </Stack>
            </Stack>
            <Stack
              direction="row"
              sx={{
                marginTop: "18px",
                marginBottom: 0,
                borderBottom: "2px solid #F57C00",
              }}
              gap="1px"
            >
              <Button
                variant="text"
                onClick={() => handleTabChange("active")}
                sx={{
                  backgroundColor:
                    activeTab === "active" ? "#F57C00" : "#d7d7d7",
                  color: activeTab === "active" ? "#fff" : "#000",
                  borderRadius: "5px 5px 0px 0px",
                  fontSize: "12px",
                  fontWeight: 400,
                  "&:hover": {
                    backgroundColor:
                      activeTab === "active" ? "#F57C00" : "#d7d7d7",
                    boxShadow: "none",
                  },
                }}
              >
                Active
              </Button>
              <Button
                variant="text"
                onClick={() => handleTabChange("history")}
                sx={{
                  backgroundColor:
                    activeTab === "history" ? "#F57C00" : "#d7d7d7",
                  color: activeTab === "history" ? "#fff" : "#000",
                  borderRadius: "5px 5px 0px 0px",
                  fontSize: "12px",
                  fontWeight: 400,
                  "&:hover": {
                    backgroundColor:
                      activeTab === "history" ? "#F57C00" : "#d7d7d7",
                    boxShadow: "none",
                  },
                }}
              >
                History
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
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

      <UnitNameBackdrop
        open={openUnitName}
        onClose={handleCloseUnitName}
        approvalId={currentApprovalId || ""}
      />
    </PageWrapper>
  );
}

ActionCell.propTypes = null;
