import React, { useState, useEffect } from 'react';
import {
    useHistory,

} from "react-router-dom";
import {
    Container,
    Row,
    Button,
    Form,
    InputGroup,
    Input,
    //  InputGroupAddon
} from 'reactstrap';
import Moment from 'moment';
import { useSelector, connect } from 'react-redux';
import firebase from '../../../firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../../../assets/css/chat.css';
import { getUserProfileById, fetchUser } from "../../../Redux/actions/auth-actions";
import { getAudience } from "../../../Redux/actions/subscriber-actions";
import { getGroupMessages, sendGroupMessage } from "../../../Redux/actions/chat-actions";
import { ERROR, Success } from '../../../utils/errors';
import user_img from '../../../assets/images/dummy_user.png';

function GroupMessages(props) {

    const { audienceData } = useSelector((state) => state.subscriberReducer);
    const [GroupChats, setGroupChats] = useState([]);
    const [nickname, setNickname] = useState('');
    const [roomname, setRoomname] = useState('');
    const [sender_id, setSender_id] = useState('');
    const [newchat, setNewchat] = useState('');
    const history = useHistory();
    const { groupMessageList, sendGroupMsgStatus } = useSelector((state) => state.chatReducer);
    const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
    console.log('props', props);


    useEffect(() => {
        // const data ={
        //     user_id : authuser.uid,
        //     type : 'all'
        // }
        props.getUserProfileById(authuser.uid);
        // props.getAudience(data);

    }, [authuser.uid]);


    useEffect(() => {
        setNewchat('');

        if (props?.room_id) {
            setRoomname(authuser.uid);
        }
        setSender_id(authuser.uid);
        setNickname(userDetailsById.username);



    }, [authuser.uid, props?.room_id]);

    useEffect(() => {
        if (roomname !== '') {
            setNewchat('');
            const fetchData = async () => {
                setNickname(userDetailsById.username);

                const data = {
                    chat_id: roomname,
                    uid: authuser.uid,
                }
                await props.getGroupMessages(data);

            };

            fetchData();
        }
    }, [roomname, sender_id]);

    const onChange = (e) => {
        e.persist();
        setNewchat(e.target.value);
    }

    useEffect(() => {
        setNickname(userDetailsById.username);
        setGroupChats(groupMessageList);
        setNewchat('');
    }, [groupMessageList, sendGroupMsgStatus]);



    const submitMessage = async (e) => {
        e.preventDefault();
        var checkchat = newchat.trim();
        if(checkchat.length > 0){
            if (roomname !== '') {

                const msgData = {

                    sender_id: authuser.uid,
                    date: Moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                    message: newchat,
                    type: 'message',
                    chat_id: roomname,
                    allSubscriber: audienceData,
                }

                await props.sendGroupMessage(msgData);

            } else {
                ERROR("Please select user first");
            }
        }else{
            ERROR("Please type something");
        }

    };

    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          submitMessage(e);
        }
      }

    return (
        <>
            <div className='right-chat-head'>
                <h6>Conversation With</h6>
                <h5>All Subscribers and Followers</h5>
                <div className='all-chat'>
                    <ul>
                        {
                            audienceData.length > 0 ? (

                                audienceData.map((audienceContent, i) => (
                                    i < 5 && (
                                        <li><span><img src={audienceContent?.aud_profile !== '' ? audienceContent?.aud_profile : user_img} alt='' /></span></li>
                                    )
                                ))
                            ) : ''
                        }
                        {audienceData.length > 5 &&
                            (<li><span><img src={require('../../../assets/images/dummy_user_more.png').default} alt='' /></span></li>)
                        }
                    </ul>
                </div>
            </div>
            <ScrollToBottom className="ChatContent">
                <div className='ChatContentDiv'>
                    {GroupChats.map((item, idx) => (
                        <div key={idx} className={`${item.sender_id === sender_id ? "MessageBox RightMessageBox" : "MessageBox LeftMessageBox"}`}>
                            {item.type === 'join' || item.type === 'exit' ?
                                <div className="ChatStatus">
                                    <span className="ChatDate">{item.date}</span>
                                    <span className="ChatContentCenter"><pre>{item.message}</pre></span>
                                </div> :

                                <div className="ChatMessage">
                                    <div className="RightBubble">
                                        <div className="ChatMessageDateTIme">
                                            {/* {item.sender_id === sender_id ? 
                                                <span className="MsgName">{nickname}</span>:''
                                            } */}
                                            <div className="user-item-img">
                                                <span><img src={item.sender_id === sender_id ? userDetailsById?.avatarURL ? userDetailsById?.avatarURL : user_img : user_img} alt='' /></span>
                                            </div>
                                            {/* <span className="MsgDate"> at {item.date}</span> */}
                                        </div>
                                        <div className="ChatMessageItem"><pre>{item.message}</pre></div>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </ScrollToBottom>
            <footer className="StickyFooter">
                <Form className="MessageForm" onSubmit={submitMessage}>
                    <InputGroup>
                        <textarea onKeyDown={onEnterPress} className="form-control log-inp" name="message" id="message" onChange={onChange} value={newchat} placeholder="Enter message here" />
                        {/* <Input type="text" name="message" id="message" placeholder="Enter message here" value={newchat} onChange={onChange} /> */}
                        <div addonType="append">
                            <Button variant="primary" type="submit">
                                <img src={require('../../../assets/images/send-icon.svg').default} alt='' />
                            </Button>
                        </div>
                    </InputGroup>
                </Form>
            </footer>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        groupMessageList: state.chatReducer.groupMessageList,
        audienceData: state.subscriberReducer.audienceData,
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        sendGroupMsgStatus: state.chatReducer.sendGroupMsgStatus,
    }
};

const actionCreators = { getUserProfileById, fetchUser, getAudience, getGroupMessages, sendGroupMessage };
export default connect(mapStateToProps, actionCreators)(GroupMessages);

