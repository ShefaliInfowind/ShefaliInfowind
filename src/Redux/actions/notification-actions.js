import {
  POST_USER_NOTIFICATION_REQUEST,GET_USER_NOTIFICATION_SUCCESS,GET_USER_NOTIFICATION_FAILURE,
  UNREAD_NOTIFICATION_COUNT_REQUEST, UNREAD_NOTIFICATION_COUNT_SUCCESS, UNREAD_NOTIFICATION_COUNT_FAILURE,
  REMOVE_NOTIFICATION_REQUEST,REMOVE_NOTIFICATION_SUCCESS,REMOVE_NOTIFICATION_FAILURE,
} from './type';
import firebaseConfig from "../../firebase";
import { ERROR, Success } from './../../utils/errors';
import 'antd/dist/antd.css'
import * as moment from 'moment';
import dummy_img from '../../assets/images/dummy_user.png';

// For get user media content 

export const getUserNotification = (data) => async dispatch => {
  try {

    dispatch({ type: POST_USER_NOTIFICATION_REQUEST, payload: true });
    if (data.user_id) {

      var notificationPost = [];
      var notificationarr = [];
      let query = '';
      var totalrecord = 0;
      
      await firebaseConfig.firestore().collection('notifications').doc(data.user_id).get()
      .then(async querySnapshot => {
          var notification_obj = querySnapshot.data();

          if(notification_obj)
          {
            Object.keys(notification_obj).map(async function(notifyid){ 
              if(notification_obj[notifyid].flag === true){
                totalrecord =totalrecord +1;
                notification_obj[notifyid].id = notifyid;
                notificationPost.push(notification_obj[notifyid]); 
              }
             
            })
          }
          function sortByDate( a, b ) {
            if ( a.time > b.time ){
              return -1;
            }
            if ( a.time < b.time ){
              return 1;
            }
            return 0;
          }
          notificationPost.sort(sortByDate);


        var notifycount = 0;
        for (let j = 0; j < notificationPost.length && j < data.limit; j++) {
         
          const subres = await firebaseConfig.firestore().collection("users").doc(notificationPost[j].user_id);
            subres.get().then(async (userdoc) => {
              var username= "";
              
              var userimage = dummy_img;
              if (!userdoc.exists) {
              }
              else {
               
                var NotificationReadid=  "";
                var NotificationReadStatus=  "";
                if(userdoc.data().username !== ''){
                  username = userdoc.data().username;
                }
                if(userdoc.data().avatarURL !== ''){
                  userimage = userdoc.data().avatarURL;
                }

                
                notificationPost[j].userimage = userimage;
                notificationPost[j].username = username;
                
                notificationarr.push(notificationPost[j]);
               
                NotificationReadid= notificationPost[j].id;
                NotificationReadStatus= notificationPost[j].status;

                //Read Notification---------
                var updatedata ={};
                
                if(NotificationReadStatus === 'unread'){
                  notifycount = notifycount+1;
                  
                  updatedata[`${NotificationReadid}.status`] = "read";
                  await firebaseConfig.firestore()
                    .collection('notifications')
                    .doc(data.user_id).update(updatedata).then(async (docres) => {    
                    
                  }).catch(function (error) {
                  
                  })
                }
                if(j<= notificationPost.length -1 || j <= data.length){
                  dispatchNotification(notificationarr,data.user_id,notifycount);
                }
              }
            })
          }

          async function dispatchNotification(notificationres,u_id,notifycount){
            const res = await firebaseConfig.firestore().collection("users").doc(u_id);
            res.get().then(async (userdoc) => {
              var notificaton_Count =0;
              if (!userdoc.exists) {
              }
              else {
                  if(userdoc.data()?.Unread_Notification){
                    notificaton_Count = userdoc.data().Unread_Notification -notifycount;
                  }else{
                    notificaton_Count = 0;
                  }
                  await firebaseConfig.firestore().collection('users/').doc(u_id).update({
                    'Unread_Notification': notificaton_Count,
                  }).then(async function (docres) {

                    dispatch({ type: UNREAD_NOTIFICATION_COUNT_SUCCESS, payload: notificaton_Count });
                  
                  }).catch(function (error) {
                    ERROR(error.message);
                    console.log('error recieveeeeeeee',error.message);
          
                  });
                }
            })

            dispatch({ type: GET_USER_NOTIFICATION_SUCCESS, payload: notificationres, notificationTotal: totalrecord });
          }
          
          
      }).catch(function (error) {

        dispatch({ type: GET_USER_NOTIFICATION_FAILURE, payload: false });
      })
        
    } else {
      dispatch({ type: GET_USER_NOTIFICATION_FAILURE, payload: false });
    }
  } catch (error) {
    dispatch({ type: GET_USER_NOTIFICATION_FAILURE, payload: error });
  }
};

