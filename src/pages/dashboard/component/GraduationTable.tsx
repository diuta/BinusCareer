import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

const formatValue = (value) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
          maximumFractionDigits: 0,
        }).format(value)
      ?? value.toString();
  }
  return value;
};

function GraduationTable({ data }) {
  const isEmptyData = !data || data.length === 0;

  return (
    <TableContainer
      component={Paper}
      style={{
        height: "100%",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {["Graduation Year", "Graduation Period", "Total Graduate"].map(
              (header) => (
                <TableCell
                  key={header}
                  style={{ backgroundColor: "#F2F2F2", fontWeight: "bold" }}
                >
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmptyData ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography variant="body1" color="textSecondary">
                  No Data
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <React.Fragment key={item.year}>
                {item.periods.map((period) => (
                  <TableRow key={`${item.year}-${period.period}`}>
                    {item.periods.indexOf(period) === 0 && (
                      <TableCell rowSpan={item.periods.length}>
                        {item.year}
                      </TableCell>
                    )}
                    <TableCell>{period.period}</TableCell>
                    <TableCell>{formatValue(period.graduates)}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

GraduationTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      periods: PropTypes.arrayOf(
        PropTypes.shape({
          period: PropTypes.string.isRequired,
          graduates: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default GraduationTable;
