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
import {
  FindAlumniDataForm,
  SampleDropdown,
  Dropdown,
} from "../Interface/FindAlumniDataInterface";
import { AccordionProps } from "../Interface/AccordionProps";
import { ApiService } from "../../../constants/ApiService";
import apiClient from "../../../config/api-client";
import ClearIcon from "@mui/icons-material/Clear";
import MultiSelect from "../../../components/common/multiselect/MultiSelect";
import { Option } from "../../../interfaces/ITypes";


export default function DomicileAccordion({
  formik,
  checked,
  setChecked,
}: AccordionProps) {
  const [countryList, setCountryList] = useState<Dropdown[]>([]);
  const [provinceList, setProvinceList] = useState<Dropdown[]>([]);
  const [cityList, setCityList] = useState<Dropdown[]>([]);
  const [filteredCityList, setFilteredCityList] = useState<Option[]>([]);

  const [includeID, setIncludeID] = useState<boolean>(false);

  const getMasterFilters = async () => {
    const countryResponse = await apiClient.get(ApiService.country);
    setCountryList(countryResponse.data.listDropdown);
    const provinceResponse = await apiClient.get(ApiService.province);
    setProvinceList(provinceResponse.data.listDropdown);
    const cityResponse = await apiClient.get(ApiService.city);
    setCityList(cityResponse.data.listDropdown);
    setFilteredCityList([]);
  };

  useEffect(() => {
    getMasterFilters();
  }, []);

  useEffect(() => {
    if (!formik.values.country?.includes('ID')) {
      formik.setFieldValue('province', []);
      formik.setFieldValue('city', []);
      setIncludeID(false);
    } else {
      setIncludeID(true);
    }
  }, [formik.values.country]);

  const filterInvalidValue = (value: string[], list: Option[]) => value.filter((item) => list.map(dt => dt.value).includes(item));
  useEffect(() => {
    if (!formik.values.country || formik.values.country.length <= 0) {
      setFilteredCityList([]);
      formik.setFieldValue('city', []);
      return;
    }

    let filteredCity = new Array<Option>();
    formik.values.country.forEach(id => {
      filteredCity.push(...cityList.filter(e => e.label.startsWith(id)));
    });

    if (!formik.values.province || formik.values.province.length <= 0) {
      filteredCity = filteredCity.sort((a, b) => a.label.localeCompare(b.label));
      setFilteredCityList(filteredCity);
      formik.setFieldValue('city', filterInvalidValue(formik.values.city ?? [], filteredCity));
      return;
    }

    filteredCity = filteredCity.filter(e => !e.label.startsWith("ID") || formik.values.province?.includes(e.value.slice(0, 2)));
    filteredCity = filteredCity.sort((a, b) => a.label.localeCompare(b.label));
    setFilteredCityList(filteredCity);
    formik.setFieldValue('city', filterInvalidValue(formik.values.city ?? [], filteredCity));
  }, [formik.values.country, formik.values.province]);

  const areFieldsFilled =
    formik.values.country.length > 0 ||
    formik.values.province.length > 0 ||
    formik.values.city.length > 0;

  useEffect(() => {
    if (areFieldsFilled) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [formik.values.country, formik.values.province, formik.values.city]);

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
          <Typography sx={{ marginY: "auto" }}>Domicile</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "1px solid grey" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          marginTop={2}
        >
          <Stack width="100%">
            <Typography variant="label">Country</Typography>
            <MultiSelect
              data={countryList}
              value={formik.values.country}
              onChange={(value) => {
                formik.setFieldValue("country", value);
              }}
            />
          </Stack>
          <Stack width="100%">
            <Typography variant="label">Province (Indonesia)</Typography>
            <MultiSelect
              data={includeID ? provinceList : []}
              value={formik.values.province}
              onChange={(value) => {
                formik.setFieldValue('province', value);
              }}
            />
          </Stack>
          <Stack width="100%">
            <Typography variant="label">City</Typography>
            <MultiSelect
              data={filteredCityList}
              value={formik.values.city}
              onChange={(value) => formik.setFieldValue('city', value)}
            />
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
