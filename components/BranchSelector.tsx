/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import {
  useCMS,
  Modal,
  ModalPopup,
  ModalHeader,
  ModalBody,
  ModalActions,
  TinaCMS,
  Select,
} from 'tinacms'
import { Button } from '@tinacms/styles'
import { LoadingDots } from '@tinacms/react-forms'
import { CREATE_BRANCH, GithubClient, Branch, BranchesType } from 'next-tinacms-github/dist'
import styled from 'styled-components'

// custom
import Dropdown from './Dropdown'; // this is a component of the github integration but could be moved to the project level if we wanted.



interface BranchSwitcherProps {
  mockEditMode?: boolean,
  onBranchChange?(branch: string): void
}


const StyledBranchSelector = styled.div`
  display: flex;
  align-Items: center;
  margin-Right: 0.3rem;
  & .MuiFormLabel-root {
    color: #EDEDED;
    margin: 0.3rem;
  }
`

const StyledSelect = styled.div`
  border: 1px solid black;
  border-Color: #EDEDED;
  box-Shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-Radius: 0.25rem;
  background: #EDEDED;
  padding: 0.25rem 0.25rem 0.25rem 0.75rem;
  display: flex;
  margin-Right: 0.1rem;
  height: 2.25rem;
  & .MuiSelect-select:focus {
    background-Color: inherit;
  }
`

const BranchSelector = ({ onBranchChange, mockEditMode = false}: BranchSwitcherProps) => {

  let cms:TinaCMS | null
  let github:GithubClient | null
  github = null
  if (!mockEditMode) { 
    let cms = useCMS() 
    github = cms.api.github
  }

  const [open, setOpen] = React.useState(false)
  const [confirmSwitchProps, setConfirmSwitchProps] = React.useState<any>()
  const [createBranchProps, setCreateBranchProps] = React.useState<any>()
  const [filterValue, setFilterValue] = React.useState('')
  const selectListRef = React.useRef<HTMLElement>()

  const [branchStatus, setBranchStatus] = React.useState<
    'pending' | 'loaded' | 'error'
  >('pending')
  const [branches, setBranches] = React.useState<Branch[]>([])

  const updateBranchList = React.useCallback(() => {    
    if (github) { 
      github
      .getBranchList()
      .then((branches:any) => {
        console.log({branches})
        setBranches(branches)
        setBranchStatus('loaded')
      })
      .catch((e) => {
        if (process.env.NODE_ENV==='development') console.log("!!! Error loading branches: ", e);
        setBranchStatus('error')
      })
    } else {
      // use default values // TODO change to check if (mockEditMode)
      setBranches([
        {name:'sandbox', protected: true, mergeInto: 'sandbox'},
        {name:'unpublished', protected: true, mergeInto: 'unpublished'},
        {name:'published', protected: true, mergeInto: 'published'}
      ])
      setBranchStatus('loaded')
    }
  }, [github, setBranches, setBranchStatus])

  React.useEffect(() => {
    updateBranchList()
    if (cms && typeof cms === 'object' && !mockEditMode) { 
      cms.events.subscribe(CREATE_BRANCH, updateBranchList)
    }
  }, [])

  const closeDropdown = () => {
    setOpen(false)
    if (selectListRef.current) {
      selectListRef.current.scrollTop = 0
    }
  }

  return (
    <StyledBranchSelector>
      <label id="label">Workspace: </label>
      <Dropdown>
        <div ref={selectListRef as any}>
          {branchStatus === 'pending' && (
            <div>
              <LoadingDots color="var(--tina-color-primary)" />
            </div>
          )}
          {branchStatus === 'loaded' && (
            <StyledSelect><select
              value={github ? github?.branchName === 'main' ? 'unpublished' : github?.branchName : 'unpublished'}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setConfirmSwitchProps(event.target.value)
              }}
            >
              {branches?.map((item: Branch) => <option value={item.name} key={item.name}>{item.name}</option>)}
            </select></StyledSelect>

          )}
          {branchStatus === 'error' && (
            <div>
              We had trouble loading branches. Please refresh to try again.
            </div>
          )}
        </div>
      </Dropdown>
      {confirmSwitchProps && (
        <ConfirmSwitchBranchModal
          name={confirmSwitchProps}
          onBranchChange={() => {
            github?.checkout(confirmSwitchProps)
            closeDropdown()
            if (onBranchChange) {
              onBranchChange(confirmSwitchProps)
            }
            setConfirmSwitchProps(null)
            // setCreateBranchProps(null)
          }}
          close={() => {
            setConfirmSwitchProps(null)
          }}
        />
      )}
    </StyledBranchSelector>
  )
}


const ConfirmSwitchBranchModal = ({ name, onBranchChange, close, classes }: any) => {
  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>Switch Branch</ModalHeader>
        <ModalBody
          padded={true}
          onKeyPress={(e: React.KeyboardEvent) =>
            e.charCode === 13 ? (onBranchChange() as any) : null
          }
        >
          <p>
            Are you sure you want to switch to branch{' '}
            {name}?
          </p>
        </ModalBody>
        <ModalActions>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={onBranchChange} primary>
            Switch Branch
          </Button>
        </ModalActions>
      </ModalPopup>
    </Modal>
  )
}


export default BranchSelector