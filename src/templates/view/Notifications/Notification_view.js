import React,{useEffect,useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import {getUserNotification,RemoveNotification} from "../../../Redux/actions/notification-actions";
import { useSelector, connect } from "react-redux"; 
import { Button } from '@material-ui/core'
import {
    LIKED_NOTIFICATION,SUBSCRIBED_NOTIFICATION,POST_CONTENT
   
} from '../../../Redux/actions/type';
import EncryptProfileUrl from "../../components/encryptProfileUrl";

function NotificationsView(props,{history}) {
    const { notification_data,Total_notification,loading,RemoveNotificationId} = useSelector((state) => state.notificationsReducer);
    const { userDetailsById,authuser} = useSelector((state) => state.authReducer);
    const [initialLimit, setInitialLimit] = useState(2);
    const [dataLimit, setDataLimit] = useState(2);
    const [removeIdStatus, setRemoveIdStatus] = useState('');

    useEffect(() => {
        async function fetchdata(){
            
            const data = {
                user_id : authuser.uid,
                limit:dataLimit,
            }
            await props.getUserNotification(data);
        }
        fetchdata();
        
    },[authuser.uid,dataLimit,removeIdStatus]);

    console.log('authuser.uid',authuser.uid);
    console.log('notification_data---',notification_data);
    console.log('Total_notification',Total_notification);

    const handleNext = () =>  {
        var new_limit = dataLimit + initialLimit;
        setDataLimit(new_limit);
    };

    useEffect(() => {

        if(notification_data.length > 0){
            console.log('uuuu',notification_data.length);
            notification_data.map(val => {
                console.log('uuuu',val);
                return true;
            })
        }
    },[loading]);

    useEffect(() => {

        setRemoveIdStatus(RemoveNotificationId);
      
    },[RemoveNotificationId]);

    console.log('RemoveNotificationStatus',RemoveNotificationId);
    console.log('notification_data',notification_data);
    const handleRemoveNotification = (id) => {
        
        if(id){
            async function fetchdata(){
            const data = {
                user_id : authuser.uid,
                notification_id:id,
            }
            await props.RemoveNotification(data);
        }
        fetchdata();    
            
        }
    }

    const handleClick = (id) => {
       
        if(id){
            var profileUrl =  EncryptProfileUrl(id);
            props.historyprops.history.push(profileUrl);
            //window.location = profileUrl;
        }
    }
    console.log('propspropsprops',props);
    console.log('history',props.historyprops);
    return (
       
                                  
        <div className="notifictions-view">
            {  notification_data.length > 0 ?
                    
                    
                    notification_data.map((val) =>
                    val.id !== removeIdStatus ? (
                    <div className='notifiction-item'>
                        <div className='not-user'>
                            <div className='not-user-img'>
                                <img onClick={() => handleClick(val.user_id)} src={val.userimage} alt='' />
                            </div>
                            <div className='not-user-name'>{val.username}</div>
                        </div>
                        <div className='not-txt'>{val.type === "LIKED_NOTIFICATION" ? LIKED_NOTIFICATION : val.type === "SUBSCRIBED_NOTIFICATION" ? SUBSCRIBED_NOTIFICATION :val.type === "POST_CONTENT" ? POST_CONTENT : '' }</div>
                        <div className='not-drop'>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <img src={require('../../../assets/images/more_btn.svg').default} alt='' />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleRemoveNotification(val.id)} >Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>) :'No Data Found.'
                ):'No Data Found.'
            }

            {   notification_data && (
                notification_data.length  < Total_notification  ?
                <div className='LoadMore-btn'>
                <Button className="btn" type="button" onClick={handleNext} >
                    Load More...
                    {/* <CircularProgress /> */}
                </Button></div> : '' )
            }

{/* 
            // <div className='notifiction-item'>
            //     <div className='not-user'>
            //         <div className='not-user-img'>
            //             <img src={require('../../../assets/images/GIST1.png').default} alt='' />
            //         </div>
            //         <div className='not-user-name'>Jeffery</div>
            //     </div>
            //     <div className='not-txt'><b>Commented on your post</b></div>
            //     <div className='not-drop'>
            //         <Dropdown>
            //             <Dropdown.Toggle variant="success" id="dropdown-basic">
            //                 <img src={require('../../../assets/images/more_btn.svg').default} alt='' />
            //             </Dropdown.Toggle>

            //             <Dropdown.Menu>
            //                 <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            //             </Dropdown.Menu>
            //         </Dropdown>
            //     </div>
            // </div> */}
        </div>
                   
    )
}

const mapStateToProps = (state) => {
    return {
        
        notification_data: state.notificationsReducer.notification_data,
        Total_notification: state.notificationsReducer.Total_notification,
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        loading:state.notificationsReducer.loading,
        RemoveNotificationStatus:state.notificationsReducer.RemoveNotificationStatus,
    }
}

const actionCreators = { getUserNotification,RemoveNotification};
export default connect(mapStateToProps, actionCreators)(NotificationsView);

