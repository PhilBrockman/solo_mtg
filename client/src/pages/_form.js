import React from 'react'
import styled from 'styled-components'

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
      <Wrapper>
        <form onSubmit={props.submitHandler}>
          { Object.keys(initialForm).map((key) => {
              if(initialForm.hasOwnProperty(key)){
                console.log("key:", key)
                return(
                  <div key={key}>
                    <Label>{initialForm[key].label}</Label>
                      <InputText
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
          <Button>Submit</Button> <CancelButton  href={'/playingCards/list'}>Cancel</CancelButton>
        </form>
      </Wrapper>
    );
  
}

function formReducer (prevState, {id, value}) {
  const newState = {...prevState}
  newState[id] = value
  return newState;
};

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
  className: `btn btn-danger`,
})`
  margin: 15px 15px 15px 5px;
`

const Wrapper = styled.div.attrs({
  className: 'form-group',
})`
  margin: 0 30px;
`