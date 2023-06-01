import { Card, CardProps, Box } from '@mui/material';

const StyledCard: React.FC<CardProps> = ({children, ...props}) => (
  <Box mt={2} mb={2}>
    <Card {...props}>
      {children}
    </Card>
  </Box>
);

export default StyledCard;