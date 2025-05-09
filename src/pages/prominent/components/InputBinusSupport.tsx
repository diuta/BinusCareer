import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Add as AddIcon} from '@mui/icons-material';

export default function InputBinusSupport({
    binusSupportRows,
    setBinusSupportRows,
    setErrorSupport,
} : {
    binusSupportRows: string[];
    setBinusSupportRows: (data) => void;
    setErrorSupport: (data) => void;
}) {

    const formik = useFormik({
        initialValues:{
            binusSupport: '',
        },
        validationSchema: Yup.object().shape({
           binusSupport: Yup.string().required("Binus Support is required"),
          }),
        onSubmit: (values) => {
            setBinusSupportRows([...binusSupportRows, values.binusSupport])
            formik.resetForm()
            setErrorSupport("")
        }
    })


    return(
        <Stack
        direction="row"
        spacing={2}
        alignItems="start"
        >
            <Stack minWidth='88%'>
                <TextField

                    fullWidth
                    variant="outlined"
                    name="binusSupport"
                    value={formik.values.binusSupport}
                    onChange={formik.handleChange}
                    sx={{
                    fontSize: '13px',
                    }}
                    error={
                        formik.touched.binusSupport &&
                        Boolean(formik.errors.binusSupport)
                    }
                />
                {formik.touched.binusSupport && formik.errors.binusSupport && (
                    <Typography marginTop={1} fontSize='12px' color="#9F041B">
                        {formik.errors.binusSupport}
                    </Typography>
                )}
            </Stack>

            <Button
            variant="contained"
            color="primary"
            startIcon={
                <AddIcon
                sx={{
                    border: '2px solid white',
                    borderRadius: '10px',
                }}
                />
            }
            onClick={() => formik.handleSubmit()}
            sx={{
                mt: 2,
                backgroundColor: '#FF9800',
                minWidth: '11%',
                fontSize: '13px',
                textAlign: 'center',
            }}
            >
            Add
            </Button>
        </Stack>
    )
}