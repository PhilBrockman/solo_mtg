import React from 'react'
import * as Widget from "./widgets.js"


export const initialForm = {
        name: {
          label: 'Card Name',
        },
        rulesText: {
          label: 'Rules Text',
        },
        img: {
          label: 'The Gatherer Img'
        }
      };

export const useForm = (initialValues, onSubmit) => {
  if(initialValues == null){
    initialValues = {name:'', rulesText:'', img: ''}
  }
  const [state, dispatch] = React.useReducer(formReducer, initialValues);

  React.useEffect(() => {
      console.log('state changed', state)
  }, [state])

  function changeHandler ({target: {value, id}}) {
    dispatch({id, value})
  };

  const submitHandler = event => {
    event.preventDefault();
    console.log('state', state)
    onSubmit(state)
  }

  return {state, submitHandler, changeHandler}
}

export const PlayingCardShard = props => {
  return (
      <Widget.Wrapper>
        <form onSubmit={props.submitHandler}>
          { Object.keys(initialForm).map((key) => {
              if(initialForm.hasOwnProperty(key)){
                console.log("key:", key)
                return(
                  <div key={key}>
                    <Widget.Label>{initialForm[key].label}</Widget.Label>
                      <Widget.InputText
                        onChange={props.changeHandler}
                        id={key}
                        value={props.state[key]}
                        />
                    </div>
                  );
              } else {
                return <div key={key}>{key}</div>
              }
            })
          }
          <Widget.Button>Submit</Widget.Button> <Widget.CancelButton  href={'/playingCards/list'}>Cancel</Widget.CancelButton>
        </form>
      </Widget.Wrapper>
    );
  
}

function formReducer (prevState, {id, value}) {
  const newState = {...prevState}
  newState[id] = value
  return newState;
};