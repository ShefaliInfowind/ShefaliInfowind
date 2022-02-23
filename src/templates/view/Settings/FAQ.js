import React from 'react'
import { Modal } from "react-bootstrap";
import { Button } from '@material-ui/core'

function FAQ(props, { history }) {
    return (
     
        <Modal
         onHide={props.close}
         show={props.show}
         size="lg"
         aria-labelledby="contained-modal-title-vcenter"
         centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">FAQ'S</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <p><strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</strong> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

              <p><strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</strong> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button  className="can-btn btn" onClick={props.close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default FAQ;


