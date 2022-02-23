import React from 'react'
import { Modal } from "react-bootstrap";
import { Button } from '@material-ui/core'

function PrivacyPolicy(props, { history }) {

  return (

    <Modal
      show={props.show}
      onHide={props.close}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Privacy Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas hendrerit porta ipsum, condimentum auctor libero tempus vel.
          Morbi eleifend diam ligula, non feugiat dolor fringilla a. Nam volutpat elit et mi laoreet porttitor. Integer scelerisque,
          leo ut laoreet varius, lectus velit scelerisque ligula, eu porta sapien leo et enim. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Aenean tincidunt convallis ipsum, ac suscipit velit lobortis vel. Cras quis sapien odio. Duis eu laoreet nibh, id mollis purus. Morbi at tellus felis.
          Maecenas fermentum eros non dolor faucibus tristique. Phasellus fermentum nulla diam, eu pretium leo sagittis eu. Nunc non massa a elit consequat tincidunt vel vel dui.
          Ut lacinia odio posuere scelerisque elementum. Suspendisse vestibulum ac diam vitae ultrices.
          <br/><br/>
          Vestibulum sodales ex ligula, sed pellentesque eros posuere vitae. Nunc accumsan velit vitae pharetra imperdiet.
          Vivamus imperdiet gravida odio ut aliquet. Suspendisse sit amet posuere elit. Nullam euismod dapibus justo ut facilisis.
          Aenean ipsum augue, fermentum a pulvinar et, tristique vitae ipsum. Duis urna nunc, maximus mattis tincidunt eget, luctus eget velit.
          <br/><br/>
          Donec faucibus, purus et vehicula pulvinar, dolor orci finibus diam, non fermentum purus mauris placerat dui.
          Mauris ac placerat turpis. Duis elit ligula, pellentesque sed cursus vitae, molestie nec lectus. Aliquam libero leo, blandit et ligula sed, placerat porta nisl.
          Suspendisse purus nisl, ultricies id faucibus a, vehicula vitae arcu. Aenean interdum et orci vitae laoreet. Aliquam erat volutpat. Mauris vitae nibh dolor.
          Vivamus quis enim placerat, malesuada nisl vel, ultrices purus. Nam faucibus nulla eget tellus luctus, id commodo sapien lacinia. Donec volutpat ligula feugiat ex consequat,
          et tincidunt diam volutpat. Proin pharetra erat eu magna elementum interdum. Nullam condimentum gravida massa id vulputate. Nullam sed gravida odio, a mattis justo.</p>
      </Modal.Body>
        <Modal.Footer>
          <Button className='btn' onClick={props.close}>Cancel</Button>
        </Modal.Footer>
    </Modal>
      )
}

export default PrivacyPolicy;


