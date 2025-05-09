import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PageWrapper from "../../../components/container/PageWrapper";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import AchievementTableAdd from "../component/AchievementTableAdd";
import AchievementTableEdit from "../component/AchievementTableEdit";
import { EvidenceObject } from "../interface/IListProminent"
import { HeadCell } from "./Interface";

interface AchievementEvidence{
  evidenceType: string;
  evidence: string | null;
  isOld: boolean;
}

interface AchievementDetail {
  achievementId: number;
  achievementCategoryId: number;
  achievementCategoryName: string;
  achievementName: string;
  prevId: number | null;
  achievementEvidence: AchievementEvidence[];
  isChanged: string[];
  currentEvidence: number[];
  oldEvidence: number[];
}

interface BinusSupportDetail {
  binusSupportId: number;
  binusSupportDetail: string;
  prevId: number | null;
  isChanged: boolean;
}

interface Data {
  alumniId: string;
  alumniName: string;
  campusName: string;
  facultyName: string;
  programName: string;
  degreeName: string;
  prominentId: number;
  period: Date;
  date: Date;
  achievements: AchievementDetail[];
  binusSupport: BinusSupportDetail[];
  parentId: number | null;
  proposalStatusId: number;
  reason: string | null;
}

const headCellsAchievement: readonly HeadCell[] = [
  { id: "AchievementCategory", numeric: false, label: "Achievement Category" },
  { id: "Achievement", numeric: false, label: "Achievement" },
  { id: "actions", numeric: false, label: "Achievement Evidence" },
];

const headCellsBinusSupport: readonly HeadCell[] = [
  { id: "BinusSupport", numeric: false, label: "Binus Support" },
];

interface Detail {
  Path: EvidenceObject[];
  IsFile: boolean[];
  Name: string;
  Nim: string;
  AchievementCategory: string[];
  Achievement: string[];
  Category: string;
  OldEvidence: number[];
}

