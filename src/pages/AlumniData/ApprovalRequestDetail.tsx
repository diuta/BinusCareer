import { useState, useMemo, useCallback, useEffect } from "react";
import { useFormik, FormikErrors } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
  Stepper,
  Step,
  CircularProgress,
  StepLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Backdrop,
  Select,
  MenuItem,
  Pagination,
  Grid,
} from "@mui/material";
import { ApiService } from "../../constants/ApiService";
import apiClient from "../../config/api-client";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import PageWrapper from "../../components/container/PageWrapper";
import {
  RequestApprovalFilters,
  RequestApprovalDetailData,
  RequestDetailAlumniData,
} from "./Interface/RequestApprovalInterface";
import UnitNameBackdrop from "./Components/UnitNameBackdrop";
import SendBackBackdrop from "./Components/SendBackBackdrop";
import { ModalAlert } from "../../components/common/modal-alert";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profile/selector";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import useModal from "../../hooks/use-modal";
import { RiFileExcel2Fill } from "react-icons/ri";
import axios from "axios";

type ColumnType = ColumnDef<RequestDetailAlumniData>;

type StepLabel = {
  label: string;
  subLabel: string;
  date: string;
};

const getColumns = (data: RequestDetailAlumniData[]): ColumnType[] => {
  const columns: ColumnType[] = [
    {
      accessorKey: "nim",
      header: "NIM",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "campus",
      header: "Campus",
    },
    {
      accessorKey: "faculty",
      header: "Faculty",
    },
    {
      accessorKey: "program",
      header: "Program",
    },
    {
      accessorKey: "entryYear",
      header: "Entry Year",
    },
    {
      accessorKey: "graduationYear",
      header: "Graduation Year",
    },
  ];

  if (data.some((row) => row.phoneNumber != null)) {
    columns.push({
      accessorKey: "phoneNumber",
      header: "Phone Number",
    });
  }

  if (data.some((row) => row.email != null)) {
    columns.push({
      accessorKey: "email",
      header: "Email",
    });
  }

  if (data.some((row) => row.dateOfBirth != null)) {
    columns.push({
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => {
        const date = row.original.dateOfBirth;
        return date
          ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "";
      },
    });
  }

  if (data.some((row) => row.placeOfBirth != null)) {
    columns.push({
      accessorKey: "placeOfBirth",
      header: "Place of Birth",
    });
  }

  if (data.some((row) => row.ipk != null)) {
    columns.push({
      accessorKey: "ipk",
      header: "IPK",
    });
  }

  return columns;
};

function CustomStepIcon() {
  return (
    <CancelIcon
      sx={{
        width: "24px",
        height: "24px",
      }}
      viewBox="2 2 20 20"
    />
  );
}

