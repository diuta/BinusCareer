import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Add as AddIcon} from '@mui/icons-material';
import { IBinusSupport } from "../Interface/IEditProminent";

export default function EditBinusSupport({
    binusSupportRows,
    setBinusSupportRows,
} : {
    binusSupportRows: IBinusSupport[];
    setBinusSupportRows: (data) => void;
}) {

    const formik = useFormik<IBinusSupport>({
        initialValues:{
            binusSupportDetail: '',
            prevId: 0,
        },
        validationSchema: Yup.object().shape({
            binusSupportDetail: Yup.string().required("Binus Support is required"),
          }),
        onSubmit: (values) => {
            setBinusSupportRows([...binusSupportRows, values])
            formik.resetForm()
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
                    name="binusSupportDetail"
                    value={formik.values.binusSupportDetail}
                    onChange={formik.handleChange}
                    sx={{
                    fontSize: '13px',
                    }}
                    error={
                        formik.touched.binusSupportDetail &&
                        Boolean(formik.errors.binusSupportDetail)
                    }
                />
                {formik.touched.binusSupportDetail && formik.errors.binusSupportDetail && (
                    <Typography marginTop={1} fontSize='12px' color="#9F041B">
                        {formik.errors.binusSupportDetail}
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