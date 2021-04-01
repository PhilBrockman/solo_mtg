import React from 'react'
import api from '../api'
import styled from 'styled-components'


const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

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



const initialForm = {
    username: {
      label: 'Username',
      value: '',
    },
    email: {
      label: 'Email',
      value: '',
    },
    password: {
      label: 'Password',
      value: '',
    },
  };

const PlayingCardsInsert = props => {
    const useForm = (initialValues, onSubmit) => {
        const [state, dispatch] = React.useReducer(formReducer, initialValues);

        React.useEffect(() => {
            console.log('state changed', state)
        }, [state])
      
        function changeHandler ({target: {value, id}}) {
          const updatedElement = {...state[id]};
          updatedElement.value = value;
          dispatch({id, updatedElement})
        };
      
        const submitHandler = event => {
          event.preventDefault();
          const results = Object.keys(state).reduce((final, key) => {
            final[key] = state[key].value;
            return final;
          }, {});
          onSubmit(results)
        }
      
        return {state, submitHandler, changeHandler}
    }
    function formReducer (prevState, {id, updatedElement}) {
        return {...prevState, [id]: updatedElement};
    };

    const {state, submitHandler, changeHandler} = useForm(initialForm, values => console.log(values));

    return (
        <div>
          <form onSubmit={submitHandler}>
            {Object.keys(state).map((key) => (    
            <>
            {key}
              <InputText
                onChange={changeHandler}
                key={key}
                id={key}
                value={state[key].value}
                label={state[key].label}
              />
            </>
            ))}
            <Button>Submit</Button> <CancelButton>Cancel</CancelButton>
          </form>
        </div>
      );
    
}

export default PlayingCardsInsert