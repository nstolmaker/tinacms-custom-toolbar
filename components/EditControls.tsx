import React, { createRef, Ref, useEffect, useRef } from 'react'
import { TinaCMS } from 'tinacms'
import styled from 'styled-components'
import EditLink from './EditLink'
import ResetButton from './ResetButton'
import ExitButton from './ExitButton'
import SaveButton from './SaveButton'
import PullRequestButton from './PullRequestButton'
import BranchSelector from './BranchSelector'
// import { TimelineLite } from 'gsap'
// import { animations } from 'utils/animations'
// import { BranchSelector, EditLink, ExitButton, PullRequestButton, ResetButton, SaveButton } from 'components';


interface Props {
  cms: TinaCMS | null,
  setEditing: (arg0: boolean)=>void,
  editing: boolean,
  mockEditMode?: boolean
}

const AllControlsWrapper = styled.div`
  border: 2px solid pink;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const EditControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 2px solid green;
  width: auto;
  height: 2rem;
  margin: 1rem;
`

const EditControls = ({cms, setEditing, editing, mockEditMode = false}:Props) => {
  /* 
    START animation stuff 
  */
  // const containerFrontRef:Ref<HTMLDivElement> = createRef()
  // const containerBackRef:Ref<HTMLDivElement> = createRef()
  // // TODO: Turn this whole animation thingy I've done into a custom hook that returns these functions instead of including it the way I am now
  // // This sets up the animation timeline on the first component mount only, so we're ready when we want to animate.
  // const tl = useRef(null);
  // let exposeTL = new TimelineLite({paused: true})
  // useEffect(() => {
  //   // @ts-ignore
  //   tl.current = animations['exposeEditControls'](containerFrontRef, containerBackRef)
  // }, [])

  const handleEnterEditing = (newMode:boolean) => {
    // animate the transition to editing, and put focus on the element after it shows
    // @ts-ignore
    // tl?.current?.restart()
    setEditing(newMode)
  }

  const handleExitEditing = (newMode:boolean) =>{
    // @ts-ignore
    // tl?.current?.reverse()
    setEditing(newMode)
  }

  return (
    <AllControlsWrapper>
      <EditControlsWrapper style={{width: '0'}}> 
      {/* ref={containerBackRef} 
      }>*/}
        <BranchSelector mockEditMode={mockEditMode} />
        <PullRequestButton cms={cms} />
        <SaveButton cms={cms} />
        <ResetButton cms={cms} />
        <ExitButton cms={cms} setEditing={handleExitEditing} />
      </EditControlsWrapper>
      <div 
      /* ref={containerFrontRef} */
      style={{display: 'flex', overflow: 'hidden'}}>
        <EditLink cms={cms} editing={editing} setEditing={handleEnterEditing} />
      </div>
    </AllControlsWrapper>
  )
}

export default EditControls