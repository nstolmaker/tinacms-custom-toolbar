// React/Next/Tina
import React from 'react';
import { TinaCMS } from 'tinacms'
import styled from 'styled-components'

export interface EditLinkProps {
    cms: TinaCMS | null,
    editing: boolean,
    setEditing: (arg0: boolean)=>void,
    mockEditMode?: boolean
}

const StyledEditButton = styled.div`
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
  margin-right: 1rem;
  cursor: pointer;
`

const StyledEditButtonLabel = styled.span`
  overflow: hidden;
  display: flex;
  max-Height: 1.5rem;
`

const EditLink = (props: EditLinkProps) => {
  const { cms, editing, setEditing, mockEditMode = false } = props
    if (!editing) {
      return (
        <StyledEditButton 
          onClick={() => { if (!mockEditMode) { setEditing(!editing); cms?.enable() }}}
        ><StyledEditButtonLabel>Edit Page</StyledEditButtonLabel>
        </StyledEditButton>
      )
    } else {
      return <></>
    }
  }
  

export default EditLink
