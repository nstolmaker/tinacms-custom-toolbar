import React from 'react'
import { TinaCMS } from 'tinacms'
import styled from 'styled-components'

interface Props { 
  cms: TinaCMS | null,
  mockEditMode?: boolean
}

const StyledResetButton = styled.div`
  background-Color: #4281C3;
  color: white;
  overflow: hidden;
  max-Height: 2.25rem;
  &:hover {
    background-Color: #7FA1D5;
  }
  padding: 0.5rem;
  border: 1px solid #EDEDED;
  border-Radius: 0.25rem;
  margin-right: 0.5rem;
  cursor: pointer;
`


const StyledButtonLabel = styled.label`
  text-overflow: ellipsis;
  overflow: hidden;
`
const ResetButton = ({cms, mockEditMode = false}:Props) => {

  const handleReset = () => {
    if (typeof cms === 'object' && cms !== null) {
      // @ts-ignore 
      if (cms.plugins.getType('form').all()?.length > 0) !cms.plugins.getType('form')?.all()[0].pristine && cms.plugins.getType('form')?.all()[0].finalForm.reset()
    }
  }

  return (
    <StyledResetButton 
    >
      <StyledButtonLabel>Reset</StyledButtonLabel>
    </StyledResetButton>
  )
}

export default ResetButton