import React,{useState,useEffect} from 'react'
import { Link } from "react-router-dom";
import facebook_icon from '../../../assets/images/Group03.svg';
import youtube_icon from '../../../assets/images/Group04.svg';
import instagram_icon from '../../../assets/images/Group05.svg';
import twitter_icon from '../../../assets/images/Group06.svg';
import tiktok_icon from '../../../assets/images/Group07.svg';
import user_cover_img from '../../../assets/images/user-cover-image.png';
import user_img from '../../../assets/images/dummy_user.png';
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import add_content from '../../../assets/images/plus-mobile.svg';
import { Button } from '@material-ui/core'
//Redux
import { useSelector, connect } from "react-redux";
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import ShareMediaContent from './shareMediaContent';
//import { SEND_MESSAGE_FAILURE } from '../../../Redux/actions/type';
import {getUserSubscribeStatus } from "../../../Redux/actions/subscriber-actions";
import Tooltip from '@material-ui/core/Tooltip';
import {addConversation} from "../../../Redux/actions/chat-actions";
import { getUserSubscriptionExpired } from "../../../Redux/actions/subscriber-actions";
import ExpiryDate from "../../components/subscriptionExpiryDate";

function HomeProfile(props, { history }) {
    const { userDetailsById,authuser } = useSelector((state) => state.authReducer);
    const [showShareMediaContent, setShowShareMediaContent] = useState(false);
    const {ChatId} = useSelector((state) => state.chatReducer);
    const { SubscribedUserStatus,loading } = useSelector((state) => state.subscriberReducer);
    const [ OtherUser,SetOtherUser ] = useState('');
    const { subscribeExpired } = useSelector((state) => state.subscriberReducer);
    const [expiredDate, setExpiredDate] = useState('');
    const [viewPermission, setViewPermission] = useState('');
    console.log('othruser',props.userProfileId);
    useEffect(() => {
        async function fetchdata(){
            if(props.userProfileId)
            {
                const profileid  = Buffer.from(props.userProfileId, 'base64').toString('ascii')
                SetOtherUser(profileid);
                await props.getUserProfileById(profileid);
                
                const data ={
                    subscribe_id : profileid,
                    user_id : authuser.uid,
                }
                props.getUserSubscribeStatus(data);
                const subsdata ={
                    user_id:authuser.uid,
                    subscriberId:profileid,
                }
                await props.getUserSubscriptionExpired(subsdata);
            }
            else{
                await props.getUserProfileById(authuser.uid);
            }
        }
        fetchdata();
    },[authuser.uid,props.userProfileId]);

    useEffect(() => {

        if(subscribeExpired.subscribe_type === "one_time_support"){
           
            setViewPermission(true);
           
        }else{
            if(subscribeExpired.date){
                var exp_date = ExpiryDate(subscribeExpired.date);
                if(exp_date !== ''){
                    
                    setExpiredDate(exp_date);
                    setViewPermission(true);
                    
                }else{
                    setViewPermission(false);
                }
                console.log('exp_date',exp_date);
            }else{
                setViewPermission(false);
            }
        }

    },[subscribeExpired]);

    console.log('SubscribedUserStatus=========',SubscribedUserStatus);
     console.log('userDetailsById',userDetailsById);
    const handleLinks = (event) => {
        if(event){
           
            if (event.indexOf("http://") === 0 || event.indexOf("https://") === 0) {
                
                window.open(event);
            }
            else{
                window.open('//'+event);
            }
        }
    };

    const handleSubscribeLink = (event) => {
        if(event){
            props.props.history.push('/subscription/'+event);  
        }
    };

    const handelChatWithUser = async (id) => {
        if(id){
          
            console.log('workinggggg'); 
            const data ={
                recvid :OtherUser,
                uid:authuser.uid,
            }
     
        await props.addConversation(data);
        }
    };
    
    useEffect(() => {

        if(ChatId !== '' && OtherUser !== ''){
            props?.props.history.push('/inbox');
        }
       
    },[ChatId,OtherUser]);

    console.log('OtherUser',OtherUser);
    console.log('SubscribedUserStatus',SubscribedUserStatus);
    return (
        <div className='top-profile-section'>
           <div className="mob-secion">
                <div className="mobile-top-logo">
                    <div className="left-square"><img src={square_img} alt='' /></div>
                    <div className="mobile-center-logo"><img src={mobile_logo} alt='' /></div>
                    <div className="mobile-add-content"><Link to="/addContent"><img src={add_content} alt='' /></Link></div>
                </div>
           </div>

            <div className='profile-cover-photo'><img src={userDetailsById?.coverURL ? userDetailsById?.coverURL : user_cover_img} alt='' /></div>
            <div className='profile-top-sec'>
                <div className='profile-left-sec'>{userDetailsById.username}</div>
                <div className='profile-photo'>
                    <span><img src={userDetailsById?.avatarURL !== '' ? userDetailsById?.avatarURL: user_img} alt='' /></span>
                </div>
                <div className='profile-right-sec'>
                    <div className='profile-right-txt'>@{userDetailsById.username}</div> 
                    <div className='profile-right-btns'>
                        <ShareMediaContent history={props.history} url_id={userDetailsById.uid} show={showShareMediaContent} close={() => setShowShareMediaContent(false)} />
                        <ul>
                            {OtherUser !== '' ?
                                SubscribedUserStatus === false || SubscribedUserStatus === 'expired' ? 
                                SubscribedUserStatus === 'expired' ? (
                                <Tooltip title={<h5>Your plan is expired,Please subscribe to chat with user</h5>}>
                                    <li><Button onClick={ (event) => event.preventDefault() } className='btn'><img src={require('../../../assets/images/Group08.svg').default} alt='' /></Button></li>
                                </Tooltip>)
                                    :
                                ( <Tooltip title={<h5>Please subscribe to chat with user</h5>}>
                                    <li><Button onClick={ (event) => event.preventDefault() } className='btn'><img src={require('../../../assets/images/Group08.svg').default} alt='' /></Button></li>
                                </Tooltip>)
                                     :
                                <li><Button  onClick={() => handelChatWithUser(OtherUser)} className='btn'><img src={require('../../../assets/images/Group08.svg').default} alt='' /></Button></li>
                                : <li><Button disabled className='btn'><img src={require('../../../assets/images/Group08.svg').default} alt='' /></Button></li>
                            }
                            <li><Button onClick={() => setShowShareMediaContent(true)} className='btn'><img src={require('../../../assets/images/Group09.svg').default} alt='' /></Button></li> 
                        </ul>
                    </div> 
                </div>
            </div>
            <div className='top-profile-social'> 
                <ul>
                    {/* <li><Link><img src={require('../../../assets/images/Group01.svg').default} alt='' /></Link></li>
                    <li><Link><img src={require('../../../assets/images/Group02.svg').default} alt='' /></Link></li> */}
                    <li onClick={() => handleLinks(userDetailsById?.social_links?.facebook)}><img src={facebook_icon} alt=''/></li>
                    <li onClick={() => handleLinks(userDetailsById?.social_links?.youtube)}><img src={youtube_icon} alt=''/></li>
                    <li onClick={() => handleLinks(userDetailsById?.social_links?.instagram)}><img src={instagram_icon} alt=''/></li>
                    <li onClick={() => handleLinks(userDetailsById?.social_links?.twitter)}><img src={twitter_icon} alt=''/></li>
                    <li onClick={() => handleLinks(userDetailsById?.social_links?.tiktok)}><img src={tiktok_icon} alt=''/></li>
                </ul>
            </div>
            <div className='social-btns'>
                <Button onClick={() => handleLinks(userDetailsById?.listen_now_link)} className="btn btn-danger">Listen now <img src={require('../../../assets/images/Vector.svg').default} alt='' /></Button>
                <Button disabled={OtherUser !== ''  ? '': 'true'} onClick={() => handleSubscribeLink(props?.userProfileId)} className="btn btn-primary">{viewPermission === true ? 'Subscribed' : 'Subscribe'}</Button>
                {/* <Button class="btn btn-primary">Subscribe</Button> */}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        SubscribedUserStatus: state.subscriberReducer.SubscribedUserStatus,
        ChatId: state.chatReducer.ChatId,
        subscribeExpired: state.subscriberReducer.subscribeExpired,
    }
  }
  const actionCreators = {
    getUserProfileById: getUserProfileById,
    fetchUser:fetchUser,
    getUserSubscribeStatus:getUserSubscribeStatus,
    addConversation:addConversation,
    getUserSubscriptionExpired:getUserSubscriptionExpired,
  };
  
export default connect(mapStateToProps, actionCreators)(HomeProfile);

