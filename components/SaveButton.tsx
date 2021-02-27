import React from 'react'
import { TinaCMS } from 'tinacms'
import styled from 'styled-components'

interface Props { 
  cms: TinaCMS | null,
  mockEditMode?: boolean
}


const StyledSaveButton = styled.div`
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

const StyledSaveButtonLabel = styled.span`
  text-Overflow: ellipsis;
  overflow: hidden;
`

const SaveButton = ({cms, mockEditMode = false}:Props) => {

  const handleSave = (e:React.MouseEvent) => {
    console.log("CustomToolbar :: Running Save...")
    if (typeof cms === 'object' && cms !== null) {
      // @ts-ignore
      if (cms.plugins.getType('form')?.all().length > 0) cms.plugins.getType('form')?.all()[0].submit()
    }
  }

  return (
    <StyledSaveButton onClick={handleSave}>
      <StyledSaveButtonLabel>Save</StyledSaveButtonLabel>
    </StyledSaveButton>
  )
}

export default SaveButton