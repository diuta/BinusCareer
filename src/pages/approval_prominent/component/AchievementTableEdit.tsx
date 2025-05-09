import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton,TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';

const AchievementTableEdit = ({ 
  userData, 
  handleClickOpen 
}) => userData.achievements.map((achievementDetail: AchievementDetail, achievementIdx: number) => (
  <TableRow key={achievementDetail.achievementId}>
    <TableCell 
      align="center" 
      sx={{ width: "60px", padding: "6px" }}
    > 
      <Typography
        fontSize="12px"
        sx={{
          color: "black" 
        }}
      >
        {achievementIdx + 1}
      </Typography>
    </TableCell>
    
    <TableCell>
      <Typography
        fontSize="12px"
        sx={{
          color: achievementDetail?.isChanged?.includes("AchievementCategory")
            ? "#028ED5" 
            : "black"
        }}
      >
        {achievementDetail.achievementCategoryName}
      </Typography>
    </TableCell>
    
    <TableCell>
      <Typography
        fontSize="12px"
        id="Achievement"
        sx={{
          color: achievementDetail?.isChanged?.includes("Achievement")
            ? "#028ED5" 
            : "black"
        }}
      >
        {achievementDetail.achievementName}
      </Typography>
    </TableCell>
    
    <TableCell>
      <IconButton
        onClick={() => {
          handleClickOpen(
          achievementDetail.achievementCategoryName,
          achievementDetail.achievementName,
          userData.alumniName,
          userData.alumniId,
          achievementDetail.achievementCategoryName,
          achievementDetail.achievementEvidence.map((item) => item.isFile),
          achievementDetail.achievementEvidence.map((item) => ({
            pathId: item.evidenceId,
            path: item.evidence,
          })),
          achievementDetail.oldEvidence
        )}}
      >
        <VisibilityIcon 
          sx={{
            color: "white",
            backgroundColor: "#F39F33",
            borderRadius: "15px",
            padding: "4px"
          }}
        />
      </IconButton>
    </TableCell>
  </TableRow>
));

interface AchievementEvidence{
  evidenceId: number;
  evidenceType: string;
  evidence: string | null;
  isFile: boolean;
  isOld: boolean;
}

interface AchievementDetail {
  achievementId
  achievementCategoryId: number;
  achievementCategoryName: string;
  achievementName: string;
  prevId: number | null;
  achievementEvidence: AchievementEvidence[];
  isChanged: string[];
  currentEvidence: number[];
  oldEvidence: number[];
}

export default AchievementTableEdit;