export function ApprovalRequestDetail() {
  const { approvalId = "" } = useParams();
  const Navigate = useNavigate();
  const userProfile = useSelector(selectProfile);
  const { showModal } = useModal();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [data, setData] = useState<RequestDetailAlumniData[]>([]);
  const [originalData, setOriginalData] = useState<RequestDetailAlumniData[]>(
    []
  );

  const [requestDetail, setRequestDetail] =
    useState<RequestApprovalDetailData>();
  const [openUnitName, setOpenUnitName] = useState(false);
  const [openSendBack, setOpenSendBack] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => getColumns(data), [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  });

  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [steps, setSteps] = useState<StepLabel[]>([]);
  const [activeStep, setActiveStep] = useState(1);

  const formik = useFormik<RequestApprovalFilters>({
    initialValues: {
      startDate: null,
      endDate: null,
    },
    onSubmit: async (values) => {
      setDataWatcher(!dataWatcher);
    },
  });

  const getApprovalDetail = async () => {
    setLoading(true);
    const response = await apiClient.get(
      `${ApiService.requestApproval}/${approvalId}`,
      {
        params: { approvalId },
      }
    );

    const dynamicSteps = [
      {
        label: "New Request",
        subLabel: "Submitted",
        date: response.data.dateIn,
      },
    ];

    if (response.data.status === "Completed") {
      dynamicSteps.push({
        label: "ARO",
        subLabel: "Approved",
        date: response.data.dateUp,
      });
      setActiveStep(2);
    } else if (response.data.status === "Send Back") {
      dynamicSteps.push({
        label: "ARO",
        subLabel: "Rejected",
        date: response.data.dateUp,
      });
      setActiveStep(2);
    } else {
      dynamicSteps.push({
        label: "ARO",
        subLabel: "Waiting for Approval",
        date: response.data.dateUp,
      });
      setActiveStep(1);
    }

    setSteps(dynamicSteps);
    setRequestDetail(response.data);
    setData(response.data.dataRequest);
    setOriginalData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getApprovalDetail();
  }, []);

  const handleCloseUnitName = () => {
    setOpenUnitName(false);
  };

  const handleCloseSendBack = () => {
    setOpenSendBack(false);
  };

  const confirmApprove = async () => {
    setButtonLoading(true);
    try {
      const response = await apiClient.post(
        `${ApiService.requestApproval}/${approvalId}/approve`
      );

      if (response.data.resultCode == 200) {
        showModal({
          title: "Success",
          message: "This Request has been approved successfully",
          options: {
            variant: "success",
            onOk: () => Navigate("/approval-request"),
          },
        });
      }
    } catch (error){
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          showModal({
            title: "Failed",
            message: "This request has already been reviewed",
            options: { 
              variant: "failed",
              onOk: () => {
                window.location.reload();
              }
            },
          });
        }
      } else {
        console.log("An unexpected error occurred.");
      }
    }
  };

  return (
    <PageWrapper>
      {loading ? (
        <CircularProgress />
      ) : (
        <Stack>
          <Stack direction="row" sx={{ marginBottom: "20px" }}>
            <Stack direction="row" gap="20px" width="100%">
              <Stack direction="column" gap="10px">
                <Typography color="#666666" fontSize={12}>
                  Requestor:
                </Typography>
                <Typography color="#666666" noWrap fontSize={12}>
                  Binusian ID:
                </Typography>
                <Typography color="#666666" fontSize={12}>
                  Unit Name:
                </Typography>
              </Stack>
              <Stack direction="column" width="100%" gap="10px">
                <Typography color="initial" fontSize={12}>
                  {requestDetail?.requestor}
                </Typography>
                <Typography color="initial" fontSize={12}>
                  {requestDetail?.binusianId}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ width: "150px", fontSize: "12px", padding: "0px" }}
                  onClick={() => setOpenUnitName(true)}
                >
                  View Details
                </Button>
                <UnitNameBackdrop
                  open={openUnitName}
                  onClose={handleCloseUnitName}
                  approvalId={approvalId}
                />
              </Stack>
            </Stack>
            <Stack direction="row" gap="20px" width="100%">
              <Stack direction="column" gap="10px">
                <Typography color="#666666" fontSize={12}>
                  Position:
                </Typography>
                <Typography color="#666666" noWrap fontSize={12}>
                  Status:
                </Typography>
              </Stack>
              <Stack direction="column" width="100%" gap="10px">
                <Typography color="initial" fontSize={12}>
                  {requestDetail?.position}
                </Typography>
                <Typography color="initial" fontSize={12}>
                  {requestDetail?.status}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack
            sx={{
              backgroundColor: "white",
              border: "1px solid grey",
              padding: "20px",
              marginY: "20px",
            }}
          >
            <Typography fontSize="16px" justifyContent="center" display="flex">
              Tracking Status
            </Typography>
            <Stepper
              activeStep={activeStep}
              sx={{ paddingX: "20px" }}
              alternativeLabel
            >
              {steps.map((step) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: React.ReactNode } = {};

                const color =
                  {
                    Submitted: "#76B743!important",
                    Approved: "#76B743",
                    Rejected: "red",
                    "Waiting for Approval": "#F18700",
                    // Add more conditions here if needed
                  }[step.subLabel] || "#F18700";

                const stepIconComponent =
                  step.subLabel === "Rejected" ? CustomStepIcon : undefined;

                return (
                  <Step key={step.label} {...stepProps}>
                    <StepLabel
                      {...labelProps}
                      StepIconComponent={stepIconComponent}
                      sx={{
                        flexDirection: "column",
                        alignItems: "center",
                        "& .binus-StepLabel-iconContainer": {
                          paddingRight: 0,
                          paddingBottom: "10px",
                        },
                        "& .binus-SvgIcon-root": {
                          width: "24px",
                          height: "24px",
                          color,
                        },
                      }}
                    >
                      <Stack alignItems="center">
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color,
                            fontSize: "14px",
                          }}
                        >
                          {step.label}
                        </Typography>
                        <Typography fontSize={12}>{step.subLabel}</Typography>
                        {step.date ? (
                          <Typography fontSize={12}>{step.date}</Typography>
                        ) : (
                          <Typography sx={{ visibility: "hidden" }}>
                            No Date
                          </Typography>
                        )}
                      </Stack>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Stack>

          <Divider sx={{ marginY: "20px" }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ marginY: "10px" }}
          >
            <Typography fontSize="16px" color="initial">
              Request Data
            </Typography>
          </Stack>
          <Stack
            direction="column"
            sx={{
              flexGrow: 1,
              overflow: "auto",
              background: "white",
              border: "1px solid #CCCCCC",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          sx={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "12px",
                            textWrap: "nowrap",
                            border: "1px solid lightgray",
                            minWidth: header.column.columnDef.size,
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          sx={{
                            fontSize: "12px",
                            border: "1px solid lightgray",
                          }}
                        >
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
          </Stack>
          <Stack sx={{ width: "200px", marginY: "20px" }}>
            {requestDetail?.excelDownloadLink && (
              <Stack>
                <Button
                  variant="contained"
                  sx={{
                    width: "320px",
                    background: "#5F9236",
                    textWrap: "nowrap",
                    fontSize: "13px",
                  }}
                  href={requestDetail?.excelDownloadLink}
                >
                  <RiFileExcel2Fill size={20} style={{ marginRight: "10px" }} />
                  Download Excel Detail Request Data
                </Button>
                <Typography
                  color="initial"
                  sx={{
                    fontSize: "12px",
                    textWrap: "nowrap",
                    marginTop: "10px",
                  }}
                >
                  Note : Click the download button to obtain the complete
                  requested data
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack>
            <Stack fontSize={12}>Request Reason</Stack>
            <TextField
              multiline
              rows={4}
              placeholder="Enter your description..."
              variant="outlined"
              value={requestDetail?.requestReason}
              sx={{ color: "black" }}
              disabled
            />
          </Stack>
          {requestDetail?.status === "Waiting Approval" &&
            userProfile.rolePermissions.some(
              (permission) =>
                permission.permissionName === "approval-request-data"
            ) && (
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
                gap="20px"
                sx={{ marginTop: "20px" }}
              >
                <Stack width="100%">
                  <Button
                    variant="contained"
                    sx={{ background: "#999999", fontSize: "13px" }}
                    onClick={() => Navigate("/approval-request")}
                  >
                    Cancel
                  </Button>
                </Stack>
                <Stack
                  width="100%"
                  display="flex"
                  justifyContent="end"
                  direction="row"
                  gap="20px"
                >
                  <CustomLoadingButton
                    loading={buttonLoading}
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(to bottom, #999999, #B3B3B3)",
                      width: "150px",
                      fontSize: "13px",
                    }}
                    onClick={() => setOpenSendBack(true)}
                  >
                    Send Back
                  </CustomLoadingButton>
                  <SendBackBackdrop
                    open={openSendBack}
                    onClose={handleCloseSendBack}
                    approvalId={approvalId}
                    setButtonLoading={setButtonLoading}
                    requestDetail={requestDetail}
                  />
                  <CustomLoadingButton
                    loading={buttonLoading}
                    variant="contained"
                    sx={{ width: "150px", fontSize: "13px" }}
                    onClick={() => setModalOpen(true)}
                  >
                    Approve
                  </CustomLoadingButton>
                </Stack>
              </Stack>
            )}
          <ModalAlert
            variant="info"
            title="Confirm Approve Request"
            message="are you sure you want to approve this request?"
            buttonTitle="Confirm"
            open={modalOpen}
            cancelButton
            onOk={() => confirmApprove()}
            onClose={() => setModalOpen(false)}
          />
        </Stack>
      )}
    </PageWrapper>
  );
}
