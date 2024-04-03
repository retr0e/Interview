import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import EnhancedTableHead from "../EnhancedTableHead/enhancedTableHead.jsx";
import EnhancedTableToolbar from "../EnhancedTableToolbar/enhancedTableToolbar.jsx";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrder,
  setOrderBy,
  setSelected,
  setPage,
  setRowsPerPage,
  setData,
} from "../../Features/tableSlice.js";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable() {
  const dispatch = useDispatch();
  const { order, orderBy, selected, page, rowsPerPage, data } = useSelector(
    (state) => state.table
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.stackexchange.com/2.3/tags?pagesize=100&sort=popular&site=stackoverflow"
        );
        const result = await response.json();
        dispatch(setData(result));
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    dispatch(setOrder(isAsc ? "desc" : "asc"));
    dispatch(setOrderBy(property));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.items.map((n) => n.name);
      dispatch(setSelected(newSelected));
      return;
    }
    dispatch(setSelected([]));
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    dispatch(setSelected(newSelected));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setPage(0));
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  let emptyRows;

  if (!data.items == undefined) {
    emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, data.items.length - page * rowsPerPage);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        {/*
         *
         */}
        {data.items == undefined ? null : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={data.items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}

        {/*
         *
         */}
        <TableContainer>
          <Table
            sx={{ minWidth: 400 }}
            aria-labelledby='tableTitle'
            size='small'
          >
            {/*
             *
             */}
            {data.items == undefined ? null : (
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.items.length}
              />
            )}

            {/*
             *
             */}
            <TableBody>
              {data.items == undefined ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Loading data please wait...
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(data.items, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'
                        >
                          {row.name}
                        </TableCell>
                        <TableCell>{row.count}</TableCell>
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