export const getUnreadNotificationCount = (data) => async dispatch => {
  try {
    if (data) {
      dispatch({ type: UNREAD_NOTIFICATION_COUNT_REQUEST, payload: true });
      const res = await firebaseConfig.firestore().collection("users").doc(data.uid);
      res.get().then((doc) => {
        
        if (!doc.exists) {
        
          dispatch({ type: UNREAD_NOTIFICATION_COUNT_FAILURE, payload: false });
        }
        else {
          const usrUnreadNotfcn = doc.data();
          if (usrUnreadNotfcn.Unread_Notification !== undefined) {
            console.log('checknotify',usrUnreadNotfcn.Unread_Notification);
            dispatch({ type: UNREAD_NOTIFICATION_COUNT_SUCCESS, payload: usrUnreadNotfcn.Unread_Notification });
          }
         else {

            dispatch({ type: UNREAD_NOTIFICATION_COUNT_FAILURE, payload: false });

          }
        }
      }).catch(function (error) {
        dispatch({ type: UNREAD_NOTIFICATION_COUNT_FAILURE, payload: false });
      })
    } else {
      dispatch({ type: UNREAD_NOTIFICATION_COUNT_FAILURE, payload: false });
    }
  } catch (error) {
    dispatch({ type: UNREAD_NOTIFICATION_COUNT_FAILURE, payload: error });
  }
};

export const RemoveNotification = (data) => async dispatch => {
  try {

    if (data) {
      dispatch({ type: REMOVE_NOTIFICATION_REQUEST, payload: true });
      var updatedata ={};
      var notifyid =data.notification_id;
     
      updatedata[`${notifyid}.flag`] = false;
    
      await firebaseConfig.firestore()
        .collection('notifications')
        .doc(data.user_id).update(updatedata).then(function (docres) {
        Success("Deleted successfully");
        dispatch({ type: REMOVE_NOTIFICATION_SUCCESS, payload: notifyid });
        
      }).catch(function (error) {
       
        dispatch({ type: REMOVE_NOTIFICATION_FAILURE, payload: false });
        ERROR('Something went wrong');
      })
    } else {
      dispatch({ type: REMOVE_NOTIFICATION_FAILURE, payload: false });
    }
  } catch (error) {
    dispatch({ type: REMOVE_NOTIFICATION_FAILURE, payload: error });
  }
};

//not in use-----------------
// async function ReadNotification(notification_id,NotificationReadStatus,user_id,dispatch) {
//   try {
//     var notificaton_Count =0;
//     const res = await firebaseConfig.firestore().collection("users").doc(user_id);
//     res.get().then(async (userdoc) => {
     
//       if (!userdoc.exists) {
//       }
//       else {
//         console.log('usrdetailssss',userdoc.data());
//         console.log('checkcountuserrrr',userdoc.data().Unread_Notification);
//         if(userdoc.data()?.Unread_Notification){
//           notificaton_Count = userdoc.data().Unread_Notification -1;
//         }else{
//           notificaton_Count = 0;
//         }
//         console.log('checkcount',notificaton_Count);
//         var updatedata ={};
//         var notifyid =notification_id;
//         var notifyStatus = NotificationReadStatus;
//         console.log('notification_id=====',notification_id);
//         console.log('Unread_Notification=====',userdoc.data()?.Unread_Notification);
//         console.log('notifyStatus==========',notifyStatus);
//         console.log('notificaton_Count==========',notificaton_Count);
//         if(notifyStatus === 'unread'){

         
//           updatedata[`${notifyid}.status`] = "read";
//           await firebaseConfig.firestore()
//             .collection('notifications')
//             .doc(user_id).update(updatedata).then(async function(docres) {

//               await UpdateNotificationCount(user_id,notificaton_Count);
//               // await firebaseConfig.firestore().collection('users/').doc(user_id).update({
//               //   'Unread_Notification': notificaton_Count,
//               // }).then(function (docres) {
//               //   // const data = {
//               //   //   uid : user_id,
//               //   // }
//               //   //await getUnreadNotificationCount(data);
//               //   console.log('hellooooooooooooooo updateeeeeeeee');
//               //   //dispatch({ type: UNREAD_NOTIFICATION_COUNT_SUCCESS, payload: notificaton_Count });
               
//               // }).catch(function (error) {
//               //   ERROR(error.message);
//               //   console.log('error recieveeeeeeee',error.message);
      
//               // });
//           }).catch(function (error) {
          
//           })
//         }
        
//       }
//     })
    
//   } catch (e) {
//     console.log(e)
//     return false;
//   }
// }


// async function UpdateNotificationCount(user_id,notificaton_Count) {
//   try {
 
//       await firebaseConfig.firestore().collection('users/').doc(user_id).update({
//         'Unread_Notification': notificaton_Count,
//       }).then(function (docres) {
        
//         console.log('hellooooooooooooooo updateeeeeeeee');
      
        
//       }).catch(function (error) {
//         ERROR(error.message);
//         console.log('error recieveeeeeeee',error.message);

//       }); 

//   } catch (e) {
//     console.log(e)
//     return false;
//   }
// }
