import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CustomButton({ url = "#" }: { url?: string }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      onClick={() => navigate(url)}
      sx={{
        background: "linear-gradient(to right, #b0b0b0, #d3d3d3)",
        whiteSpace: "nowrap",
        borderRadius: "6px",
        color: "#fff",
        width: "100px",
        height: "35px",
        padding: "none",
        marginX: "auto",
        textTransform: "none",
        lineHeight: "40px",
        boxShadow: "none",
        "&:hover": {
          background: "linear-gradient(to right, #a8a8a8, #c0c0c0)",
          boxShadow: "none",
        },
      }}
    >
      MORE DATA
    </Button>
  );
}

export default CustomButton;
