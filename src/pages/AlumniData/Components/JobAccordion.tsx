import { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Dropdown } from "../Interface/FindAlumniDataInterface";
import { AccordionProps } from "../Interface/AccordionProps";
import { ApiService } from "../../../constants/ApiService";
import apiClient from "../../../config/api-client";
import ClearIcon from "@mui/icons-material/Clear";
import { Option } from "../../../interfaces/ITypes";
import MultiSelect from "../../../components/common/multiselect/MultiSelect";

export default function JobAccordion({
  formik,
  checked,
  setChecked,
}: AccordionProps) {
  const [sectorDropDown, setSectorDropDown] = useState<Option[]>([]);
  const [companyCategoryDropDown, setCompanyCategoryDropDown] = useState<
    Dropdown[]
  >([]);
  const [jobCategoryDropDown, setJobCategoryDropDown] = useState<Dropdown[]>(
    []
  );
  const [positionLevelDropDown, setPositionLevelDropDown] = useState<
    Dropdown[]
  >([]);

  const getSector = async () => {
    const response = await apiClient.get(ApiService.sector);
    setSectorDropDown(response.data.listDropdown);
  };

  const getJobCategory = async () => {
    const response = await apiClient.get(ApiService.jobCategory);
    setJobCategoryDropDown(response.data.listDropdown);
  };

  const getCompanyCategory = async () => {
    const response = await apiClient.get(ApiService.companyCategory);
    setCompanyCategoryDropDown(response.data.listDropdown);
  };

  const getPosistionLevel = async () => {
    const response = await apiClient.get(ApiService.positionLevel);
    setPositionLevelDropDown(response.data.listDropdown);
  };

  useEffect(() => {
    getSector();
    getJobCategory();
    getPosistionLevel();
    getCompanyCategory();
  }, []);

  const areFieldsFilled =
    formik.values.companyName !== "" ||
    formik.values.sector.length > 0 ||
    formik.values.jobCategory.length > 0 ||
    formik.values.positionLevel.length > 0 ||
    formik.values.companyCategory.length > 0 ||
    formik.values.position !== "";

  useEffect(() => {
    if (areFieldsFilled) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [
    formik.values.companyName,
    formik.values.sector,
    formik.values.jobCategory,
    formik.values.positionLevel,
    formik.values.companyCategory,
    formik.values.position,
  ]);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="personalData-content"
        id="personalData"
      >
        <Stack direction="row">
          <Stack sx={{ marginY: "auto" }}>
            <Checkbox
              disabled={areFieldsFilled}
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              onClick={(event) => event.stopPropagation()}
            />
          </Stack>
          <Typography sx={{ marginY: "auto" }}>Job</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "1px solid grey" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Stack width="100%">
            <Typography variant="label">Company Name</Typography>
            <TextField
              name="companyName"
              variant="outlined"
              placeholder="Name"
              fullWidth
              onChange={formik.handleChange}
            />
          </Stack>
          <Stack width="100%">
            <Typography variant="label">Company Category</Typography>
            <MultiSelect
              data={companyCategoryDropDown}
              value={formik.values.companyCategory}
              onChange={(value) => {
                formik.setFieldValue("companyCategory", value);
              }}
              onClear={() => {
                formik.setFieldValue("companyCategory", []);
              }}
            >
              {companyCategoryDropDown.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
          <Stack width="100%">
            <Typography variant="label">Sector</Typography>
            <MultiSelect
              data={sectorDropDown}
              value={formik.values.sector}
              onChange={(value) => {
                formik.setFieldValue("sector", value);
              }}
              onClear={() => {
                formik.setFieldValue("sector", []);
              }}
            >
              {sectorDropDown.map((item) => (
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
          marginTop={2}
        >
          <Stack width="100%">
            <Typography variant="label">Position</Typography>
            <TextField
              name="position"
              variant="outlined"
              placeholder="Name"
              fullWidth
              onChange={formik.handleChange}
            />
          </Stack>
          <Stack width="100%">
            <Typography variant="label">Job Category</Typography>
            <MultiSelect
              data={jobCategoryDropDown}
              value={formik.values.jobCategory}
              onChange={(value) => {
                formik.setFieldValue("jobCategory", value);
              }}
              onClear={() => {
                formik.setFieldValue("jobCategory", []);
              }}
            >
              {jobCategoryDropDown.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
          <Stack width="100%">
            <Typography variant="label">Position Level</Typography>
            <MultiSelect
              data={positionLevelDropDown}
              value={formik.values.positionLevel}
              onChange={(value) => {
                formik.setFieldValue("positionLevel", value);
              }}
              onClear={() => {
                formik.setFieldValue("positionLevel", []);
              }}
            >
              {positionLevelDropDown.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MultiSelect>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
