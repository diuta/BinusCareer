import { Divider } from "@mui/material";

import PageWrapper from "../../components/container/PageWrapper";
import ApprovedTable from "./components/ApprovedTable";
import RequestTable from "./components/TableApprovalRequest";

export function ApprovalRequestAlumniPage (){   
    return (
        <PageWrapper>
            <RequestTable/>
            <Divider sx={{marginY: "20px"}}/>
            <ApprovedTable/>
        </PageWrapper>
    )
}