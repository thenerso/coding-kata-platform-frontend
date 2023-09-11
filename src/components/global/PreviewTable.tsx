import React from "react";
import FilterTable from "./FilterTable";
import { IFilterTableProps } from "./FilterTable";
import { Box, Link } from "@mui/material";
import styled from "@emotion/styled";

const StyledLink = styled.a`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

interface PreviewTableProps extends IFilterTableProps {
  viewAllLink?: string;
}

const PreviewTable: React.FC<PreviewTableProps> = ({
  viewAllLink,
  title,
  rows,
  fields,
}) => {
  return (
    <Box>
      <FilterTable title={title} rows={rows} fields={fields} />
      {viewAllLink && (
        <Box textAlign="right" mt={2}>
          <StyledLink href={viewAllLink}>View All Submissions</StyledLink>
        </Box>
      )}
    </Box>
  );
};

export default PreviewTable;
