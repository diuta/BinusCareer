import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Modal,
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
import { format } from "date-fns";
import _ from "lodash";
import * as React from "react";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import CustomLoadingButton from "../../../components/common/CustomLoadingButton";
import { ModalAlert } from "../../../components/common/modal-alert";
import ServerTableAjax from "../../../components/common/table_ajax/ServerTableAjax";
import PageWrapper from "../../../components/container/PageWrapper";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import useModal from "../../../hooks/use-modal";
import { selectProfile } from "../../../store/profile/selector";
import { layoutPrivateStyle } from "../../../styles/layout/private-routes";
import { ModalAlertImport } from "../component/ModalAlertImport";

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
  dateIn: Date;
  approvalStatusName: string;
  approvalStatusId: number;
  achievementId: number[];
  approvalId: number;
  prominentId: number;
  name: string;
  reason: string;
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
  dateIn: Date,
  approvalStatusName: string,
  approvalStatusId: number,
  achievementId: number[],
  approvalId: number,
  prominentId: number,
  name: string,
  reason: string
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
    dateIn,
    approvalStatusName,
    approvalStatusId,
    achievementId,
    approvalId,
    prominentId,
    name,
    reason,
  };
}

interface CheckboxCellProps {
  row: {
    prominentId: number;
  };
  isSelected: (prominentId: number) => boolean; // Updated parameter name and type
  handleCheckboxClick: (checked: boolean, rowId: number) => void; // Updated parameter name and type
}

function CheckboxCell({
  row,
  isSelected,
  handleCheckboxClick,
}: CheckboxCellProps): JSX.Element {
  const isItemSelected = isSelected(row.prominentId);

  return (
    <Checkbox
      onChange={(e) => handleCheckboxClick(e.target.checked, row.prominentId)}
      checked={isItemSelected}
    />
  );
}
interface CellInfo {
  row: {
    original: {
      prominentId: number;
    };
  };
}
interface CheckboxCellRendererProps extends CellInfo {
  isSelected: (prominentId: number) => boolean;
  handleCheckboxClick: (checked: boolean, rowId: number) => void;
}
function CheckboxCellRenderer({
  row,
  isSelected,
  handleCheckboxClick,
}: CheckboxCellRendererProps): JSX.Element {
  return (
    <CheckboxCell
      row={row.original}
      isSelected={isSelected}
      handleCheckboxClick={handleCheckboxClick}
    />
  );
}

