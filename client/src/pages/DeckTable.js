import React from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import api,{useAPI} from '../api'
import "./pages.css"


const Delete = styled.div`
    color: #ff0000;
    cursor: pointer
    `

const EditCardAttributeInPlace = (props) =>{
  const attr = props.attr
  const [editing, setEditing] = React.useState(false);
  const [txt, setTxt] = React.useState(props.row.original[attr]);
  
  const handleClick = event => {
    setEditing(true);
  }

  const updatePlayingCardAttribute = new_value => {
    const _id =  props.row.original._id;

    console.log("saving",_id)
    api.getPlayingCardById(_id).then(old=>{
      let data = old.data.data
      console.log("existing db object:", data[attr])
      if(data[attr] === new_value){ // no need to call db 
        console.log("no changes")
        setEditing(false)
      } else {
        data[attr] = new_value;
        console.log('new db object', data[attr])
        api.updatePlayingCardById(_id, data).then(_ => {
          setEditing(false)
          setTxt(data[attr])
        })
      }
    })
  }


  if(editing){
    return <EditInPlace initialText={txt} saveChanges={updatePlayingCardAttribute}/>
  } else {
    return <div className="editable-in-place" onClick={handleClick}>{txt}</div>
  } 
}

const EditInPlace = props => {
  const [textAreaValue, setTextAreaValue] = React.useState(props.initialText)

  const handleKeystroke = event => {
    setTextAreaValue(event.target.value)
  }

  return <>
          <textarea 
            value={textAreaValue}
            onChange={handleKeystroke}
            />
          <SaveButton onClick={(e) => props.saveChanges(textAreaValue)}>Save</SaveButton>
        </>
}

const SaveButton = styled.button.attrs({
  className: `btn btn-success`,
})`
  margin: 15px 15px 15px 5px;
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