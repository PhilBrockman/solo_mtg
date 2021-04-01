import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})``

class Logo extends Component {
    render() {
        return (
            <Wrapper href="https://sambarros.com">
                Arcane <b>Hordes</b>
            </Wrapper>
        )
    }
}

export default Logo
