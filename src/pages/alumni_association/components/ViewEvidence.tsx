import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";

import { ApiService } from "../../../constants/ApiService";
import { ITableData } from "../interface/ApprovalRequestInterface";

export default function ViewEvidence (
    {
        openEvidence,
        handleClose,
        rowViewed,
        imageUrl,
        confirmationLetterUrl,

    } : {
        openEvidence : boolean;
        handleClose : () => void;
        rowViewed : ITableData | null;
        imageUrl: string;
        confirmationLetterUrl: string;
    }
) {

    return (
        <Dialog open={openEvidence} onClose={handleClose}>
            <DialogContent
            >
                {rowViewed && (
                    <Stack minWidth='500px' minHeight='300px' justifyContent='center'>
                        <Stack alignItems='center' gap='10px'>
                            <img 
                            src={`${ApiService.viewUploadedFile}?Uri=${imageUrl}`}
                            alt="Alumni"
                            style={{ width:'200px', height:'200px' , borderRadius:'50%'}}/>
                            <Typography fontWeight='bold' fontSize='14px'>{rowViewed.name}</Typography>
                            <Typography fontSize='14px'>{rowViewed.nim}</Typography>
                            <Stack direction='row' gap='20px' justifyContent='space-evenly' alignItems='center' width='100%'>
                                <Stack gap='5px' alignItems='center'>
                                    <Typography color='#999999' fontSize='12px'>Phone Number</Typography>
                                    <Typography fontSize='12px'>{rowViewed.phoneNumber}</Typography>
                                </Stack>
                                <Stack gap='5px' alignItems='center'>
                                    <Typography color='#999999' fontSize='12px'>Email</Typography>
                                    <Typography fontSize='12px'>{rowViewed.email}</Typography>
                                </Stack>
                            </Stack>
                            <Button
                            sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color: 'white', width:'50%' , arginTop:'30px', height:'40px', padding: '20px', fontSize:'13px'}}
                            onClick={() => window.open(`${ApiService.viewUploadedFile}?Uri=${confirmationLetterUrl}`, '_blank')}
                            >
                              DOWNLOAD CONFIRMATION LETTER
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    )
}