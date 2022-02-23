import {
  POST_CONVERSATION_REQUEST, GET_CONVERSATION_SUCCESS, GET_CONVERSATION_FAILURE,
  POST_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE,
  POST_ADD_CONVERSATION_REQUEST, GET_ADD_CONVERSATION_SUCCESS, GET_ADD_CONVERSATION_FAILURE,
  SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE,
  POST_GROUP_MESSAGES_REQUEST, GET_GROUP_MESSAGES_SUCCESS, GET_GROUP_MESSAGES_FAILURE,
  SEND_GROUP_MESSAGE_REQUEST, SEND_GROUP_MESSAGE_SUCCESS, SEND_GROUP_MESSAGE_FAILURE,
  UNREAD_MESSAGE_COUNT_REQUEST, UNREAD_MESSAGE_COUNT_SUCCESS, UNREAD_MESSAGE_COUNT_FAILURE,
  MESSAGE_NOTIFICATION
} from './type';
import * as moment from 'moment';
import firebaseConfig from "../../firebase";
import { auth } from "../auth-service";
import { ERROR, Success } from '../../utils/errors';
import {
  USER_NOTIFICATION
  
} from './api_url';
import axios from 'axios';

export const getConversation = (data) => async dispatch => {
  try {

    dispatch({ type: POST_CONVERSATION_REQUEST, payload: true });

    await firebaseConfig.database().ref('conversations/').on('value', resp => {
      var returnArr = [];

      resp.forEach((childSnapshot) => {
        var unreadCount = 0;
        var chatarr = childSnapshot.val();
        var lastChat = '';

        if (chatarr.reciever_id === data.uid || chatarr.sender_id === data.uid) {
          var other_uid = '';
          if (chatarr.reciever_id === data.uid) {
            other_uid = chatarr.sender_id;
          }
          else {
            other_uid = chatarr.reciever_id
          }
        
          firebaseConfig.database().ref('chats/').child(childSnapshot.key).limitToLast(1).on('value', resp => {
           
            resp.forEach((chatSnapshot) => {
              lastChat = chatSnapshot.val();
            })
          })


          firebaseConfig.database().ref('chats/').child(childSnapshot.key)
            .orderByChild('reciever_id').equalTo(data.uid)
            .on("value", function (snapshot) {

              var i = 0;
              snapshot.forEach(function (data) {
                if (data.val().status === 'unread') {
                  i = i + 1;
                  unreadCount = i;
                }
              });
            });

          const res = firebaseConfig.firestore().collection("users").doc(other_uid);
          res.get().then((doc) => {
            if (doc.exists) {
              if (doc.data().user_active === true) {
                const item = chatarr;
                item.receiverDetails = doc.data();
                item.lastConversation = lastChat;
                item.unread_msg = unreadCount;
                item.key = childSnapshot.key;
                returnArr.push(item);
                dispatch({ type: GET_CONVERSATION_SUCCESS, payload: returnArr });
              }
            }
          })
        }
      })

    }).catch(function (error) {
      dispatch({ type: GET_CONVERSATION_FAILURE, payload: false });
    })
  } catch (error) {
    dispatch({ type: GET_CONVERSATION_FAILURE, payload: error });
  }
};

