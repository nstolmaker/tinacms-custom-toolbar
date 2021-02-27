import React, { createRef, Ref, useEffect, useRef } from 'react'
import { TinaCMS } from 'tinacms'
import styled from 'styled-components'
import EditLink from './EditLink'
import ResetButton from './ResetButton'
import ExitButton from './ExitButton'
import SaveButton from './SaveButton'
import PullRequestButton from './PullRequestButton'
import BranchSelector from './BranchSelector'
import gsap, { TimelineLite } from "gsap";

interface Props {
  cms: TinaCMS | null,
  setEditing: (arg0: boolean)=>void,
  editing: boolean,
  mockEditMode?: boolean
}

const AllControlsWrapper = styled.div`
  display: flex;
  align-Items: center;
  justify-Content: flex-end;
`

const EditControlsWrapper = styled.div`
  display: flex;
  align-Items: center;
  padding: 0.3rem;
  border-Radius: 0.25rem;
  // justify-Content: flex-end;
  overflow: hidden;
`

const EditControls = ({cms, setEditing, editing, mockEditMode = false}:Props) => {
  /* 
    START animation stuff 
  */
  const containerFrontRef:Ref<HTMLDivElement> = createRef()
  const containerBackRef:Ref<HTMLDivElement> = createRef()
  
  function exposeEditControls(frontRef:React.RefObject<HTMLElement>, backRef:React.RefObject<HTMLElement>) {
    let tempTL = gsap.timeline({paused: true})
    // @ts-ignore fade out the front
    tempTL.fromTo(frontRef.current, {width: '100%', display: 'flex'}, {width: '0%', display: 'none', duration: 0.250, ease: "expo.out"}, 0)
    tempTL.fromTo(backRef.current, {width: '0%', display: 'none'}, { width: '100%', display: 'flex', duration: 0.250, ease: "expo.out"}, "+0.25")
    return tempTL
  }

  // // This sets up the animation timeline on the first component mount only, so we're ready when we want to animate.
  const tl = useRef(null);
  let exposeTL = new TimelineLite({paused: true})
  useEffect(() => {
    tl.current = exposeEditControls(containerFrontRef, containerBackRef)

    if (typeof cms === 'object' && (cms !== null && cms.hasOwnProperty('_enabled')) && cms.enabled) {
      tl.current.restart()
    }
  }, [])
  /*
    END animation stuff (mostly)
  */

  const handleEnterEditing = (newMode:boolean) => {
    // animate the transition to editing, and put focus on the element after it shows
    setEditing(newMode)
    // tl.current.restart()
  }

  const handleExitEditing = (newMode:boolean) =>{
    // @ts-ignore
    // tl?.current?.reverse()
    setEditing(newMode)
  }

  return (
    <AllControlsWrapper>
      <EditControlsWrapper style={{width: '0'}} ref={containerBackRef}>
        <BranchSelector mockEditMode={mockEditMode} />
        <PullRequestButton cms={cms} />
        <SaveButton cms={cms} />
        <ResetButton cms={cms} />
        <ExitButton cms={cms} setEditing={handleExitEditing} />
      </EditControlsWrapper>
      <div ref={containerFrontRef}
      style={{display: 'flex', overflow: 'hidden'}}>
        <EditLink cms={cms} editing={editing} setEditing={handleEnterEditing} />
      </div>
    </AllControlsWrapper>
  )
}

export default EditControls