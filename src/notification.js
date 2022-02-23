import React, {useState, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { onMessageListener } from './firebase';
import { useDispatch,useSelector, connect } from "react-redux";
import { getUserProfileById, fetchUser } from "./Redux/actions/auth-actions";
import {
   UNREAD_NOTIFICATION_COUNT_SUCCESS,UNREAD_MESSAGE_COUNT_SUCCESS,
} from './Redux/actions/type';
import firebaseConfig from "../src/firebase";

const Notification = (props) => {

  const dispatch = useDispatch();
  const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [msgNotification, setMsgNotification] = useState({title: '', body: ''});
  const notify = () =>  toast(<ToastDisplay/>); 
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };


  useEffect(() => {
    if (notification?.title !=="" ){
     notify()
     async function fetchdata() {

        if (notification.title !== 'Message'){
          console.log('check4');
        const res = await firebaseConfig.firestore().collection("users").doc(authuser.uid);
        res.get().then((doc) => {
          
          if (!doc.exists) {
          }
          else {
            const usrUnreadNotfcn = doc.data();
            console.log('usrUnreadNotfcnuserrrrrrr',usrUnreadNotfcn);
            if (usrUnreadNotfcn.Unread_Notification !== undefined) {
              dispatch({ type: UNREAD_NOTIFICATION_COUNT_SUCCESS, payload: usrUnreadNotfcn.Unread_Notification+1 });
            }else{
              dispatch({ type: UNREAD_NOTIFICATION_COUNT_SUCCESS, payload: 1 });
            }
          }
        })
      }

      //   if(msgNotification.title === 'Message'){
      //     const res1 = await firebaseConfig.database().ref('UserUnreadCount/').child(authuser.uid).on("child_added", resp => {
      //       if (resp.exists()) {
      //         const usrUnreadCount = resp.val();
      //         if (usrUnreadCount !== undefined) {
      //           dispatch({ type: UNREAD_MESSAGE_COUNT_SUCCESS, payload: usrUnreadCount });
      //         }
      //       }
      //   })
      // }
      
      }
      fetchdata();
     
    }
  }, [notification])

  useEffect(() => {
  
     async function fetchdata() {

        if(msgNotification.title === 'Message'){
          console.log('check3');
          const res1 = await firebaseConfig.database().ref('UserUnreadCount/').child(authuser.uid).on("child_added", resp => {
            if (resp.exists()) {
              const usrUnreadCount = resp.val();
              if (usrUnreadCount !== undefined) {
                dispatch({ type: UNREAD_MESSAGE_COUNT_SUCCESS, payload: usrUnreadCount });
              }
            }
        })
      }
      
      }
      fetchdata();
     
  }, [msgNotification])

  // useEffect(() => {
    
  // }, [userDetailsById])

  onMessageListener()
    .then(async(payload) => {
      console.log('notificationpayload',payload);
      const path = window.location.pathname;
     console.log('path',path);
   
     
    if( path !== '/inbox' && payload?.notification.title !== 'Message')
    {
      console.log('check1');
      setNotification({title: payload?.notification?.title, body: payload?.notification?.body}); 
    }
    else{
      if(path !== '/inbox' && payload?.notification.title === 'Message'){
        console.log('check2');
        setMsgNotification({title: payload?.notification?.title, body: payload?.notification?.body}); 
        setNotification({title: payload?.notification?.title, body: payload?.notification?.body});  
      }
    }

    })
    .catch((err) => console.log('failed: ', err));

  return (
    <Toaster/>
  )
}


const mapStateToProps = (state) => {
  return {
      userDetailsById: state.authReducer.userDetailsById,
      authuser: state.authReducer.authuser,
  }
}

const actionCreators = { getUserProfileById, fetchUser };
export default connect(mapStateToProps, actionCreators)(Notification);



