import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import dayjs from "dayjs";
import DifficultyChip from "../problem/DifficultyChip";
import SuccessChip from "../problem/SuccessChip";
import Tags from "../problem/Tags";
import { Fab, TextField, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { orange } from "@mui/material/colors";


type IStyledRowProps = {
  active: number;
};

const StyledTableRow = styled(TableRow)<IStyledRowProps>`
  background-color: ${(props: IStyledRowProps) =>
    props.active ? orange[100] : "inherit"};
`;

const FilterField = styled(TextField)`
  margin-right: 16px; // adjust this value to your needs
`;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export interface ITableFields {
  label: string;
  field: string;
  type:
    | "date"
    | "difficulty"
    | "success"
    | "tags"
    | "count"
    | "string"
    | "index";
}

export interface FilterTableProps {
  title: string;
  link?: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  fields: ITableFields[];
}

function FilterTableHead(props: FilterTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {props.fields.map((field) => {
          return (
            <TableCell
              key={field.field}
              align="left"
              sortDirection={orderBy === field.field ? order : false}
            >
              <TableSortLabel
                active={orderBy === field.field}
                direction={orderBy === field.field ? order : "asc"}
                onClick={createSortHandler(field.field)}
              >
                {field.label}
                {orderBy === field.field ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export interface IFilterTableProps {
  createLink?: string;
  viewLink?: string;
  highlightId?: number;
  title: string;
  rows: any;
  fields: ITableFields[];
  defaultOrder?: Order;
  defaultOrderBy?: string;
}

const FilterTable = ({
  createLink,
  viewLink,
  highlightId,
  title,
  rows = [],
  fields = [],
  defaultOrder,
  defaultOrderBy
}: IFilterTableProps) => {
  const [order, setOrder] = React.useState<Order>(defaultOrder || "asc");
  const [orderBy, setOrderBy] = React.useState<string>(defaultOrderBy || "");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterText, setFilterText] = React.useState("");

  const navigate = useNavigate();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const getFilteredRows = (rows: any[]) => {
    if (!filterText) {
      return rows;
    }

    return rows.filter((row) =>
      fields.some((field) => {
        let value: any = row;
        const parts = field.field.split(".");
        for (const part of parts) {
          if (value[part] === null || value[part] === undefined) {
            value = "";
            break;
          }
          value = value[part];
        }

        if (value === undefined || value === null) {
          value = "";
        }

        return value
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase());
      })
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderFieldType = (
    type: string,
    value: string | string[],
    index: number
  ) => {
    switch (type) {
      case "date":
        return dayjs(value as string).format("DD-MM-YYYY");
      case "difficulty":
        return <DifficultyChip label={value as string} />;
      case "success":
        return (
          <SuccessChip score={parseInt(value as string)} label={value + "%"} />
        );
      case "tags":
        return <Tags tags={value as string[]} />;
      case "index":
        return index;
      case "count":
        return value.length;
      default:
        return value;
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
          <FilterField
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Filter"
          />
          {createLink && (
            <Tooltip title="Add">
              <Box display="flex" alignItems="center">
                <Fab
                  color="primary"
                  aria-label="add"
                  component={Link}
                  to={createLink}
                >
                  <Add />
                </Fab>
              </Box>
            </Tooltip>
          )}
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <FilterTableHead
              title={title}
              fields={fields}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {rows.length === 0 ? (
                <TableRow
                  style={{
                    height: 55 * emptyRows,
                  }}
                >
                  <TableCell colSpan={fields.length} align="center">
                    {" "}
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(getFilteredRows(rows), getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const rank = index + 1;

                    return (
                      <StyledTableRow
                        sx={{ cursor: viewLink ? "pointer" : "inherit" }}
                        hover
                        active={highlightId && highlightId === row.id ? 1 : 0}
                        tabIndex={-1}
                        key={index}
                        onClick={() =>
                          viewLink ? navigate(viewLink + row.id) : () => {}
                        }
                      >
                        {fields.map((field, innerIndex) => {
                          let value: any = row;
                          const parts = field.field.split(".");
                          for (const part of parts) {
                            if (value[part] === null) {
                              value = "";
                              break;
                            }
                            value = value[part];
                          }

                          return (
                            <TableCell
                              component="th"
                              align="left"
                              id={labelId}
                              key={`${index}-${innerIndex}`}
                              scope="row"
                            >
                              {renderFieldType(field.type, value, rank)}
                            </TableCell>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 55 * emptyRows,
                  }}
                >
                  <TableCell colSpan={fields.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default FilterTable;