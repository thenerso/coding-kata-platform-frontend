import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";

/**
 * Componenet Types
 */
type IProps = {
  message?: string;
  action?: () => void;
  actionLabel?: string;
  displayIcon?: boolean;
};

const StyledEmptyStateWrapper = styled("div")`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmptyState = ({
  message,
  action,
  actionLabel,
  displayIcon = false,
}: IProps) => {
  return (
    <StyledEmptyStateWrapper>
      {displayIcon && <Typography variant="h1">🤔</Typography>}
      <Typography variant="body1">{message}</Typography>
      <br />
      {actionLabel && (
        <Button variant="contained" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </StyledEmptyStateWrapper>
  );
};
export default EmptyState;
