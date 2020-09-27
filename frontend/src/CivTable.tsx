import React from 'react'
import { useTable, useSortBy, Column, usePagination } from 'react-table'
import CivIcon from "./CivIcon";
import {IWinCountsWrap} from "./Types";

interface ICivData {
  civ: string,
  played: number,
  winPercentage: string
}

const CivTable: React.FC<IWinCountsWrap> = ({ winCounts, sortBy, resultLimit}) => {
  const data = React.useMemo(
    ():ICivData[] => {
      return Object.keys(winCounts).map((civ) => {
        const won = winCounts[civ].wins;
        const played = won + winCounts[civ].losses;
        return {
          civ: civ,
          played: played,
          winPercentage: ((won / played) * 100).toFixed(2)
        } as ICivData
      });
    },
    [winCounts]
  );
  const columns = React.useMemo(
    ():Column<ICivData>[] => [
      {
        Header: 'Civilization',
        id: 'civ',
        accessor: 'civ',
        Cell: ({cell: {value}}) => <div className="civ-with-name">
          <CivIcon civ={value}/>
          <label>{value}</label>
        </div>
      },
      {
        Header: 'Played',
        id: 'played',
        accessor: 'played',
      },
      {
        Header: 'Win %',
        id: 'win',
        accessor: 'winPercentage',
      },
    ] as Column<ICivData>[],
    []
  )
  const tableInstance = useTable<ICivData>({
    columns, data,
    initialState: {
      sortBy: [{id: sortBy, desc: true}],
      pageIndex: 0,
      pageSize: resultLimit? resultLimit : 10000000
    },
  }, useSortBy, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    prepareRow,
  } = tableInstance

  const items = resultLimit? page: rows;

  return (
    <table className="civ-table" {...getTableProps()}>
      <thead>
      {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
              headerGroup.headers.map(column => (
                // Apply the header cell props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
      {// Loop over the table rows
        items.map(row => {
          // Prepare the row for display
          prepareRow(row)
          return (
            // Apply the row props
            <tr {...row.getRowProps()}>
              {// Loop over the rows cells
                row.cells.map((cell, index) => {
                  // Apply the cell props
                  return (
                    <td {...cell.getCellProps()}>
                      {// Render the cell contents
                        cell.render('Cell')}
                    </td>
                  )
                })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )

}

export default CivTable
