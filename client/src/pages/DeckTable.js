import React from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
    `

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer
    `

const UpdatePlayingCard = (props) => {
  console.log("updaitgn playnig cards props", props)
  const updatePlayingCard = event => {
      event.preventDefault()
      window.location.href = `/playingCards/update/${props.row.original._id}`

  }

  return <Update onClick={updatePlayingCard}>Update</Update>
}

// class DeleteMovie extends Component {
//     deleteUser = event => {
//         event.preventDefault()

//         if (
//             window.confirm(
//                 `Do tou want to delete the movie ${this.props.id} permanently?`,
//             )
//         ) {
//             api.deleteMovieById(this.props.id)
//             window.location.reload()
//         }
//     }

//     render() {
//         return <Delete onClick={this.deleteUser}>Delete</Delete>
//     }
// }
  
const DeckTable = (props) => {
  const [data, setData] = React.useState(React.useMemo(() => props.data, []));

    const columns = React.useMemo(() => [
      { 
        Header: "cards",
        columns: [
          {
            Header: 'Name',
            accessor: 'name', 
          },
          {
            Header: 'Quantity',
            accessor: 'quantity',
          }, 
        ],
      },
      {
        Header: "",
        id: "delete",
        accessor: (str) => "delete",

        Cell: (tableProps) => (
          <UpdatePlayingCard 
            {...tableProps}
          />
        )
      }], [data])
    
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