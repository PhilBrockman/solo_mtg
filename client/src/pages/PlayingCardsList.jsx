
import React from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import api from '../api'

const Wrapper = styled.div`
        padding: 0 40px 40px 40px;
    `

const PlayingCardsList = () => {
    const [playingCards, setPlayingCards] = React.useState(null)

    React.useEffect(() => {
        console.log("running effect")
        api.getAllPlayingCards().then(playingCards => {
            setPlayingCards(playingCards)
            console.log('TCL: PlayingCardsList -> render -> playingCards', playingCards)
        })
       }, []);

    console.log('playingCards', playingCards)
   if(playingCards?.data?.data){
        return (
        <Wrapper>
            <MTGTable 
                data={playingCards.data.data}
                />
        </Wrapper>
        )
    } else {
        return (
            <>Loading...</>
        )
    }
}

const MTGTable = (props) => {
    const data = React.useMemo(() => props.data, [props])
    const columns = React.useMemo(() => [
        {
          Header: 'Name',
          accessor: 'name', // accessor is the "key" in the data
        },
        {
          Header: 'Quantity',
          accessor: 'quantity',
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

export default PlayingCardsList