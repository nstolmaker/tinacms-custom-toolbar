// React and Tina 🦙
import React from 'react'
import { useCMS, TinaCMS } from 'tinacms'
import {GithubClient, AsyncButton, MERGE_REQUEST, MERGE_CONFLICT } from 'next-tinacms-github/dist/index'
import styled from 'styled-components'

// custom
// import { AsyncButton } from 'components'


const StyledPRButton = styled.button`
  background-Color: #4281C3;
  color: white;
  overflow: hidden;
  height: 2.25rem;
  &:hover {
    background-Color: #7FA1D5;
  }
  padding: 0 0.5rem;
  border: 1px solid #EDEDED;
  border-Radius: 0.25rem;
  margin-right: 0.5rem;
  cursor: pointer;
`
const StyledPRButtonLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-Overflow: ellipsis;
  white-Space: nowrap;
  max-Height: 1.5rem;
  min-Width: 0px;
`


export const createPR = async (cms: TinaCMS | null) => {
  if (!cms) {
    console.log("ERROR. No CMS object defined")
    return;
  }
  const github: GithubClient = cms.api.github
  
  const prTitle = `PR Originating from App`
  const prBody = `This PR was created by the Documentation Portal`

  try {
    // Check if a pull request exists:
    const existingPr = await github.fetchExistingPR()
    console.log('Pull request already exists', existingPr)

    if (!existingPr) {
      return await github.createPR(prTitle, prBody)
    }
  } catch (error) {
    // TODO: Show user feedback that an error occurred:
    console.log(`Error creating pull request: ${error}`)
  }
}

interface PRButtonType { 
  cms: TinaCMS | null,
  mockEditMode?: boolean
}


const PullRequestButton = ({cms, mockEditMode = false}:PRButtonType) => {
  if (cms === null) cms = useCMS();
  return (
    <StyledPRButton
      onClick={()=>createPR(cms)}
    >
      <StyledPRButtonLabel>Make Pull Request</StyledPRButtonLabel>
    </StyledPRButton>
  );
}

export default PullRequestButton