import styled from 'styled-components'

export const Label = styled.label`
    margin: 5px;
`

export const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

export const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
`

export const CancelButton = styled.a.attrs({
  className: `btn btn-danger`,
})`
  margin: 15px 15px 15px 5px;
`

export const Wrapper = styled.div.attrs({
  className: 'form-group',
})`
  margin: 0 30px;
`