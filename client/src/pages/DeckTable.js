import React from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import api,{useAPI} from '../api'
import {DisplayCard} from '../components'
import "./pages.css"

import {EditCardAttributeInPlace} from "./EditCardAttributeInPlace"


const Delete = styled.div`
    color: #ff0000;
    cursor: pointer
    `

const DeletePlayingCard = props => {
    const deleteCard = event => {
        event.preventDefault()
        if (window.confirm(
            `Do you want to remove ${props.row.original.name}?`,
            )) {
              api.deletePlayingCardById(props.row.original._id)
              window.location.reload()
        }
      }
    return <Delete onClick={deleteCard}>Delete</Delete>
}
  
const DeckTable = (props) => {
  const data = React.useMemo(() => props.data, [props.data]);

    const columns = React.useMemo(() => [
      { 
        Header: "cards",
        columns: [
          {
            Header: 'Name',
            accessor: 'name', 
            Cell: (tableProps) => (
              <EditCardAttributeInPlace
                {...tableProps}
                attr="name"
              />
            )
          },
          {
            Header: 'Rules Text',
            accessor: 'rulesText',

            Cell: (tableProps) => (
              <EditCardAttributeInPlace
                {...tableProps}
                attr="rulesText"
              />
            )
          }, 
          {
            Header: 'url',
            accessor: 'url',
            Cell: (tableProps) => (
              <DisplayCard
                {...tableProps}
              />
            )
          }, 
        ],
      },
      {
        Header: "",
        id: "delete",
        accessor: (str) => "delete",

        Cell: (tableProps) => (
          <DeletePlayingCard 
            {...tableProps}
          />
        )
      },
    ], [])
    
    const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    } = useTable({ columns, data })

    if(data){
        return (     
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        background: 'papayawhip',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table> 
        )
    } else {
        console.log("waiting from the MTG table")
        return (
            <> waiting </>
        )
    }
}

export default DeckTable