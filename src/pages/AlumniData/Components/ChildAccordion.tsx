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
  SampleDropdown,
  ChildAgeRangeDropdown,
} from "../Interface/FindAlumniDataInterface";
import { AccordionProps } from "../Interface/AccordionProps";
import { useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";

export default function ChildAccordion({
  formik,
  checked,
  setChecked,
}: AccordionProps) {
  const areFieldsFilled =
    formik.values.maxAge !== -1 || formik.values.minAge !== -1;

  useEffect(() => {
    if (areFieldsFilled) setChecked(true);
    else setChecked(false);
  }, [formik.values.maxAge, formik.values.minAge]);

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
          <Typography sx={{ marginY: "auto" }}>Child</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "1px solid grey" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          marginTop={2}
        >
          <Stack width="100%">
            <Typography variant="label">Range</Typography>
            <Select
              name="range"
              label="range"
              variant="outlined"
              fullWidth
              value={
                ChildAgeRangeDropdown.find(
                  (item) =>
                    item.minAge === formik.values.minAge &&
                    item.maxAge === formik.values.maxAge
                )?.label || ""
              }
              onChange={(event) => {
                const selectedRange = ChildAgeRangeDropdown.find(
                  (item) => item.label === event.target.value
                );
                if (!selectedRange) return;
                formik.setFieldValue("minAge", selectedRange.minAge);
                formik.setFieldValue("maxAge", selectedRange.maxAge);
              }}
              sx={{ width: "100%", paddingRight: "30px" }}
              endAdornment={
                <InputAdornment position="end" sx={{ marginLeft: "-70px" }}>
                  {formik.values.minAge != -1 ? (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        formik.setFieldValue("minAge", -1);
                        formik.setFieldValue("maxAge", -1);
                      }}
                    >
                      <ClearIcon sx={{ color: "grey" }} />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              }
            >
              {ChildAgeRangeDropdown.map((item) => (
                <MenuItem key={item.label} value={item.label}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
