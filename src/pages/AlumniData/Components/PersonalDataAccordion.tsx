import {
  Typography,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useFormikContext, useFormik } from "formik";
import { FindAlumniDataForm } from "../Interface/FindAlumniDataInterface";
import { AccordionProps } from "../Interface/AccordionProps";
import DatePicker from "../../../components/common/Datepicker";

export default function PersonalDataAccordion({ formik }: AccordionProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="personalData-content"
        id="personalData"
      >
        <Stack direction="row">
          <Typography sx={{ marginY: "auto" }}>Personal Data</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "1px solid grey" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Stack width="100%">
            <Typography variant="label">Name</Typography>
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              onBlur={formik.handleChange}
            />
          </Stack>
          <Stack width="100%">
            <Typography variant="label">NIM</Typography>
            <TextField
              name="nim"
              variant="outlined"
              fullWidth
              onBlur={formik.handleChange}
            />
          </Stack>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          marginTop={2}
        >
          <Stack width="100%">
            <Typography variant="label">Binusian ID</Typography>
            <TextField
              name="binusianId"
              variant="outlined"
              fullWidth
              onBlur={formik.handleChange}
            />
          </Stack>
          <Stack width="100%">
            <Typography variant="label">Place of Birth</Typography>
            <TextField
              name="placeOfBirth"
              variant="outlined"
              fullWidth
              onBlur={formik.handleChange}
            />
          </Stack>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          marginTop={2}
        >
          <Stack width="100%">
            <Typography variant="label">Date of Birth</Typography>
            <DatePicker
              value={formik.values.dateOfBirth}
              id="dateOfBirth"
              onChange={(dateString) => {
                formik.setFieldValue("dateOfBirth", dateString);
              }}
              dateFormat="dd-MM-yyyy"
              autoClose
              clearIcon
            />
          </Stack>
          <Stack width="100%">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.isSOC}
                  onChange={(e) =>
                    formik.setFieldValue("isSOC", e.target.checked)
                  }
                />
              }
              label="Was Student Organization Committee"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
          </Stack>
          <Stack width="100%">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.isRegisteredAlumni}
                  onChange={(e) =>
                    formik.setFieldValue("isRegisteredAlumni", e.target.checked)
                  }
                />
              }
              label="Registered Alumni App"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