export default function RequestTable() {
  const [data, setData] = useState<Data[]>([]);
  const [originalData, setOriginalData] = useState<Data[]>([]);
  const [approve, setApprove] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [dataPages, setDataPages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecords] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [totalResults, setTotalResults] = useState(0);
  const [loadingSendBack, setLoadingSendBack] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [sendReason, setSendReason] = useState("");
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const userProfile = useSelector(selectProfile);
  const { showModal } = useModal();
  const { binusianId, email, fullName, rolePermissions } = userProfile;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelected([]);
    setApprove(newValue);
  };

  const handleSendReason = (event) => {
    setSendReason(event.target.value);

    if (event.target.value.length <= 0) {
      setError("Reason is required");
    } else {
      setError("");
    }
  };

  const handleBlur = () => {
    if (sendReason.trim() === "") {
      setError("Reason is required");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const selectedData =
    data?.filter((row) => selected.includes(row.prominentId)) || [];
  const selectedNim = [
    ...new Set(selectedData.map((row) => row.alumniId)),
  ].join(", ");

  const uniqueUserInNames = [...new Set(selectedData.map(({ name }) => name))];

  const handleCheckboxClick = (checked: boolean, rowId: number) => {
    if (checked) {
      setSelected((prevSelected) => [...prevSelected, rowId]);
    } else {
      setSelected((prevSelected) => prevSelected.filter((id) => id !== rowId));
    }
  };

  const isSelected = (prominentId: number) => selected.includes(prominentId);

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
        onClick={() => handleClickOpens(row)}
      >
        <VisibilityIcon />
      </Button>
    ),
    [handleClickOpen]
  );

  const hasPermission = (rolePermissions.some(item => item.permissionName === 'approval-prominent'));
  
  const columns = React.useMemo<ColumnDef<Data>[]>(() => {
    const baseColumns: ColumnDef<Data>[] = [
      ...(hasPermission ? [
        {
        id: "select",
        size: 1,
        enableSorting: false,
        cell: (info: CellInfo) =>
          CheckboxCellRenderer({
            ...info,
            isSelected,
            handleCheckboxClick,
          }),
        },
      ]:[]),
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
        accessorKey: "id",
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
    if (snackbarMessage === "Request Data Send Back Success") {
      window.location.reload();
    } else if (snackbarMessage === "Request Data Approved Successfully") {
      window.location.reload();
    }
  };

  const handleSendBack = async () => {
    setIsLoading(true);
    const refId = selectedData?.[0]?.id;
    const approvalId = selectedData?.map((item) => item.approvalId) || [];
    const prominentId = selectedData?.map((item) => item.prominentId) || [];

    const dataSendBack = {
      approvalStatus: approve === 0 ? 1 : approve === 1 ? 2 : approve,
      sendBackReason: sendReason,
      email,
      name: fullName,
      nim: selectedNim,
      refId,
      UserUp: binusianId,
      approvalId,
      ApprovalStatusId: 3,
      prominentId
    };

    if (selected.length > 0) {
      setLoadingSendBack(true);
      try {
        await apiClient.post(ApiService.saveApprovalStatusId, dataSendBack);
        setIsLoading(false)
        setSnackbarMessage("Request Data Send Back Success");
        setSnackbarType("success");
        setSnackbarOpen(true);
      } catch {
        setIsLoading(false)
        setSnackbarMessage("Data Send Back Failed");
        setSnackbarType("failed");
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("Please select at least one data!");
      setSnackbarType("info");
      setSnackbarOpen(true);
    }
    setLoadingSendBack(false);
  };

  const handleApprove = async () => {
    setIsLoading(true);
    const refId = selectedData?.[0]?.id;
    const approvalId = selectedData?.map((item) => item.approvalId) || [];
    const prominentId = selectedData?.map((item) => item.prominentId) || [];
    const dataApprove = {
      email,
      approvalStatus: approve === 0 ? 1 : approve === 1 ? 2 : approve,
      name: fullName,
      nim: selectedNim,
      refId,
      UserUp: binusianId,
      approvalId,
      ApprovalStatusId: 2,
      prominentId,
    };
    if (selected.length > 0) {
      try {
        setLoadingApprove(true);
        await apiClient.post(ApiService.saveApprovalStatusId, dataApprove);
        setIsLoading(false);
        setSnackbarMessage("Request Data Approved Successfully");
        setSnackbarType("success");
        setSnackbarOpen(true);
      } catch {
        setIsLoading(false)
        setSnackbarMessage("Data Approve Failed");
        setSnackbarType("failed");
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("Please select at least one data!");
      setSnackbarType("info");
      setSnackbarOpen(true);
    }
    setLoadingApprove(false);
  };

  const fetchData = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      const dataTemp = {
        approvalStatus: approve === 0 ? 1 : approve === 1 ? 2 : approve,
        approvalStatusIdDTO: [1],
        search: searchValue
      };

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
          new Date(item.dateIn),
          item.approvalStatusName,
          item.approvalStatusId,
          item.achievementId,
          item.approvalId,
          item.prominentId,
          item.name,
          item.reason || "-"
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
    },
    [rowsPerPage, approve, searchValue]
  );

  // useEffect(() => {
  //   fetchData(1, rowsPerPage);
  // }, [approve, fetchData, rowsPerPage, page]);

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
        approvalStatusIdDTO: [1],
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
            new Date(item.dateIn),
            item.approvalStatusName,
            item.approvalStatusId,
            item.achievementId,
            item.approvalId,
            item.prominentId,
            item.name,
            item.reason || "-"
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
      } catch (error_) {
        console.error("Error fetching search results:", error_);
      }
    }, 300),
    [rowsPerPage, originalData]
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

  const handleInputChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    setSearchValue(searchTerm);
    reset(!set);
  }, 1000)

  const navigate = useNavigate();

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Active</Typography>
        <Stack direction="row" alignItems="center" gap="10px">
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

      {approve === 0 ? (
        <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2, marginTop:'20px'}}>
          <Box sx={{ position: 'relative' }}>
              {serverTable}
              <PageWrapper>
                {hasPermission && (
                  <Typography 
                    sx={{ position: 'absolute', left: 16, bottom: 96, fontSize:'12px', fontWeight:400 }}
                  >
                    {selectedData.length} Row Selected
                  </Typography>
                )}
                <Stack direction="row" sx={{ justifyContent: "end" }} gap="30px">
                {rolePermissions.some(item => item.permissionName === 'approval-prominent') && (
                  <>
                    <CustomLoadingButton
                      loading={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : undefined
                      }
                    variant="contained"
                    color="secondary"
                    sx={{
                      ...(selectedData.length > 0
                        ? layoutPrivateStyle.modalChangeButton
                        : {
                            background:
                              selectedData.length === 0
                                ? "lightgray"
                                : "linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)",
                            color:
                              selectedData.length === 0 ? "darkgray" : "white",
                            width: "120px",
                            "&:hover": {
                              background:
                                selectedData.length === 0
                                  ? "gray"
                                  : "linear-gradient(180deg, rgba(241,135,0,0.8) 31%, rgba(243,159,51,0.8) 100%)",
                            },
                          }),
                      width: "120px",
                    }}
                    size="medium"
                    onClick={handleOpen}
                    disabled={selectedData.length === 0 || isLoading}
                  >
                    <Typography
                      sx={{
                        fontWeight: selectedData.length === 0 ? "400" : "600",
                        fontSize: "13px",
                      }}
                    >
                      {isLoading === true ? "Loading..." : "Send Back"}
                    </Typography>
                  </CustomLoadingButton>
                  <CustomLoadingButton
                    loading={isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : undefined
                    }
                    variant="contained"
                    sx={{
                      background:
                        selectedData.length === 0
                          ? "lightgray"
                          : "linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)",
                      color: selectedData.length === 0 ? "darkgray" : "white",
                      width: "120px",
                      "&:hover": {
                        background:
                          selectedData.length === 0
                            ? "gray"
                            : "linear-gradient(180deg, rgba(241,135,0,0.8) 31%, rgba(243,159,51,0.8) 100%)",
                      },
                    }}
                    size="medium"
                    onClick={() => setOpenModal(true)}
                    disabled={
                      selectedData.length === 0 || loadingApprove === true
                    }
                  >
                    <Typography
                      sx={{
                        fontWeight: selectedData.length === 0 ? "400" : "600",
                        fontSize: "13px",
                      }}
                    >
                      {loadingApprove ? "Loading..." : "Approve"}
                    </Typography>
                    <ModalAlertImport
                      variant="info"
                      title="Approval Confirmation"
                      message="Are you sure want to approve this data?"
                      buttonTitle="Confirm"
                      cancelButton
                      open={openModal}
                      onOk={() => handleApprove()}
                      onClose={() => setOpenModal(false)}
                    />
                    </CustomLoadingButton>
                  </>
                )}
                {open && (
                  <Modal open={open} onClose={handleClose}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: "8px",
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                          Send Back Reason
                        </Typography>
                      </Stack>
                      <Divider
                        sx={{ marginTop: "10px", marginBottom: "10px" }}
                      />
                      <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>
                        Dear {uniqueUserInNames.join(", ")}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          multiline
                          fullWidth
                          variant="outlined"
                          placeholder="Enter reason..."
                          name="sendReason"
                          value={sendReason}
                          onChange={handleSendReason}
                          onBlur={handleBlur}
                          error={Boolean(error)}
                          helperText={error}
                        />
                      </Box>
                      <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>
                        Regards,
                        <br />
                        ARO
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        gap="20px"
                        sx={{ width: "100%", marginTop: "20px" }}
                      >
                        <Box>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              ...layoutPrivateStyle.modalChangeButton,
                              width: "100px",
                            }}
                            size="medium"
                            onClick={handleClose}
                          >
                            <Typography
                              sx={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              Cancel
                            </Typography>
                          </Button>
                        </Box>
                        <Box>
                          <CustomLoadingButton
                            loading={isLoading}
                            startIcon={
                              isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : undefined
                            }
                            variant="contained"
                            color="primary"
                            sx={{
                              ...layoutPrivateStyle.modalChangeButton,
                              width: "120px",
                            }}
                            size="medium"
                            type="submit"
                            onClick={handleSendBack}
                          >
                            <Typography
                              sx={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              {isLoading ? "Loading..." : "Save"}
                            </Typography>
                          </CustomLoadingButton>
                        </Box>
                      </Stack>
                    </Box>
                  </Modal>
                )}
                </Stack>
              </PageWrapper>
          </Box>
        </Stack>
      ) : (
        <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2, marginTop:'20px'}}>
        <Box sx={{ position:"relative" }}>
            {serverTable}
            <PageWrapper>
              {hasPermission && (
                <Typography 
                  sx={{ position: 'absolute', left: 16, bottom: 96, fontSize:'12px', fontWeight:400 }}
                >
                  {selectedData.length} Row Selected
                </Typography>
              )}
              <Stack direction="row" sx={{ justifyContent: "end" }} gap="30px">
                <CustomLoadingButton
                  loading={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : undefined
                  }
                  variant="contained"
                  color="secondary"
                  sx={{
                    ...(selectedData.length > 0
                      ? layoutPrivateStyle.modalChangeButton
                      : {
                          background:
                            selectedData.length === 0
                              ? "lightgray"
                              : "linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)",
                          color:
                            selectedData.length === 0 ? "darkgray" : "white",
                          width: "120px",
                          "&:hover": {
                            background:
                              selectedData.length === 0
                                ? "gray"
                                : "linear-gradient(180deg, rgba(241,135,0,0.8) 31%, rgba(243,159,51,0.8) 100%)",
                          },
                        }),
                    width: "120px",
                  }}
                  size="medium"
                  onClick={handleOpen}
                  disabled={selectedData.length === 0 || isLoading}
                >
                  <Typography
                    sx={{
                      fontWeight: selectedData.length === 0 ? "400" : "600",
                      fontSize: "13px",
                    }}
                  >
                    {isLoading === true ? "Loading..." : "Send Back"}
                  </Typography>
                </CustomLoadingButton>
                {open && (
                  <Modal open={open} onClose={handleClose}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: "8px",
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                          Send Back Reason
                        </Typography>
                      </Stack>
                      <Divider
                        sx={{ marginTop: "10px", marginBottom: "10px" }}
                      />
                      <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>
                        Dear {uniqueUserInNames.join(", ")}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          multiline
                          fullWidth
                          variant="outlined"
                          placeholder="Enter reason..."
                          name="sendReason"
                          value={sendReason}
                          onChange={handleSendReason}
                          onBlur={handleBlur}
                          error={Boolean(error)}
                          helperText={error}
                        />
                      </Box>
                      <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>
                        Regards,
                        <br />
                        ARO
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        gap="20px"
                        sx={{ width: "100%", marginTop: "20px" }}
                      >
                        <Box>
                          <CustomLoadingButton
                            loading={isLoading}
                            startIcon={
                              isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : undefined
                            }
                            variant="contained"
                            color="secondary"
                            sx={{
                              ...layoutPrivateStyle.modalChangeButton,
                              width: "100px",
                            }}
                            size="medium"
                            onClick={handleClose}
                            disabled={selectedData.length === 0 || isLoading}
                          >
                            <Typography
                              sx={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              Cancel
                            </Typography>
                          </CustomLoadingButton>
                        </Box>
                        <Box>
                          <CustomLoadingButton
                            loading={isLoading}
                            startIcon={
                              isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : undefined
                            }
                            variant="contained"
                            color="primary"
                            sx={{
                              ...layoutPrivateStyle.modalChangeButton,
                              width: "120px",
                            }}
                            size="medium"
                            type="submit"
                            onClick={handleSendBack}
                            disabled={selectedData.length === 0 || isLoading}
                          >
                            <Typography
                              sx={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              {isLoading ? "Loading..." : "Save"}
                            </Typography>
                          </CustomLoadingButton>
                        </Box>
                      </Stack>
                    </Box>
                  </Modal>
                )}
                <CustomLoadingButton
                  loading={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : undefined
                  }
                  variant="contained"
                  sx={{
                    background:
                      selectedData.length === 0
                        ? "lightgray"
                        : "linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)",
                    color: selectedData.length === 0 ? "darkgray" : "white",
                    width: "120px",
                    "&:hover": {
                      background:
                        selectedData.length === 0
                          ? "gray"
                          : "linear-gradient(180deg, rgba(241,135,0,0.8) 31%, rgba(243,159,51,0.8) 100%)",
                    },
                  }}
                  size="medium"
                  onClick={() => setOpenModal(true)}
                  disabled={
                    selectedData.length === 0 || loadingApprove === true
                  }
                >
                  <Typography
                    sx={{
                      fontWeight: selectedData.length === 0 ? "400" : "600",
                      fontSize: "13px",
                    }}
                  >
                    {loadingApprove ? "Loading..." : "Approve"}
                  </Typography>
                  <ModalAlertImport
                    variant="info"
                    title="Approval Confirmation"
                    message="Are you sure want to approve this data?"
                    buttonTitle="Confirm"
                    cancelButton
                    open={openModal}
                    onOk={() => handleApprove()}
                    onClose={() => setOpenModal(false)}
                  />
                </CustomLoadingButton>
              </Stack>
            </PageWrapper>
        </Box>
        </Stack>
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
