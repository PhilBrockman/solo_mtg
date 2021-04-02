import React from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import api from '../api'

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
    `

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer
    `

const UpdatePlayingCard = (props) => {
  const updatePlayingCard = event => {
      event.preventDefault()
      window.location.href = `/playingCards/update/${props.row.original._id}`

  }

  return <Update onClick={updatePlayingCard}>Update</Update>
}

const PlayingCardRulesText = (props) =>{
  const [editing, setEditing] = React.useState(false)
  const handleClick = event => {
    console.log("toggling editing to true")
    setEditing(true)
  }
  return <div onClick={handleClick}>{props.row.original.rulesText}</div>
}

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
          },
          {
            Header: 'Rules Text',
            accessor: 'rulesText',

            Cell: (tableProps) => (
              <PlayingCardRulesText
                {...tableProps}
              />
            )
          }, 
          {
            Header: 'img',
            accessor: 'img',
          }, 
        ],
      },
      {
        Header: "",
        id: "update",
        accessor: (str) => "udate",

        Cell: (tableProps) => (
          <UpdatePlayingCard 
            {...tableProps}
          />
        )
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