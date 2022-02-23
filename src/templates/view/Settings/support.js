import React from 'react'
import { Modal } from "react-bootstrap";
import { Button } from '@material-ui/core'

function Support(props, { history }) {
   
    return (

        <Modal
         show={props.show}
         onHide={props.close}
         size="lg"
         aria-labelledby="contained-modal-title-vcenter"
         centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Support</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Contact us:</strong> <br/>Support@Dapify.co</p>
        </Modal.Body>
        <Modal.Footer>
          <Button  className='btn' onClick={props.close}>Cancel</Button>
        </Modal.Footer>
      </Modal> 
    )
}

export default Support;