export const getMessages = (data) => async dispatch => {
  try {

    dispatch({ type: POST_MESSAGES_REQUEST, payload: true });

    if (data !== "") {

      var reciever_uid = '';
       await firebaseConfig.database().ref('chats/').child(data.chat_id).on('value', resp => {
        var returnArr = [];
        var unreadcount = 0;
        resp.forEach((msgSnapshot) => {
          var msgarr = '';
          msgarr = msgSnapshot.val();

          const item = msgarr;
          console.log('itemis', item);
          item.key = msgSnapshot.key;

          returnArr.push(item);
          
          if (item.status === 'unread') {
            unreadcount = unreadcount + 1;
          }

        })

        console.log('checkreturn------', returnArr);
        if (data.recv_id !== "") {
          reciever_uid = data.recv_id;
          const recv = firebaseConfig.firestore().collection("users").doc(reciever_uid);
          recv.get().then(async (doc) => {
            if (doc.exists) {
              if (doc.data().user_active === true) {
                returnArr['receiverData'] = doc.data();
                console.log('check-chat-id',data.chat_id);

              
                await updateUnreadStatus(data.chat_id, data.uid, unreadcount)
                  .then(async function () {

                    await firebaseConfig.database().ref('UserUnreadCount/').child(data.uid).on("child_added", resp => {
                      if (resp.exists()) {
                        const usrUnreadCount = resp.val();
                        if (usrUnreadCount !== undefined) {
                          console.log('-----check unread message----',usrUnreadCount);
                          dispatch({ type: UNREAD_MESSAGE_COUNT_SUCCESS, payload: usrUnreadCount });
                        }
                      }
                    })
                    dispatch({ type: GET_MESSAGES_SUCCESS, payload: returnArr });

                  }).catch(function (error) {
                    ERROR(error.message);
                    dispatch({ type: GET_MESSAGES_FAILURE, payload: false });
                  })
              }
            }
          })
        } else {
          dispatch({ type: GET_MESSAGES_FAILURE, payload: false });
        }

      }).catch(function (error) {
        dispatch({ type: GET_MESSAGES_FAILURE, payload: false });
      })
     
    
     
    } else {
      dispatch({ type: GET_MESSAGES_FAILURE, payload: false });
    }
  } catch (error) {
    dispatch({ type: GET_MESSAGES_FAILURE, payload: error });
  }
};

async function updateUnreadStatus(chatid, uid, unreadcount) {
  try {

    var list = 0;
    await firebaseConfig.database().ref('chats/' + chatid)
      .orderByChild('reciever_id').equalTo(uid).once('value', async function (snapshot) {
        snapshot.forEach(function (child) {

          if (child.val().status === 'unread'){
          
              //unreadCount = unreadCount +1;
              child.ref.update({ status: 'read' });

            list = list + 1;
          }
        });
      
        await DecreementUnreadCountByUser(uid, unreadcount)
        console.log('decreement', unreadcount);

      });

  } catch (e) {
    console.log(e)
    return false;
  }
}

export const addConversation = (data) => async dispatch => {
  try {
   
    dispatch({ type: POST_ADD_CONVERSATION_REQUEST, payload: true });
    var room_id = data.recvid + '_' + data.uid;
    var room_id2 = data.uid + '_' + data.recvid;

    await firebaseConfig.database().ref('conversations/').child(room_id).once('value', snapshot => {
      if (snapshot.exists()) {
       
        dispatch({ type: GET_ADD_CONVERSATION_SUCCESS, payload: room_id });
      } else {
        firebaseConfig.database().ref('conversations/').child(room_id2).once('value', snapshot => {
          if (snapshot.exists()) {
            
            dispatch({ type: GET_ADD_CONVERSATION_SUCCESS, payload: room_id2 });
          } else {
            firebaseConfig.database().ref('conversations/').child(room_id).set({
              reciever_id: data.recvid,
              sender_id: data.uid,
              time: firebaseConfig.firestore.FieldValue.serverTimestamp(),

            }).then(() => {
             
              }).catch(function (error) {
                ERROR(error.message);
              
              })
            dispatch({ type: GET_ADD_CONVERSATION_SUCCESS, payload: room_id });
          }
        }, (errorObject) => {

          dispatch({ type: GET_ADD_CONVERSATION_FAILURE, payload: false });
          console.log('errorObject',errorObject);
        });
      }
    }, (errorObject) => {
     
      dispatch({ type: GET_ADD_CONVERSATION_FAILURE, payload: false });

    });
  } catch (error) {
  
    dispatch({ type: GET_ADD_CONVERSATION_FAILURE, payload: error });
  }
};

export const sendMessage = (data) => async dispatch => {
  try {
    if (data) {
      dispatch({ type: SEND_MESSAGE_REQUEST, payload: true });

      const msgData = {
        reciever_id: data.reciever_id,
        sender_id: data.sender_id,
        date: data.date,
        time: firebaseConfig.firestore.FieldValue.serverTimestamp(),
        message: data.message,
        type: data.type,
        status: 'unread',
      }

      await firebaseConfig.database().ref('chats/' + data.chat_id).push(msgData).then(async () => {
        await IncreementUnreadCountByUser(data.reciever_id).then(async function () {
          await sendMessageNotification(data.reciever_id);
          dispatch({ type: SEND_MESSAGE_SUCCESS, payload: true });
        }).catch(function (error) {
          ERROR(error.message);
          dispatch({ type: SEND_MESSAGE_FAILURE, payload: error });
        })

      }).catch(function (error) {
        dispatch({ type: SEND_MESSAGE_FAILURE, payload: error });
        ERROR(error.message);
      })
    }
  } catch (error) {
    dispatch({ type: SEND_MESSAGE_FAILURE, payload: error });
  }
};

