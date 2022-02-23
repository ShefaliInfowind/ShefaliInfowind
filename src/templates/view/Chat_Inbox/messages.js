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
import { getUserProfileById,fetchUser,getOtherUserProfileById } from "../../../Redux/actions/auth-actions";
import {getMessages,sendMessage } from "../../../Redux/actions/chat-actions";
import { ERROR ,Success } from '../../../utils/errors';
import user_img from '../../../assets/images/dummy_user.png';

function Messages(props) {

    const [chats, setChats] = useState([]);
    const [nickname, setNickname] = useState('');
    const [roomname, setRoomname] = useState('');
    const [sender_id, setSender_id] = useState('');
    const [reciever_id, setReciever_id] = useState('');
    const [newchat, setNewchat] = useState('');
    const [otherUser, setOtherUser] = useState('');
    const history = useHistory();
   // const { room_id } = useParams();
    const { messageList } = useSelector((state) => state.chatReducer);
    const { userDetailsById,otherUserDetailsById,authuser} = useSelector((state) => state.authReducer);
    console.log('props---',props);

    useEffect(() => {
        setNewchat('');
        const fetchData = async () => {
            await props.getUserProfileById(authuser.uid);  
            if(props?.room_id){
                setRoomname(props?.room_id);
            }
            setSender_id(authuser.uid);
            setNickname(userDetailsById.username);
        }
        fetchData();
        
    },[authuser.uid,props?.room_id]);

    console.log('checkroom',roomname);
    useEffect(() => {
        setChats('');
        setOtherUser('');
        if(roomname !== ''){
            setNewchat('');

            const fetchData = async () => {
                setNickname(userDetailsById.username);
                var recvdata = (roomname.replace(sender_id, ''));
                var recvid = (recvdata.replace('_', ''));
                props.getOtherUserProfileById(recvid);
                setReciever_id(recvid);
                const data = {
                    chat_id : roomname,
                    uid: authuser.uid,
                    recv_id : recvid,
                }
                await props.getMessages(data);
            
            };
        
            fetchData();
        }
    }, [roomname,sender_id]);

    useEffect(() => {
        if(roomname !== ''){
        setNickname(userDetailsById.username);
        setChats(messageList);
        setNewchat('');
        }else{
            
            setChats('');
            setNewchat('');
        }
        const fetchData = async () => {
            await props.getUserProfileById(authuser.uid); 
        };
            
        fetchData();
    },[messageList,roomname]);

    useEffect(() => {
        if(roomname !== ''){
            setOtherUser(otherUserDetailsById);
        }else{
            setOtherUser('');
        }
    },[otherUserDetailsById,roomname]);

    
    const submitMessage = async (e) => {
        e.preventDefault();
        var checkchat = newchat.trim();
       
       
        if(checkchat.length > 0){
            if(roomname !== ''){
        
                var recvdata = (roomname.replace(authuser.uid, ''));
                var recvid = (recvdata.replace('_', ''));
                const msgData = {
                    reciever_id:recvid,
                    sender_id:authuser.uid,
                    date:Moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                    message: newchat,
                    type:'message',
                    chat_id:roomname,
                }
                
                await props.sendMessage(msgData);
            
            }else{
                ERROR("Please select user first");
            }
        }else{
            ERROR("Please type something");
        }
       
    };

    const onChange = (e) => {
        e.persist();
        console.log('e==============',e);
        setNewchat(e.target.value);
    }

    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          submitMessage(e);
        }
      }
    console.log('chat',chats);
    console.log('newchatnewchat',newchat);
    console.log('nickname',nickname);
     return (
            <>
                {otherUser !== '' ? (
                    <div className='right-chat-head'>
                        <h6>Conversation With</h6>
                        <div className='single-chat'>
                            <span className='usr-name'>{otherUser.username}</span>
                            <span className='usr-img'><img src={otherUser?.avatarURL !== '' ? otherUser?.avatarURL: user_img} alt='' /></span>
                        </div>
                    </div>
                ):''}
                
                <ScrollToBottom className="ChatContent">
                    <div className='ChatContentDiv'>
                        { chats.length > 0 ? (  
                         chats.map((item, idx) => (
                            <div key={idx} className={`${item.sender_id === sender_id? "MessageBox RightMessageBox":"MessageBox LeftMessageBox"}`}>
                                {item.type ==='join'||item.type === 'exit'?
                                    <div className="ChatStatus">
                                        <span className="ChatDate">{item.date}</span>
                                        <span className="ChatContentCenter"><pre>{item.message}</pre></span>
                                    </div>:
                                    <div className="ChatMessage">
                                        <div className={`${item.sender_id === sender_id? "RightBubble":"LeftBubble"}`}>
                                        <div className="ChatMessageDateTIme">
                                            {/* {item.sender_id === sender_id ? 
                                                <span className="MsgName">{nickname}</span>:<span className="MsgName">{chats.receiverData.username}</span>
                                            } */}
                                            <div className="user-item-img">
                                                <span><img src={item.sender_id === sender_id ? userDetailsById?.avatarURL ? userDetailsById?.avatarURL : user_img : chats?.receiverData?.avatarURL ? chats?.receiverData?.avatarURL : user_img} alt='' /></span>
                                            </div>
                                            {/* <span className="MsgDate"> at {item.date}</span> */}
                                        </div>
                                        <div className="ChatMessageItem"><pre>{item.message}</pre></div>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))):''}
                    </div>
                </ScrollToBottom>
                <footer className="StickyFooter">
                    <Form className="MessageForm" onSubmit={submitMessage}>
                        
                        <InputGroup>
                            <textarea onKeyDown={onEnterPress} className="form-control log-inp" name="message" id="message" onChange={onChange} value={newchat} placeholder="Enter message here" />
                            {/* <input type="text" name="message" id="message" placeholder="Enter message here" value={newchat} onChange={onChange} />  */}
                            <div addonType="append">
                           
                                <Button  variant="primary" type="submit">
                                     <img src={require('../../../assets/images/send-icon.svg').default} alt='' />
                                </Button>
   
                                {/* <Button variant="primary" type="submit">
                                     <img src={require('../../../assets/images/send-icon.svg').default} alt='' />
                                </Button> */}
                            </div>
                        </InputGroup>
                    </Form>
                </footer>
            </>
    );
}

const mapStateToProps = (state) => {
    return {
      
        userDetailsById: state.authReducer.userDetailsById,
        OtherUserDetailsById: state.authReducer.OtherUserDetailsById,
        authuser: state.authReducer.authuser,
        messageList: state.chatReducer.messageList,
    
    }
  };

const actionCreators = { getUserProfileById,getOtherUserProfileById,fetchUser, getMessages,sendMessage};
export default connect(mapStateToProps, actionCreators)(Messages);
