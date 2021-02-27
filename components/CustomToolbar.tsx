import React, { createRef, Ref, useEffect, useRef } from 'react'

// Tina, eat your food!
import { TinaCMS, useCMS, Plugin } from 'tinacms'

// styled components
import styled from 'styled-components';

// components
// import { EditLink, AccountMenu, ResetButton, ExitButton, PullRequestButton, EditControls, SaveButton, BranchSelector } from 'components'
import EditControls from './EditControls'

type Props = {
  open: boolean,
  editing: boolean,
  setEditing: (arg0: boolean)=>void,
  cms: TinaCMS | null,
  handleDrawerOpen: ()=>void,
  handleDrawerClose: ()=>void,
  children?: React.ReactElement | undefined
}

const StyledCustomToolbar = styled.div`
border-bottom: 1px solid #999;
min-height: 4rem;
width: 100%;
position: fixed;
background: #CECECE;
top: 0;
display: flex;
flex-direction: row;
`

const CustomToolbar = ({children, editing, setEditing, open, cms, handleDrawerOpen, handleDrawerClose }:Props) => {
  
  return (
    <StyledCustomToolbar>
        <h1>E1P Documentation</h1>
        {(typeof cms === 'object' && (cms !== null && cms.hasOwnProperty('_enabled'))) ? <div style={{display: 'flex'}}>
            <EditControls cms={cms} editing={editing} setEditing={setEditing} />
          </div>
        : <div style={{display: 'flex', flexDirection: 'row'}}>empty
          </div>
        }
        {children}
    </StyledCustomToolbar>
  );
}

export default CustomToolbar