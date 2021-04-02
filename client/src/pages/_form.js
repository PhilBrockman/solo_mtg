import React from 'react'
import * as Widget from "./widgets.js"


export const initialForm = {
        name: {
          label: 'Card Name',
        },
        rulesText: {
          label: 'Rules Text',
        },
        url: {
          label: 'The Gatherer Img'
        }
      };

export const useForm = (initialValues, onSubmit) => {
  const [state, dispatch] = React.useReducer(formReducer, initialValues);

  React.useEffect(() => {
      console.log('state changed', state)
  }, [state])

  function changeHandler (event) {
    dispatch( {id: event.target.name, value: event.target.value})
  };

  const submitHandler = event => {
    event.preventDefault();
    onSubmit(state)
  }

  return {state, submitHandler, changeHandler}
}

export const PlayingCardShard = props => {
  console.log("shard", props.state)
  return (
      <Widget.Wrapper>
        <form onSubmit={props.submitHandler}>
          { Object.keys(initialForm).map((key) => {
              console.log("key:", key)
              if(initialForm.hasOwnProperty(key)){
                return(
                  <div key={key}>
                    <Widget.Label>{initialForm[key].label}</Widget.Label>
                      <Widget.InputText
                        onChange={props.changeHandler}
                        key={key}
                        value={props.state[key]}
                        name={key}
                        />
                    </div>
                  );
              } else {
                return <div key={key}>{key}</div>
              }
            })
          }
          <Widget.Button>Submit</Widget.Button>
        </form>
      </Widget.Wrapper>
    );
  
}

function formReducer (prevState, {id, value}) {
  console.log("in formReducer", prevState)
  console.log("updating", id, "to", value)
  const newState = {...prevState}
  newState[id] = value
  return newState;
};