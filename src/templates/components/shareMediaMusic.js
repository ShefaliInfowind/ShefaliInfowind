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
import EncryptProfileUrl from './encryptProfileUrl';

function ShareMediaMusic(props, { history }) {
  const [copy, setCopy] = useState();
  const [shareUrl, setShareUrl] = useState();
console.log('shrare all propsss',props);
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
console.log('shareUrl',shareUrl);

//   history: undefined
// mediaSharedata: undefined
// media_id: "z7FEfXpCBP3agfZMxLlF"
// show: true
// url_id: "YasAIscrS8O1OcwfZZ7Tlcxdajo2"
// user_media_id: "dFqxcx9AdAP9P5gmka4Hrf4DH202"
// userid: "dFqxcx9AdAP9P5gmka4Hrf4DH202"


  const handleShare = async (type,event) => {

    console.log('share event', event);
        console.log('share type', type);
        console.log('share function', props);
        var flag = false;
        var data ='';
        var result = {};

        if(props.mediaSharedata !== undefined)
        {
          let uid = props.userid;
            
              data = {
                  id: props.media_id,
                  user_share: {
                      [uid] : 1
                  } ,
                  storetype: 'add',
                  by_id :uid,
                  postedUserId :props.url_id,
              };
         
        }else{

          for(var i in props.mediaSharedata)
          {
              if(i === props.userid){   
                 console.log('share already',props.mediaSharedata);
                // flag = true;
              }
              else{
                console.log('not share',props.mediaSharedata[i]);
                  result[i] = props.mediaSharedata[i];
              }
          }
        }
        // var flag = false;
        // var data ='';
        // var result = {};

        // for(var i in props.mediaSharedata)
        // {
        //     if(i === props.userid){   
        //         flag = true;
        //     }
        //     else{

        //         result[i] = props.mediaLikedata[i];
        //     }
        // }

        // if(flag){
        //     let uid = props.userid;
        //     data = {
        //         id: event,
        //         user_likes: result,
        //         type: 'unlike',
        //         by_id :uid,
        //         postedUserId :postedById,
        //     };
           
        // }else{
        //     let uid = props.userid;
            
        //     data = {
        //         id: event,
        //         user_likes: {
        //             [uid] : true
        //         } ,
        //         type: 'like',
        //         by_id :uid,
        //         postedUserId :postedById,
        //     };
        // }
    
         //await props.MediaMusicShare(data);
    
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

export default ShareMediaMusic;


