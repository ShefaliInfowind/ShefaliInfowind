import React,{useEffect} from 'react'
import Footer from '../footer';
import Navbar from '../Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import UserProfile from '../../components/userProfile';
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import {getUserSubscriberCount} from "../../../Redux/actions/subscriber-actions";
import { useSelector, connect } from "react-redux"; 
import NotificationsView from './Notification_view';

function Notifications(props) {
    const { subscriberCount} = useSelector((state) => state.subscriberReducer);
    const { userDetailsById,authuser} = useSelector((state) => state.authReducer);

    useEffect(() => {
        async function fetchdata(){
            await props.getUserProfileById(authuser.uid); 
            const data = {
                user_id : authuser.uid
            }
            await props.getUserSubscriberCount(data);
        }
        fetchdata();
        
    },[authuser.uid]);

    console.log('subscriberCount',subscriberCount);
    return (
       
        <div className='main-page-wrapper'>
        <Navbar/>

        <div className='middleMainSection'>

            <div className='middleSection-add-notifictions'>
                <div className="addContentSec">
                    <UserProfile/>

                    <div className="notifictions-view-page">
                        <div className="notifictions-head">
                            <h2>{subscriberCount}</h2>
                            <p>SUBSCRIBERS</p>
                        </div>
                        <NotificationsView historyprops={props}/>
                    </div>
                </div>
            </div>

        </div>
    </div>
    )
}

const mapStateToProps = (state) => {
    return {
        subscriberCount: state.subscriberReducer.subscriberCount,
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
    }
}

const actionCreators = {getUserProfileById,fetchUser,getUserSubscriberCount };
export default connect(mapStateToProps, actionCreators)(Notifications);

