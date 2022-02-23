import React, { useState, useEffect } from 'react'
import { Modal } from "react-bootstrap";
import { Button } from '@material-ui/core'
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  EmailIcon,
  WhatsappIcon,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
//import { Success } from './../../../utils/errors';
import 'antd/dist/antd.css'
import EncryptProfileUrl from '../../components/encryptProfileUrl';

function ShareMediaContent(props, { history }) {
  const [copy, setCopy] = useState();
  const [shareUrl, setShareUrl] = useState();
  useEffect(() => {

    async function fetchdata() {
      if (props.url_id) {

        var url_val = EncryptProfileUrl(props.url_id);
        const path = window.location.origin;
        // const ids = Buffer.from(props.url_id).toString('base64');
        const url = path + url_val;
        setShareUrl(url);

      }
    }
    fetchdata();
  }, [props.url_id]);

  const handleCopy = (event) => {
    setCopy(true);
    toast.success('copied');
  };
  
  return (

    <Modal
      onHide={props.close}
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Share with</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EmailShareButton
          url={shareUrl}

        >
          <EmailIcon size={40} round />
        </EmailShareButton>
        &nbsp;
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        &nbsp;
        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
        &nbsp;
        <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
          <span className="btn btn-primary">Copy</span>
        </CopyToClipboard>
      </Modal.Body>
      <Modal.Footer>
        <Button className="can-btn btn" onClick={props.close}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ShareMediaContent;