async function IncreementUnreadCountByUser(recv_id) {
  try {
    var unreadCountVal = 0;

    await firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).once('value', resp => {
      if (resp.exists()) {
        const usrUnreadCount = resp.val();

        if (usrUnreadCount !== undefined) {
          unreadCountVal = usrUnreadCount.unreadCount + 1;
          firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).set({
            unreadCount: unreadCountVal,

          })
        }
        else {
          unreadCountVal = 1;
          firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).set({
            unreadCount: unreadCountVal,

          })
        }
      } else {
        unreadCountVal = 1;
        firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).set({
          unreadCount: unreadCountVal,

        })
      }
    })

    // await firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).on('value', resp => {

    //   resp.forEach((msgSnapshot) => {
    //     var msgarr ='';
    //     msgarr = msgSnapshot.val();

    //     console.log('msgarr',msgarr);
    //   })

    // })


    // const res = await firebaseConfig.firestore().collection("users").doc(recv_id);
    // res.get().then((doc) => {

    //   if (doc.exists) {
    //     var unreadMsg = 0;
    //     var usrData = doc.data()
    //     if(usrData?.unreadMsgCount){
    //       unreadMsg = usrData?.unreadMsgCount +1;
    //     }
    //     else{
    //       unreadMsg =1;
    //     }

    //     const updatedata = {
    //       unreadMsgCount: unreadMsg,
    //     };
    //     firebaseConfig.firestore().collection('users').doc(recv_id).update(updatedata)
    //     .then(function (docres) {
    //     return true;
    //     })
    //   }
    // })

  } catch (e) {
    console.log(e)
    return false;
  }
}


async function DecreementUnreadCountByUser(recv_id, count) {
  try {
    console.log('checkcount', count);
    await firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).once('value', resp => {
      if (resp.exists()) {
       
        const usrUnreadCount = resp.val();
        if (usrUnreadCount !== undefined) {
         
          if (usrUnreadCount.unreadCount >= count) {
            var unreadCountVal = usrUnreadCount.unreadCount - count;
            firebaseConfig.database().ref('UserUnreadCount/').child(recv_id).set({
              unreadCount: unreadCountVal,

            })
          }
        }
      }
    })

    // const res = await firebaseConfig.firestore().collection("users").doc(recv_id);
    // res.get().then((doc) => {

    //   if (doc.exists) {
    //     console.log('dfdfgdfgdf',count);
    //     if(count !== 0){
    //       var unreadMsg = 0;
    //       var usrData = doc.data()
    //       if(usrData?.unreadMsgCount){
    //         if(usrData?.unreadMsgCount >= count){
    //           unreadMsg = usrData?.unreadMsgCount - count;
    //           const updatedata = {
    //             unreadMsgCount: unreadMsg,
    //           };

    //           firebaseConfig.firestore().collection('users').doc(recv_id).update(updatedata)
    //           .then(function (docres) {
    //           return true;
    //           })
    //         }
    //       }
    //     }else{
    //       return true;
    //     }
    //   }
    // })

  } catch (e) {
    console.log(e)
    return false;
  }
}

export const getGroupMessages = (data) => async dispatch => {
  try {

    dispatch({ type: POST_GROUP_MESSAGES_REQUEST, payload: true });

    if (data !== "") {

      await firebaseConfig.database().ref('GroupChats/').child(data.chat_id).on('value', resp => {
        var returnArr = [];
        resp.forEach((msgSnapshot) => {
          var msgarr = '';
          msgarr = msgSnapshot.val();

          const item = msgarr;
          item.key = msgSnapshot.key;
          returnArr.push(item);
          dispatch({ type: GET_GROUP_MESSAGES_SUCCESS, payload: returnArr });
        })

      }).catch(function (error) {
        dispatch({ type: GET_GROUP_MESSAGES_FAILURE, payload: false });
      })
    } else {
      dispatch({ type: GET_GROUP_MESSAGES_FAILURE, payload: false });
    }
  } catch (error) {
    dispatch({ type: GET_GROUP_MESSAGES_FAILURE, payload: error });
  }
};

