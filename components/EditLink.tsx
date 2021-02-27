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
  height: 2rem;
  border: 1px solid black;
`

const EditLink = (props: EditLinkProps) => {
  const { cms, editing, setEditing, mockEditMode = false } = props
    return (
      <StyledEditButton 
        onClick={() => { if (!mockEditMode) { setEditing(!editing); cms?.toggle() }}}
      >{editing ? 'Exit Edit' : 'Edit Page'}
      </StyledEditButton>
    )
  }
  

export default EditLink
