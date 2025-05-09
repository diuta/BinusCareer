import { Typography, Stack, Grid, Button } from "@mui/material";
import PageWrapper from "../../components/container/PageWrapper";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import {
  AlumniDetail,
  AlumniDetailPersonalData,
} from "./Interface/FindAlumniDataInterface";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import { useParams, useNavigate } from "react-router-dom";
import { DetailChildTable } from "./Components/DetailChildTable";
import { DetailEngangementTable } from "./Components/DetailEngagementTable";
import { DetailEndowmentTable } from "./Components/DetailEndowmentTable";
import EditIcon from "@mui/icons-material/Edit";

export function FindAlumniDetail() {
  const [alumniDetail, setAlumniDetail] = useState<AlumniDetail>();
  const { alumniId } = useParams();
  const navigate = useNavigate();
  const [headerPortalElement, setHeaderPortalElement] =
    useState<Element | null>(null);

  const getAlumniDetail = async () => {
    const response = await apiClient.get(
      `${ApiService.findAlumni}/${alumniId}`,
      {
        params: { alumniId },
      }
    );
    console.log(response);
    setAlumniDetail((prevDetail) => ({
      ...prevDetail,
      personalData: response.data
        .alumniDetailPersonalData as AlumniDetailPersonalData,
      jobData: response.data.alumniDetailJobData,
      domicileData: response.data.alumniDetailDomicileData,
      childData: response.data.alumniDetailChildData,
      engagementData: response.data.alumniDetailEngagementData,
      endowmentData: response.data.alumniDetailEndowmentData,
    }));
  };

  useEffect(() => {
    getAlumniDetail();
    const portalElement = document.querySelector("#header-portal-content");
    setHeaderPortalElement(portalElement);
  }, []);

  return (
    <PageWrapper>
      {headerPortalElement &&
        createPortal(
          <Button
            variant="contained"
            sx={{ marginLeft: "20px" }}
            onClick={() => navigate(`/update-alumni/${alumniId}/edit`)}
          >
            <EditIcon sx={{ marginRight: "10px" }} />
            Edit
          </Button>,
          headerPortalElement
        )}
      <Stack
        sx={{
          background: "white",
          borderRadius: "8px",
          border: "1px solid #CCCCCC",
          padding: 2,
        }}
      >
        <Typography variant="h6">Personal Data</Typography>
        <Stack>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "0px", marginTop: "0px" }}
          >
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Binusian ID
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.binusianId}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  NIM
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.alumniId}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Name
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.name}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Campus
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.campus}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Faculty
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.faculty}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Program
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.program}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Degree
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.degree}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  College Program
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.collegeProgram}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Minor Program
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.minorProgram}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Place, Date of Birth
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.placeOfBirth},{" "}
                  {alumniDetail?.personalData.dateOfBirth &&
                    new Date(
                      alumniDetail.personalData.dateOfBirth
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Religion
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.religion}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Gender
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.gender}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Nationality
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.nationality}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Binus Square
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.binusSquare}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Graduation Period
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.graduationPeriod}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Entry Year
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.entryYear}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Entry Date
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.entryDate &&
                    new Date(
                      alumniDetail.personalData.entryDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Graduation Year
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.graduationYear}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Graduation Date
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.graduationDate &&
                    new Date(
                      alumniDetail.personalData.graduationDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Student Track
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.studentTrack}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Update Year
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.personalData.updateYear}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
      <Stack
        sx={{
          background: "white",
          borderRadius: "8px",
          border: "1px solid #CCCCCC",
          padding: 2,
          marginTop: "20px",
        }}
      >
        <Typography variant="h6">Job</Typography>
        <Stack>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "0px", marginTop: "0px" }}
          >
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Company Name
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.jobData.companyName}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Sector
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.jobData.sector}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Company Category
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.jobData.companyCategory}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Job Category
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.jobData.jobCategory}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Position
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.jobData.position}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Position Level
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.jobData.positionLevel}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
      <Stack
        sx={{
          background: "white",
          borderRadius: "8px",
          border: "1px solid #CCCCCC",
          padding: 2,
          marginTop: "20px",
        }}
      >
        <Typography variant="h6">Domicile</Typography>
        <Stack>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "0px", marginTop: "0px" }}
          >
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Country
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.domicileData.country}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  Province
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.domicileData.province}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: "10px" }}>
              <Stack>
                <Typography variant="label" color="#666666">
                  City
                </Typography>
                <Stack fontSize={14} fontWeight={600}>
                  {alumniDetail?.domicileData.city}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
      <DetailChildTable childData={alumniDetail?.childData} />
      <DetailEngangementTable engagementData={alumniDetail?.engagementData} />
      <DetailEndowmentTable endowmentData={alumniDetail?.endowmentData} />
    </PageWrapper>
  );
}
