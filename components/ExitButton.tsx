import React from 'react'
import {
  useCMS,
  Modal,
  ModalPopup,
  ModalHeader,
  ModalBody,
  ModalActions, 
  TinaCMS,
} from 'tinacms'
import styled from 'styled-components'

interface Props { 
  cms: TinaCMS | null,
  setEditing: (arg0: boolean)=>void,
  mockEditMode?: boolean
}


const StyledExitButton = styled.button`
  margin-Right: 0.2rem;
  overflow: hidden;
`

const StyledExitButtonLabel = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
`

const ExitButton = ({cms, setEditing, mockEditMode = false}:Props) => {
  const [confirmExitProps, setConfirmExitProps] = React.useState<any>()
  
  const exitEditingMode = () => {
    if (typeof cms === 'object' && cms !== null) {
      setEditing(false)
      cms.disable()
      setConfirmExitProps(null)
    }
  }

  const handleExit = (e:React.MouseEvent) => {
    if (cms) {
      // @ts-ignore
      if (cms.plugins.getType('form').all()?.length > 0) cms.plugins.getType('form')?.all()[0].pristine ? exitEditingMode() : setConfirmExitProps({callback:()=>{cms.plugins.getType('form')?.all()[0].finalForm.reset(); exitEditingMode()}})
    }
  }

  return (
    <>
      <StyledExitButton onClick={handleExit}>
        <StyledExitButtonLabel>Exit</StyledExitButtonLabel>
      </StyledExitButton>
      {confirmExitProps && (
        <ConfirmExitModal
          name={confirmExitProps}
          confirmCallback={() => {
            confirmExitProps.callback()
          }}
          close={() => {
            setConfirmExitProps(null)
          }}
        />
      )}
    </>)
}

const ConfirmExitModal = ({ name, confirmCallback, close, classes }: any) => {
  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>Realy exit without saving?</ModalHeader>
        <ModalBody
          padded={true}
          onKeyPress={(e: React.KeyboardEvent) =>
            e.charCode === 13 ? (confirmCallback() as any) : null
          }
        >
          <p>
            You have unsaved changes that will be lost if you exit now. Are you sure?
          </p>
        </ModalBody>
        <ModalActions>
          <button onClick={close}>Cancel</button>
          <button onClick={confirmCallback}>Discard Changes</button>
        </ModalActions>
      </ModalPopup>
    </Modal>
  )
}

export default ExitButton;