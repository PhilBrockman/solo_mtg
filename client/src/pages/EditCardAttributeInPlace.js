import React from 'react'
import styled from 'styled-components'
import api,{useAPI} from '../api'

export const EditCardAttributeInPlace = (props) =>{
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