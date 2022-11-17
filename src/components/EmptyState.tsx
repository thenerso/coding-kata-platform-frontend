import { Button } from "@mui/material";

/**
 * Componenet Types
 */
type IProps = {
  message?: string;
  action?: () => void;
  actionLabel?: string;
};

const EmptyState = ({ message, action, actionLabel }: IProps) => {
  return (
    <>
      <p>{message}</p>
      <Button variant="contained" onClick={action}>
        {actionLabel}
      </Button>
    </>
  );
};
export default EmptyState;