export function DetailProminent() {
  const location = useLocation();
  const [data, setData] = React.useState<Data>();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Detail | null>(null);
  // const getUserData = (ids: string) => data.find((user) => user.id === ids);
  const queryParams = new URLSearchParams(location.search);
  const approvalStatus = queryParams.get("approvalStatus");
  const approvalStatusId = queryParams.get("approvalStatusId");
  // const userData = getUserData(id || "");
  const refId = queryParams.get("refId");
  const navigate = useNavigate();

  const getRefId = () => {
    if (refId) {
      let idsArray = refId.split(",");

      idsArray = idsArray.filter((ids) => ids !== "");

      const distinctIdsArray = [...new Set(idsArray)];
      return distinctIdsArray.map((ids) => ids);
    }
    return [];
  };

  const dataTemp = {
    approvalStatus,
    refIdTemp: getRefId(),
    approvalStatusIdDTO: Number(approvalStatusId),
  };

  const getProminentData = async () => {
    const response = await apiClient.get(`${ApiService.getProminentData}?prominentId=${id}`);
    setData(response.data);
  };

  useEffect(() => {
    getProminentData();
  }, []);

  const handleClickOpen = async (
    Category: string,
    Achievement: string,
    Name: string,
    Nim: string,
    AchievementCategory: string,
    IsFile: boolean[],
    Path: EvidenceObject[],
    OldEvidence: number[],
  ) => {
    const selectedDetail: Detail = {
      Category,
      Achievement: [Achievement],
      Name,
      Nim,
      AchievementCategory: [AchievementCategory],
      IsFile,
      Path,
      OldEvidence
    };

    setSelectedRow(selectedDetail);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleBack = () => {
    navigate("/prominent/approval");
  };


  return (
    <PageWrapper>
      <Stack>
        {data?.parentId != null ? (
          data ? (
            <Stack>
              <Stack direction="column" gap="10px" sx={{ width: "100%" }}>
                <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      NIM
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Name
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Campus
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333333",
                      }}
                    >
                      {data.alumniId}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333333",
                      }}
                    >
                      {data.alumniName}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333333",
                      }}
                    >
                      {data.campusName}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Faculty
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Program
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Degree
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333333",
                      }}
                    >
                      {data.facultyName}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333333",
                      }}
                    >
                      {data.programName}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        textAlign: "justify",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333333",
                      }}
                    >
                      {data.degreeName}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              <Divider sx={{ marginY: "20px" }} />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack
                  spacing={1}
                  gap="10px"
                  sx={{ flexGrow: 1, flexBasis: "50%", flexShrink: 0 }}
                >
                  <Typography fontSize="12px">Period</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }}>
                      <CalendarMonthIcon />
                    </IconButton>
                    <Typography fontSize="12px">
                      {format(data.period, 'dd LLLL yyyy')}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  spacing={1}
                  gap="10px"
                  sx={{ flexGrow: 1, flexBasis: "50%", flexShrink: 0 }}
                >
                  <Typography sx={{ textAlign: "start" }} fontSize="12px">
                    Date
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }}>
                      <CalendarMonthIcon />
                    </IconButton>
                    <Typography fontSize="12px">
                      {format(data.date, 'dd LLLL yyyy')}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Typography sx={{ marginY: "40px" }} fontSize="12px">
                Achievement
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  <Stack>
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750, tableLayout: "fixed" }}
                        aria-labelledby="tableTitle"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              align="center"
                              sx={{
                                fontWeight: 700,
                                width: "60px",
                                padding: "6px",
                                fontSize: "12px",
                              }}
                            >
                              No
                            </TableCell>
                            {headCellsAchievement.map((headCell) => (
                              <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? "center" : "left"}
                                sx={{
                                  minWidth: "120px",
                                  fontWeight: 700,
                                  fontSize: "12px",
                                }}
                              >
                                {headCell.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <AchievementTableEdit
                            userData={data}
                            handleClickOpen={handleClickOpen}
                          />
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </Paper>
              </Box>
              <Typography sx={{ marginY: "20px" }} fontSize="12px">
                Binus Support
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                  <Stack>
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750, tableLayout: "fixed" }}
                        aria-labelledby="tableTitle"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              align="center"
                              sx={{
                                fontWeight: 700,
                                width: "60px",
                                padding: "6px",
                                fontSize: "12px",
                              }}
                            >
                              No
                            </TableCell>
                            {headCellsBinusSupport.map((headCell) => (
                              <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? "center" : "left"}
                                sx={{
                                  minWidth: "120px",
                                  fontWeight: 700,
                                  fontSize: "12px",
                                }}
                              >
                                {headCell.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.binusSupport.map(
                            (
                              binusSupportDetail: BinusSupportDetail,
                              binusSupportidx: number
                            ) => (
                              <TableRow key={binusSupportDetail.binusSupportId}>
                                <TableCell
                                  align="center"
                                  sx={{ width: "60px", padding: "6px" }}
                                >
                                  <Typography
                                    fontSize="12px"
                                    sx={{
                                      color:
                                        binusSupportDetail.isChanged === false
                                          ? "black"
                                          : "#028ED5",
                                    }}
                                  >
                                    {binusSupportidx + 1}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    fontSize="12px"
                                    sx={{
                                      color:
                                        binusSupportDetail.isChanged === false
                                          ? "black"
                                          : "#028ED5",
                                    }}
                                  >
                                    {binusSupportDetail.binusSupportDetail}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </Paper>
              </Box>
              <Stack>
                <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      fontSize="12px"
                      sx={{ textAlign: "justify", marginY: "20px" }}
                    >
                      Reason
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      variant="outlined"
                      multiline
                      rows="2"
                      id="reason"
                      name="reason"
                      value={data?.reason}
                      sx={{ width: "100%" }}
                      InputProps={{
                        readOnly: true,
                        sx: { fontSize: "12px" },
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  sx={{ backgroundColor: "#B3B3B3", color: "white" }}
                  onClick={handleBack}
                >
                  Close
                </Button>
              </Box>
            </Stack>
          ) : (
            <Typography>No data available</Typography>
          )
        ) : data ? (
          <Stack>
            <Stack direction="column" gap="10px" sx={{ width: "100%" }}>
              <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    NIM
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Name
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Campus
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    {data.alumniId}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    {data.alumniName}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    {data.campusName}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Faculty
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Program
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Degree
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    {data.facultyName}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    {data.programName}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      textAlign: "justify",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    {data.degreeName}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Divider sx={{ marginY: "20px" }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                spacing={1}
                gap="10px"
                sx={{ flexGrow: 1, flexBasis: "50%", flexShrink: 0 }}
              >
                <Typography fontSize="12px">Period</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton sx={{ padding: 0, margin: 0 }}>
                    <CalendarMonthIcon />
                  </IconButton>
                  <Typography fontSize="14px">
                    {format(data.period, 'dd LLLL yyyy')}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                spacing={1}
                gap="10px"
                sx={{ flexGrow: 1, flexBasis: "50%", flexShrink: 0 }}
              >
                <Typography sx={{ textAlign: "start" }} fontSize="12px">
                  Date
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton sx={{ padding: 0, margin: 0 }}>
                    <CalendarMonthIcon />
                  </IconButton>
                  <Typography fontSize="14px">
                    {format(data.date, 'dd LLLL yyyy')}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Typography sx={{ marginY: "25px" }} fontSize="12px">
              Achievement
            </Typography>
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%" }}>
                <Stack>
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 750, tableLayout: "fixed" }}
                      aria-labelledby="tableTitle"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 700,
                              width: "60px",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            No
                          </TableCell>
                          {headCellsAchievement.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              align={headCell.numeric ? "center" : "left"}
                              sx={{
                                minWidth: "120px",
                                fontWeight: 700,
                                fontSize: "12px",
                              }}
                            >
                              {headCell.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <AchievementTableAdd
                          userData={data}
                          handleClickOpen={handleClickOpen}
                        />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Paper>
            </Box>

            <Typography sx={{ marginY: "20px" }} fontSize="12px">
              Binus Support
            </Typography>
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%" }}>
                <Stack>
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 750, tableLayout: "fixed" }}
                      aria-labelledby="tableTitle"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 700,
                              width: "60px",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            No
                          </TableCell>
                          {headCellsBinusSupport.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              align={headCell.numeric ? "center" : "left"}
                              sx={{
                                minWidth: "120px",
                                fontWeight: 700,
                                fontSize: "12px",
                              }}
                            >
                              {headCell.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.binusSupport.map(
                          (
                            binusSupportDetail: BinusSupportDetail,
                            binusSupportidx: number
                          ) => (
                            <TableRow key={binusSupportDetail.binusSupportId}>
                              <TableCell
                                align="center"
                                sx={{ width: "60px", padding: "6px" }}
                              >
                                <Typography fontSize="12px">
                                  {binusSupportidx + 1}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography fontSize="12px">
                                  {binusSupportDetail.binusSupportDetail}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Paper>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                sx={{ backgroundColor: "#B3B3B3", color: "white" }}
                onClick={handleBack}
              >
                Close
              </Button>
            </Box>
          </Stack>
        ) : (
          <Typography>No data available</Typography>
        )}

        <Dialog
          open={openDialog}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: "#F5F5F5",
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <PageWrapper>
            <DialogTitle>Achievement Evidence</DialogTitle>
            <Divider sx={{ marginY: "10px" }} />
            <DialogContent>
              <Stack>
                <Stack gap="20px">
                  <Stack
                    direction="row"
                    marginY="10px"
                    padding="0px"
                    marginX="0px"
                  >
                    <Stack gap="20px" marginRight="5.5rem">
                      <Stack gap="7px">
                        <Typography fontSize="12px">Name</Typography>
                        <Typography sx={{ fontWeight: 600 }} fontSize="14px">
                          {selectedRow?.Name}
                        </Typography>
                      </Stack>
                      <Stack gap="7px">
                        <Typography fontSize="12px">
                          Achievement Category
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }} fontSize="14px">
                          {selectedRow?.AchievementCategory}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack gap="20px">
                      <Stack gap="7px">
                        <Typography fontSize="12px">NIM</Typography>
                        <Typography sx={{ fontWeight: 600 }} fontSize="14px">
                          {selectedRow?.Nim}
                        </Typography>
                      </Stack>
                      <Stack gap="7px">
                        <Typography fontSize="12px">Achievement</Typography>
                        <Typography sx={{ fontWeight: 600 }} fontSize="14px">
                          {selectedRow?.Achievement}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Typography fontSize="12px">Achievement Evidence</Typography>
                  <Paper>
                    <PageWrapper>
                      <Stack gap="10px">
                        <Typography fontSize="12px">Evidence</Typography>
                        {Array.isArray(selectedRow?.Path) &&
                          selectedRow?.Path.map((path, index, isChange) => (
                            <Box
                              display="flex"
                              alignItems="center"
                              border="1px solid #ccc"
                              borderRadius="4px"
                              paddingLeft="10px"
                              marginBottom="10px"
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontSize: selectedRow?.IsFile[index]
                                    ? "14px"
                                    : "11.7px",
                                  lineHeight: "normal",
                                  marginX: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#808080",
                                }}
                              >
                                {selectedRow?.IsFile[index] ? "File" : "URL"}
                              </Typography>

                              <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ marginX: 2 }}
                              />

                              <TextField
                                variant="outlined"
                                defaultValue={path.path}
                                InputProps={{
                                  readOnly: true,
                                }}
                                sx={{
                                  input: {
                                    border: "none",
                                    color:  "#808080",
                                    fontSize: "14px",
                                  },
                                  "::placeholder": { color: "white" },
                                }}
                                fullWidth
                              />
                            </Box>
                          ))}
                      </Stack>
                    </PageWrapper>
                  </Paper>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                sx={{ backgroundColor: "#B3B3B3", color: "white" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </DialogActions>
          </PageWrapper>
        </Dialog>
      </Stack>
    </PageWrapper>
  );
}
