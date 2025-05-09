import PageWrapper from "../../components/container/PageWrapper";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 

export function Error404() {
  const navigate = useNavigate(); 

  return (
    <PageWrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
      >
        <Box
          component="img"
          src="/assets/image/ilustrasi-search-2.svg"
          alt="Page not found illustration"
          width="300px"
          marginBottom={3}
        />
        
        <Typography
          variant="h4"
          color="textPrimary"
          gutterBottom
          style={{
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Page not found
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          paragraph
          style={{
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          The page you have requested does not appear to exist. <br />
          Please review your URL or return to the homepage.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          style={{
            fontSize: "12px", 
            fontWeight: 600,
            width: "fit-content", 
            padding: "4px 24px", 
            marginTop: "15px", 
            textTransform: "uppercase",
          }}
          onClick={() => navigate("/")}
        >
          back to homepage
        </Button>
      </Box>
    </PageWrapper>
  );
}
