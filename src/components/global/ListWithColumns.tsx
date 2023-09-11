import React from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import { Description, ArrowRight } from '@mui/icons-material';

type Field = {
  name: string;
  type: 'text' | 'icon' | 'chip';
  key: string;
};

type ListWithColumnsProps = {
  fields: Field[];
  rows: any[];
  linkTo?: (row: any) => string;
};

const ListWithColumns: React.FC<ListWithColumnsProps> = ({ fields, rows, linkTo }) => {
  return (
    <List>
      {/* Render Headers */}
      <ListItem>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={2 /* Adjust as needed */}>
              {field.name}
            </Grid>
          ))}
        </Grid>
      </ListItem>

      {/* Render Rows */}
      {rows.map((row, rowIndex) => (
        <ListItem key={rowIndex} divider>
          <ListItemButton 
            {...(linkTo ? { component: 'a', href: linkTo(row) } : {})}
        >
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={2 /* Adjust as needed */}>
                  {field.type === 'text' && <ListItemText primary={row[field.key]} />}
                  {field.type === 'icon' && <ListItemIcon><Description /></ListItemIcon>}
                  {field.type === 'chip' && <Chip label={row[field.key]} />}
                </Grid>
              ))}
              <Grid item xs={1}>
                <ListItemSecondaryAction>
                  <ArrowRight />
                </ListItemSecondaryAction>
              </Grid>
            </Grid>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ListWithColumns;
