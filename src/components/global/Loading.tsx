/**
 * Component Library imports
 */
//  import { CircularProgress, withStyles, createStyles } from "@mui/core";

import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

/**
 * Injected styles
 *
 */
const ProgressWrapper = styled("div")`
  min-height: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

/* type IProps = {
   classes: {
     progressWrapper: string;
   };
 }; */

/**
 * Renders an Activity Indicator
 *  for the application
 */
const Loading = () => (
  <ProgressWrapper>
    <CircularProgress />
  </ProgressWrapper>
);

export default Loading;