export const sendGroupMessage = (data) => async dispatch => {
  try {
    if (data) {
      dispatch({ type: SEND_GROUP_MESSAGE_REQUEST, payload: true });
      console.log('groupmsg-----', data);
      var subs_id = [];
      if (data.allSubscriber.length > 0) {

        data.allSubscriber.forEach((user, indx) => {

          subs_id.push(user.aud_id);
          var room_id = user.aud_id + '_' + data.sender_id;
          var room_id2 = data.sender_id + '_' + user.aud_id;


          firebaseConfig.database().ref('conversations/').child(room_id).once('value', snapshot => {
            if (snapshot.exists()) {

              const msgData = {
                reciever_id: user.aud_id,
                sender_id: data.sender_id,
                date: data.date,
                time: firebaseConfig.firestore.FieldValue.serverTimestamp(),
                message: data.message,
                type: data.type,
                status: 'unread',
              }
              firebaseConfig.database().ref('chats/' + room_id).push(msgData)
              IncreementUnreadCountByUser(user.aud_id).then(function () {
                return true;
              })

            } else {
              firebaseConfig.database().ref('conversations/').child(room_id2).once('value', snapshot2 => {
                if (snapshot2.exists()) {
                  const msgData = {
                    reciever_id: user.aud_id,
                    sender_id: data.sender_id,
                    date: data.date,
                    time: firebaseConfig.firestore.FieldValue.serverTimestamp(),
                    message: data.message,
                    type: data.type,
                    status: 'unread',
                  }
                  firebaseConfig.database().ref('chats/' + room_id2).push(msgData)
                  IncreementUnreadCountByUser(user.aud_id).then(function () {
                    return true;
                  })
                } else {

                  firebaseConfig.database().ref('conversations/').child(room_id).set({
                    reciever_id: user.aud_id,
                    sender_id: data.sender_id,
                    time: firebaseConfig.firestore.FieldValue.serverTimestamp(),

                  }).then(() => {
                    const msgData = {
                      reciever_id: user.aud_id,
                      sender_id: data.sender_id,
                      date: data.date,
                      time: firebaseConfig.firestore.FieldValue.serverTimestamp(),
                      message: data.message,
                      type: data.type,
                      status: 'unread',
                    }
                    firebaseConfig.database().ref('chats/' + room_id).push(msgData)
                    IncreementUnreadCountByUser(user.aud_id).then(function () {
                      return true;
                    })

                  }).catch(function (error) {
                    dispatch({ type: SEND_GROUP_MESSAGE_FAILURE, payload: error });
                    ERROR(error.message);
                  })
                }

              }, (errorObject) => {

                dispatch({ type: SEND_GROUP_MESSAGE_FAILURE, payload: false });

              });
            }
          }, (errorObject) => {

            dispatch({ type: SEND_GROUP_MESSAGE_FAILURE, payload: false });

          });

        })

        if (subs_id.length > 0) {
          const msggroupData = {

            sender_id: data.sender_id,
            date: data.date,
            time: firebaseConfig.firestore.FieldValue.serverTimestamp(),
            message: data.message,
            type: data.type,
            subscriberId: subs_id,

          }
          await firebaseConfig.database().ref('GroupChats/' + data.sender_id).push(msggroupData).then(async() => {
            await sendMessageNotificationAllSubscriber(data.sender_id);
            dispatch({ type: SEND_GROUP_MESSAGE_SUCCESS, payload: true });
          }).catch(function (error) {
            dispatch({ type: SEND_GROUP_MESSAGE_FAILURE, payload: error });
            ERROR(error.message);
          })
        }
      }
    }
  } catch (error) {
    dispatch({ type: SEND_GROUP_MESSAGE_FAILURE, payload: error });
  }
};


export const getUnreadMessageCount = (data) => async dispatch => {
  try {
    if (data) {
      dispatch({ type: UNREAD_MESSAGE_COUNT_REQUEST, payload: true });

      await firebaseConfig.database().ref('UserUnreadCount/').child(data.uid).on("child_added", resp => {
        if (resp.exists()) {
          const usrUnreadCount = resp.val();
          if (usrUnreadCount !== undefined) {
            console.log('-----check unread message----',usrUnreadCount);
            dispatch({ type: UNREAD_MESSAGE_COUNT_SUCCESS, payload: usrUnreadCount });
          }
        } else {

          dispatch({ type: UNREAD_MESSAGE_COUNT_FAILURE, payload: false });

        }
      })

    }
  } catch (error) {
    dispatch({ type: UNREAD_MESSAGE_COUNT_FAILURE, payload: error });
  }
};


