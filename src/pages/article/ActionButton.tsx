import React from "react";
import {
  Stack,
  Button,
} from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function ActionButton() {
  return (
    <Stack direction="row">
      <Button variant="outlined" endIcon={<EditNoteIcon />} />
      <Button variant="outlined" endIcon={<EditNoteIcon />} />
    </Stack>
  );
}
