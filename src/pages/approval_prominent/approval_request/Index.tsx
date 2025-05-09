import { Divider } from "@mui/material";

import PageWrapper from "../../../components/container/PageWrapper";
import ApprovedTable from "./ApprovedTable";
import RequestTable from "./TableApprovalRequest";

export function ApprovalRequestProminentData (){
    return (
        <PageWrapper>
            <RequestTable/>
            <Divider sx={{marginY: "20px"}}/>
            <ApprovedTable/>
        </PageWrapper>
    )
}