async function sendMessageNotification(id) {
  try {
    const res = await firebaseConfig.firestore().collection("users").doc(id);
    res.get().then(async (doc) => {
      
      if (!doc.exists) {
        
        //dispatch({ type: GET_OTHER_USER_PROFILE_BY_ID_FAILURE, payload: false });
      }
      else {
       
        if(doc.data()?.Notification_tokens){
          if(doc.data().Notification_tokens.length > 0){

                const notification_data ={
            
                  "title": "Message",
                  "body": MESSAGE_NOTIFICATION,
                  "to": doc.data().Notification_tokens,
                }
                const notification_response = await axios.post(USER_NOTIFICATION,notification_data);
                console.log('notification_response',notification_response);
                if (notification_response.status === 200) {
                }
            }
          
          }
        }
    })
  } catch (e) {
    console.log(e)
    return false;
  }
}

async function sendMessageNotificationAllSubscriber(uid) {
  try {
    var subscribeobj = [];
    const res = await firebaseConfig.firestore().collection("users").doc(uid);
    res.get().then(async (doc) => {
      
      if (!doc.exists) {
      
      }
      else {
       
        var UserData = doc.data();
        subscribeobj = UserData.subscribed_list;
        if (subscribeobj !== '') {
         
          let i = 0;
          Object.keys(subscribeobj).map(async function(subkeyid){ 

            var sub_id = '';
            var Recsubiddata = '';
            if(subkeyid.includes('_RECIEVER')){
              sub_id = subkeyid.replace('_RECIEVER', '');
              Recsubiddata = subscribeobj[sub_id+'_RECIEVER'];
            }
            if(subkeyid.includes('_SUBSCRIBER')){
              sub_id = subkeyid.replace('_SUBSCRIBER', '');
              Recsubiddata = subscribeobj[sub_id+'_SUBSCRIBER'];
            }
                      
            if (sub_id !== '') {

              const subres = await firebaseConfig.firestore().collection("users").doc(sub_id);
              subres.get().then(async (subdoc) => {
                
                if (!subdoc.exists) {
                
                }
                else {
                  if(Recsubiddata.subscribe_type === "one_time_support"){
                    if(subdoc.data()?.Notification_tokens){
                      if(subdoc.data().Notification_tokens.length > 0){
              
                        console.log(subdoc.data().Notification_tokens);
                        const notification_data ={
                    
                          "title": "Message",
                          "body": MESSAGE_NOTIFICATION,
                          "to": subdoc.data().Notification_tokens,
                        }
                      
                        
                        const notification_response = await axios.post(USER_NOTIFICATION,notification_data);
                        console.log('notification_response',notification_response);
                        if (notification_response.status === 200) {
                        }
                      }
                    }
                  }else{
                    if(Recsubiddata.date !== ''){
                        var Rec_subs_date = Recsubiddata.date;
                        var rec_checkDate = new Date();
                      
                        const milliseconds = Rec_subs_date.seconds * 1000 // 1575909015000
                        var rec_cloneDate  = new Date(milliseconds)
                      
                        //for monthly subscription
                      
                        rec_cloneDate.setDate(rec_cloneDate.getDate() + 30);
                        if(rec_cloneDate.getTime() > rec_checkDate.getTime()){
                
                        
                          if(subdoc.data()?.Notification_tokens){
                            if(subdoc.data().Notification_tokens.length > 0){
                    
                              console.log(subdoc.data().Notification_tokens);
                              const notification_data ={
                          
                                "title": "Message",
                                "body": MESSAGE_NOTIFICATION,
                                "to": subdoc.data().Notification_tokens,
                              }
                            
                              
                              const notification_response = await axios.post(USER_NOTIFICATION,notification_data);
                              console.log('notification_response',notification_response);
                              if (notification_response.status === 200) {
                              }
                            }
                          }
                        }
                    }
                  }
                }
              })
            }
             
            i = i+1;
            return true;
          });
        }
      }
    })
  } catch (e) {
    console.log(e)
    return false;
  }
}