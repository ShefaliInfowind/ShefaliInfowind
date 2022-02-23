import React, { useState, useEffect } from 'react';
import {
    useHistory,
    
  } from "react-router-dom";
import {
    Container, 
    Row, 
    Button,
    Form,
    InputGroup
  //  InputGroupAddon
} from 'react-bootstrap';
import Moment from 'moment';
import {useSelector,connect } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../../../assets/css/chat.css';
import { ERROR ,Success } from '../../../utils/errors';
import user_img from '../../../assets/images/dummy_user.png';

function DefaultMessages(props) {

    const [newchat, setNewchat] = useState('');

    const onChange = (e) => {
        e.persist();
        setNewchat(e.target.value);
        ERROR("Please select user first");
    }

   
     return (
            <>
               
                
                <ScrollToBottom className="ChatContent">
                    <div className='ChatContentDiv'>
                      
                    </div>
                </ScrollToBottom>
                <footer className="StickyFooter">
                    <Form className="MessageForm" >
                        
                        <InputGroup>
                        <input type="text" name="message" id="message" placeholder="Enter message here" value={newchat} onChange={onChange} />
                            <div addonType="append">
                           
                                <Button disabled variant="primary" type="submit">
                                     <img src={require('../../../assets/images/send-icon.svg').default} alt='' />
                                </Button>
                            </div>
                        </InputGroup>
                    </Form>
                </footer>
            </>
    );
}


export default DefaultMessages;
