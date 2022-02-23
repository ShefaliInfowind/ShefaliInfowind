import {
  POST_NEWSLETTER_REQUEST, GET_NEWSLETTER_SUCCESS, GET_NEWSLETTER_FAILURE,
  POST_SUBSCRIPTION_PAYMENT_REQUEST, GET_SUBSCRIPTION_PAYMENT_SUCCESS, GET_SUBSCRIPTION_PAYMENT_FAILURE,
  POST_SUBSCRIPTION_EXPIRED_REQUEST, GET_SUBSCRIPTION_EXPIRED_SUCCESS, GET_SUBSCRIPTION_EXPIRED_FAILURE,
  POST_AUDIENCE_DATA_REQUEST, GET_AUDIENCE_DATA_SUCCESS, GET_AUDIENCE_DATA_FAILURE,
  POST_SUBSCRIBEUSER_STATUS_REQUEST, GET_SUBSCRIBEUSER_STATUS_SUCCESS, GET_SUBSCRIBEUSER_STATUS_FAILURE,
  SUBSCRIBED_NOTIFICATION, GET_USER_SUBSCRIBEUSER_COUNT_SUCCESS, POST_USER_SUBSCRIBEUSER_COUNT_REQUEST, GET_USER_SUBSCRIBEUSER_COUNT_FAILURE
} from './type';
import firebaseConfig from "../../firebase";
import { ERROR, Success } from './../../utils/errors';
import 'antd/dist/antd.css'
import * as moment from 'moment';
import axios from 'axios';
// For firebase registration 
import {
  PAYMENT_LINK, USER_NOTIFICATION

} from './api_url';


export const addNewsLetter = (data, history) => async (dispatch) => {

  try {

    dispatch({ type: POST_NEWSLETTER_REQUEST, payload: true });

    firebaseConfig.firestore().collection('news_letter/').doc().set({

      postedAt: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
      subscribeTo: data.subscribe_to,
      email: data.email,
      subscribeBy: data.subscribe_by,

    }).then(function () {

      dispatch({ type: GET_NEWSLETTER_SUCCESS, payload: true });
      Success('Added Successfully');

    }).catch(function (error) {
      ERROR(error.message);
      dispatch({ type: GET_NEWSLETTER_FAILURE, payload: error });

    })
  } catch (error) {
    dispatch({ type: GET_NEWSLETTER_FAILURE, payload: error.message });
    ERROR(error.message);
    // throw error;
  }
};

//subscription payment
export const UserSubscriptionPayment = (data, history) => async (dispatch) => {

  try {
    console.log('postdata', data);

    dispatch({ type: POST_SUBSCRIPTION_PAYMENT_REQUEST, payload: true });

    const response = await axios.post(PAYMENT_LINK, data);
    var subid = data.subscribe_user_id;
    var usrid = data.user_id;
    console.log('ressssss', response);
    if (response.status === 200) {
      var post_price = 0;
      var subscribe_type = '';
      if (data.type === 'subscription') {
        post_price = 3.99;
        subscribe_type = "monthly";
      } else {
        post_price = 25;
        subscribe_type = "one_time_support";
      }

      const milliseconds = response.data.charge.created * 1000 // 1575909015000
      var paymentDate = new Date(milliseconds)

      const Transactiondata = {
        subscribed_by: usrid,
        recieved_by: subid,
        charge_id: response.data.charge.id,
        price: post_price,
        date: paymentDate,
        url: response.data.charge.receipt_url,
        subscribe_type: subscribe_type,
      }

      const postData =
      {
        [subid + '_SUBSCRIBER']: {

          chargeId: response.data.charge.id,
          date: paymentDate,
          price: post_price,
          receipt_url: response.data.charge.receipt_url,
          type: 'subscriber',
          subscribe_type: subscribe_type,
        }
      }
      await firebaseConfig.firestore().collection('users').doc(usrid).set({
        subscribed_list: postData
      }, {
        merge: true
      }).then(function (docres) {

        const subscribeUserData =
        {
          [usrid + '_RECIEVER']: {

            date: paymentDate,
            price: post_price,
            type: 'reciever',
            subscribe_type: subscribe_type,
          }
        }

        firebaseConfig.firestore().collection('users').doc(subid).set({
          subscribed_list: subscribeUserData
        }, {
          merge: true
        }).then(function (docres) {
          var sender_user_id = usrid;
          var reciever_user_id = subid;
          var revenue_price = post_price;


          const transData = updateTransactionHistory(Transactiondata)
            .then(function () {

              const responseRevenue = updateRevenue(sender_user_id, reciever_user_id, revenue_price)
                .then(async function () {
                  await sendNotification(data.subscribe_user_id, data.user_id);
                  dispatch({ type: GET_SUBSCRIPTION_PAYMENT_SUCCESS, payload: response });
                  console.log('response', response);
                  Success('Payment Successfully');


                }).catch(function (error) {
                  ERROR(error.message);
                  dispatch({ type: GET_SUBSCRIPTION_PAYMENT_FAILURE, payload: error.message });
                })
            }).catch(function (error) {
              ERROR(error.message);
              console.log('false', error.message);
              dispatch({ type: GET_SUBSCRIPTION_PAYMENT_FAILURE, payload: error });
            });

        }).catch(function (error) {
          ERROR(error.message);
          console.log('false', error.message);
          dispatch({ type: GET_SUBSCRIPTION_PAYMENT_FAILURE, payload: error });
        });
      }).catch(function (error) {
        ERROR(error.message);
        console.log('false', error.message);
        dispatch({ type: GET_SUBSCRIPTION_PAYMENT_FAILURE, payload: error });
      });

    } else {
      dispatch({ type: GET_SUBSCRIPTION_PAYMENT_FAILURE, payload: false });
      console.log('false', response);
      ERROR('Something went wrong');
    }

  } catch (error) {
    dispatch({ type: GET_SUBSCRIPTION_PAYMENT_FAILURE, payload: error.message });
    ERROR(error.message);
    console.log('error.message', error.message);
    // throw error;
  }
};


async function updateRevenue(sender_user_id, reciever_user_id, revenue_price) {
  try {

    if (sender_user_id) {
      const res = await firebaseConfig.firestore().collection("users").doc(sender_user_id);
      res.get().then((doc) => {

        if (doc.exists) {
          var sender_data = doc.data();
          if (sender_data?.subscription) {
            var fetch_price = 0;
            var fetch_total_send = 0;
            var fetch_total_recieve = 0;

            if (sender_data.subscription?.revenue_monthly) {
              fetch_price = revenue_price + sender_data.subscription.revenue_monthly;
            }
            else {
              fetch_price = fetch_price + revenue_price;
            }
            if (sender_data.subscription?.total_send_amount) {
              fetch_total_send = revenue_price + sender_data.subscription.total_send_amount;
            }
            else {
              fetch_total_send = fetch_total_send + revenue_price;
            }
            if (sender_data.subscription?.total_recieve_amount) {
              fetch_total_recieve = sender_data.subscription.total_recieve_amount;
            }
            else {
              fetch_total_recieve = 0;
            }

            const sender_post_data = {
              price: 3.99,
              revenue_monthly: fetch_price,
              total_send_amount: fetch_total_send,
              total_recieve_amount: fetch_total_recieve,

            }
            firebaseConfig.firestore().collection('users').doc(sender_user_id).set({
              subscription: sender_post_data
            }, {
              merge: true
            }).then(function (docres) {
              return true;
            }).catch(function (error) {
              ERROR(error.message);
              console.log('false', error.message);

            });
          }
          else {

            const sender_post_data = {
              price: 3.99,
              revenue_monthly: revenue_price,
              total_send_amount: revenue_price,
              total_recieve_amount: 0,

            }
            firebaseConfig.firestore().collection('users').doc(sender_user_id).set({
              subscription: sender_post_data
            }, {
              merge: true
            }).then(function (docres) {
              return true;
            }).catch(function (error) {
              ERROR(error.message);
              console.log('false', error.message);

            });
          }
        }
      }).catch(function (error) {
        ERROR(error.message);
        console.log('false', error.message);

      });
    }
    if (reciever_user_id) {
      const res = await firebaseConfig.firestore().collection("users").doc(reciever_user_id);
      res.get().then((doc) => {

        if (doc.exists) {
          var reciever_data = doc.data();
          if (reciever_data?.subscription) {
            var fetch_price = 0;
            var fetch_total_send = 0;
            var fetch_total_recieve = 0;

            if (reciever_data.subscription?.revenue_monthly) {
              fetch_price = revenue_price + reciever_data.subscription.revenue_monthly;
            }
            else {
              fetch_price = fetch_price + revenue_price;
            }
            if (reciever_data.subscription?.total_send_amount) {
              fetch_total_send = reciever_data.subscription.total_send_amount;
            }
            else {
              fetch_total_send = 0;
            }
            if (reciever_data.subscription?.total_recieve_amount) {
              fetch_total_recieve = reciever_data.subscription?.total_recieve_amount + revenue_price;
            }
            else {
              fetch_total_recieve = fetch_total_recieve + revenue_price;
            }

            const reciever_post_data = {
              price: 3.99,
              revenue_monthly: fetch_price,
              total_send_amount: fetch_total_send,
              total_recieve_amount: fetch_total_recieve,

            }
            firebaseConfig.firestore().collection('users').doc(reciever_user_id).set({
              subscription: reciever_post_data
            }, {
              merge: true
            }).then(function (docres) {
              return true;
            }).catch(function (error) {
              ERROR(error.message);
              console.log('false', error.message);

            });
          }
          else {
            const reciever_post_data = {
              price: 3.99,
              revenue_monthly: revenue_price,
              total_send_amount: 0,
              total_recieve_amount: revenue_price,
            }
            firebaseConfig.firestore().collection('users').doc(reciever_user_id).set({
              subscription: reciever_post_data
            }, {
              merge: true
            }).then(function (docres) {
              return true;
            }).catch(function (error) {
              ERROR(error.message);
              console.log('false', error.message);

            });
          }
        }
      }).catch(function (error) {
        ERROR(error.message);
        console.log('false', error.message);

      });

    }
  } catch (e) {
    console.log(e)
    return false;
  }
}

async function updateTransactionHistory(transactionData) {
  try {
    firebaseConfig.firestore().collection('subscription_history/').doc().set(transactionData)
      .then(function () {
        return true;
      }).catch(function (error) {
        ERROR(error.message);
        console.log('false', error.message);
      })

  } catch (e) {
    console.log(e)
    return false;
  }
}


// For get user media content 
export const getUserSubscriptionExpired = (data) => async dispatch => {
  try {

    var resData = '';
    dispatch({ type: POST_SUBSCRIPTION_EXPIRED_REQUEST, payload: true });
    if (data.subscriberId) {
      console.log('sub000000', data);
      var subid = data.subscriberId + '_SUBSCRIBER';
      console.log('=============subid==========', subid);
      var query = firebaseConfig.firestore().collection('users').where('uid', "==", data.user_id)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(doc => {
            var subsData = doc.data();
            var subscribeobj = subsData.subscribed_list;
            if (Object.keys(subscribeobj).includes(subid)) {
              resData = subscribeobj[subid];
              dispatch({ type: GET_SUBSCRIPTION_EXPIRED_SUCCESS, payload: resData });
            } else {
              dispatch({ type: GET_SUBSCRIPTION_EXPIRED_SUCCESS, payload: resData });
            }
          })

        }).catch(function (error) {

          console.log('error===============', error);
          dispatch({ type: GET_SUBSCRIPTION_EXPIRED_FAILURE, payload: false });
        })
    } else {
      dispatch({ type: GET_SUBSCRIPTION_EXPIRED_FAILURE, payload: false });
    }
  } catch (error) {
    dispatch({ type: GET_SUBSCRIPTION_EXPIRED_FAILURE, payload: error });
  }
};


// export const getAudienceNew = (data) => async dispatch => {
//   try {

//     dispatch({ type: POST_AUDIENCE_DATA_REQUEST, payload: true });
//     if (data.user_id) {

//       var subscribeobj = [];
//       await firebaseConfig.firestore().collection('users').where('uid', "==", data.user_id)
//        .get().then(function (querySnapshot) {
//         querySnapshot.forEach(doc => {
//           var UserData = doc.data();
//           subscribeobj = UserData.subscribed_list;
//           var audience_res =[];
//           if(subscribeobj !== ''){

//             Object.keys(subscribeobj).forEach(async (val, index) => {
//               if(val.includes('_RECIEVER')){
//                 var  recv_id = val.replace('_RECIEVER', '');
//                 if(recv_id){

//                     var userref = await firebaseConfig.firestore().collection("users").where('uid', "==", recv_id);
//                     userref.get().then(snapshot1 => {

//                       snapshot1.forEach(doc => {

//                         var aud_arr = doc.data();
//                         if(data.type === "search"){

//                           console.log('audname',aud_arr.username);
//                           console.log('searchname',data.search_keyword);

//                           if(aud_arr.username.toLowerCase().includes(data.search_keyword.toLowerCase())){

//                             const audience = {
//                               aud_id : recv_id,
//                               aud_name :aud_arr.username,
//                               aud_profile: aud_arr.avatarURL,
//                             }

//                             audience_res.push(audience);
//                             dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res});
//                           }else{

//                             dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res});
//                           }
//                         }else{
//                           const audience = {
//                             aud_id : recv_id,
//                             aud_name :aud_arr.username,
//                             aud_profile: aud_arr.avatarURL,
//                           } 

//                           audience_res.push(audience);
//                           dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res});
//                         }

//                       })
//                     })
//                   }

//               }else{
//                 dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res});
//               }
//             })
//             console.log('audienceaudience',audience_res);


//           }else{
//             dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res});
//           }
//         })

//       }).catch(function (error) {
//         dispatch({ type: GET_AUDIENCE_DATA_FAILURE, payload: false });
//         ERROR(error.message);
//       })
//     } 

//   } catch (error) {
//     dispatch({ type: GET_AUDIENCE_DATA_FAILURE, payload: error });
//     ERROR(error.message);
//   }
// };


export const getAudience = (data) => async dispatch => {
  try {

    dispatch({ type: POST_AUDIENCE_DATA_REQUEST, payload: true });
    if (data.user_id) {
      var audience_res = [];
      var subscribeobj = [];
      await firebaseConfig.firestore().collection('users').where('uid', "==", data.user_id)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(doc => {
            var UserData = doc.data();
            subscribeobj = UserData.subscribed_list;
            var i = 0;
            if (subscribeobj !== '') {

              if (data.type === "search") {
                var recver_arr = [];
                getAudienceDetails(i);
                function getAudienceDetails(i) {
                  var val = Object.keys(subscribeobj);

                  if (i > Object.keys(subscribeobj).length - 1) {

                    dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res });
                    return;
                  }

                  if (val[i]) {

                    var recv_id = '';
                    var Recsubiddata = '';
                    if (val[i].includes('_RECIEVER')) {
                      recv_id = val[i].replace('_RECIEVER', '');
                      Recsubiddata = subscribeobj[recv_id + '_RECIEVER'];
                    }
                    if (val[i].includes('_SUBSCRIBER')) {
                      recv_id = val[i].replace('_SUBSCRIBER', '');
                      Recsubiddata = subscribeobj[recv_id + '_SUBSCRIBER'];
                    }

                    if (recv_id !== '') {

                      firebaseConfig.firestore().collection("users").where('uid', "==", recv_id)
                        .get().then(snapshot1 => {

                          if (Recsubiddata.subscribe_type === "one_time_support") {
                            snapshot1.forEach(doc => {
                              if (doc.data() !== undefined) {
                                var aud_arr = doc.data();
                                if (aud_arr.username.toLowerCase().includes(data.search_keyword.toLowerCase())) {

                                  const audience = {
                                    aud_id: recv_id,
                                    aud_name: aud_arr.username,
                                    aud_profile: aud_arr.avatarURL,
                                  }


                                  if (!recver_arr.includes(recv_id)) {
                                    recver_arr.push(recv_id);
                                    audience_res.push(audience);
                                  }

                                }
                              }
                            })
                          } else {
                            if (Recsubiddata.date !== '') {
                              var Rec_subs_date = Recsubiddata.date;
                              var rec_checkDate = new Date();

                              const milliseconds = Rec_subs_date.seconds * 1000 // 1575909015000
                              var rec_cloneDate = new Date(milliseconds)

                              //for monthly subscription

                              rec_cloneDate.setDate(rec_cloneDate.getDate() + 30);
                              if (rec_cloneDate.getTime() > rec_checkDate.getTime()) {
                                snapshot1.forEach(doc => {
                                  if (doc.data() !== undefined) {
                                    var aud_arr = doc.data();
                                    if (aud_arr.username.toLowerCase().includes(data.search_keyword.toLowerCase())) {

                                      const audience = {
                                        aud_id: recv_id,
                                        aud_name: aud_arr.username,
                                        aud_profile: aud_arr.avatarURL,
                                      }


                                      if (!recver_arr.includes(recv_id)) {
                                        recver_arr.push(recv_id);
                                        audience_res.push(audience);
                                      }

                                    }
                                  }
                                })
                              }
                            }
                          }

                          i = i + 1;
                          getAudienceDetails(i);
                        }).catch(function (error) {
                          i = i + 1;
                          getAudienceDetails(i);
                        })
                    } else {
                      i = i + 1;
                      getAudienceDetails(i);
                    }

                  }
                }
              } else {
                var recver_arr1 = [];
                getAudienceDetails(i);
                function getAudienceDetails(i) {

                  var val = Object.keys(subscribeobj);

                  if (i > Object.keys(subscribeobj).length - 1) {

                    dispatch({ type: GET_AUDIENCE_DATA_SUCCESS, payload: audience_res });
                    return;
                  }

                  if (val[i]) {

                    var recv_id = '';
                    var Recsubiddata = '';

                    if (val[i].includes('_RECIEVER')) {
                      recv_id = val[i].replace('_RECIEVER', '');
                      Recsubiddata = subscribeobj[recv_id + '_RECIEVER'];
                    }
                    if (val[i].includes('_SUBSCRIBER')) {
                      recv_id = val[i].replace('_SUBSCRIBER', '');
                      Recsubiddata = subscribeobj[recv_id + '_SUBSCRIBER'];
                    }

                    console.log('auddatata=======', Recsubiddata);
                    if (recv_id !== '') {

                      firebaseConfig.firestore().collection("users").where('uid', "==", recv_id)
                        .get().then(snapshot1 => {
                          if (Recsubiddata.subscribe_type === "one_time_support") {
                            snapshot1.forEach(doc => {
                              if (doc.data() !== undefined) {
                                var aud_arr = doc.data();

                                const audience = {
                                  aud_id: recv_id,
                                  aud_name: aud_arr.username,
                                  aud_profile: aud_arr.avatarURL,
                                }
                                console.log('recv_id', recv_id);
                                console.log('recver_arr', recver_arr1);
                                if (!recver_arr1.includes(recv_id)) {
                                  recver_arr1.push(recv_id);
                                  audience_res.push(audience);
                                }
                              }
                            })
                          }
                          else {
                            if (Recsubiddata.date !== '') {
                              var Rec_subs_date = Recsubiddata.date;
                              var rec_checkDate = new Date();

                              const milliseconds = Rec_subs_date.seconds * 1000 // 1575909015000
                              var rec_cloneDate = new Date(milliseconds)

                              //for monthly subscription

                              rec_cloneDate.setDate(rec_cloneDate.getDate() + 30);
                              if (rec_cloneDate.getTime() > rec_checkDate.getTime()) {
                                snapshot1.forEach(doc => {
                                  if (doc.data() !== undefined) {
                                    var aud_arr = doc.data();

                                    const audience = {
                                      aud_id: recv_id,
                                      aud_name: aud_arr.username,
                                      aud_profile: aud_arr.avatarURL,
                                    }
                                    console.log('recv_id', recv_id);
                                    console.log('recver_arr', recver_arr1);
                                    if (!recver_arr1.includes(recv_id)) {
                                      recver_arr1.push(recv_id);
                                      audience_res.push(audience);
                                    }
                                  }
                                })
                              }
                            }
                          }
                          i = i + 1;
                          getAudienceDetails(i);
                        }).catch(function (error) {
                          i = i + 1;
                          getAudienceDetails(i);
                        })
                    } else {
                      i = i + 1;
                      getAudienceDetails(i);
                    }

                  }
                }
              }

            } else {
              dispatch({ type: GET_AUDIENCE_DATA_FAILURE, payload: false });
            }
          })

        }).catch(function (error) {
          dispatch({ type: GET_AUDIENCE_DATA_FAILURE, payload: false });

        })
    }

  } catch (error) {
    dispatch({ type: GET_AUDIENCE_DATA_FAILURE, payload: error });

  }
};

export const getUserSubscribeStatus = (data) => async dispatch => {
  try {

    dispatch({ type: POST_SUBSCRIBEUSER_STATUS_REQUEST, payload: true });
    if (data.user_id) {
      var subscribeobj = [];
      await firebaseConfig.firestore().collection('users').where('uid', "==", data.user_id)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(doc => {
            var UserData = doc.data();
            subscribeobj = UserData.subscribed_list;

            if (Object.keys(subscribeobj).length > 0) {

              if (Object.keys(subscribeobj).includes(data.subscribe_id + '_SUBSCRIBER')) {
                var subiddata = subscribeobj[data.subscribe_id + '_SUBSCRIBER'];
              
                if(subiddata.subscribe_type === "one_time_support"){
                  dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: true });

                }else{

                  if (subiddata.date !== '') {
                    var subs_date = subiddata.date;
                    var checkDate = new Date();
  
                    const milliseconds = subs_date.seconds * 1000 // 1575909015000
                    var cloneDate = new Date(milliseconds)
  
                    //for monthly subscription
  
                    cloneDate.setDate(cloneDate.getDate() + 30);
                    if (cloneDate.getTime() > checkDate.getTime()) {
  
                      dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: true });
                    }
                    else {
                      dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: 'expired' });
                    }
  
                  } else {
                    dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: false });
                  }
                }
               
              } else {
                if (Object.keys(subscribeobj).includes(data.subscribe_id + '_RECIEVER')) {
                  var Recsubiddata = subscribeobj[data.subscribe_id + '_RECIEVER'];
                  if(Recsubiddata.subscribe_type === "one_time_support"){
                    dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: true });
  
                  }else{
                    if (Recsubiddata.date !== '') {
                      var Rec_subs_date = Recsubiddata.date;
                      var rec_checkDate = new Date();

                      const milliseconds = Rec_subs_date.seconds * 1000 // 1575909015000
                      var rec_cloneDate = new Date(milliseconds)

                      //for monthly subscription

                      rec_cloneDate.setDate(rec_cloneDate.getDate() + 30);
                      if (rec_cloneDate.getTime() > rec_checkDate.getTime()) {

                        dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: true });
                      }
                      else {
                        dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: false });
                      }

                    } else {
                      dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: false });
                    }
                  }
                } else {
                  dispatch({ type: GET_SUBSCRIBEUSER_STATUS_SUCCESS, payload: false });
                }
              }

            } else {

              dispatch({ type: GET_SUBSCRIBEUSER_STATUS_FAILURE, payload: false });
            }
          })

        }).catch(function (error) {
          dispatch({ type: GET_SUBSCRIBEUSER_STATUS_FAILURE, payload: false });

        })
    }

  } catch (error) {
    dispatch({ type: GET_SUBSCRIBEUSER_STATUS_FAILURE, payload: error });

  }
};


async function sendNotification(to_id, from_id) {
  try {

    const res = await firebaseConfig.firestore().collection("users").doc(to_id);
    res.get().then(async (doc) => {

      if (!doc.exists) {

        //dispatch({ type: GET_OTHER_USER_PROFILE_BY_ID_FAILURE, payload: false });
      }
      else {
        var Unread_Notification_Count = 0;
        if (doc.data()?.Notification_tokens) {
          if (doc.data().Notification_tokens.length > 0) {

            var fromname = '';
            const fromres = await firebaseConfig.firestore().collection("users").doc(from_id);
            fromres.get().then((fromdoc) => {

              if (!fromdoc.exists) {

                fromname = "";
              }
              else {
                fromname = fromdoc.data().username;
              }
            });
            console.log(doc.data().Notification_tokens);
            const notification_data = {

              "title": "Subscribed",
              "body": fromname + ' ' + SUBSCRIBED_NOTIFICATION,
              "to": doc.data().Notification_tokens,
            }
            if (doc.data()?.Unread_Notification) {
              Unread_Notification_Count = doc.data().Unread_Notification + 1;
            } else {
              Unread_Notification_Count = 1;
            }

            const notification_response = await axios.post(USER_NOTIFICATION, notification_data);
            console.log('notification_response', notification_response);
            if (notification_response.status === 200) {

              var notifypostdata = {};
              var notification_id = '';
              const notifydocRef = firebaseConfig.firestore().collection('notifications').doc()
              console.log('datanotifyyyy', notifydocRef);
              notification_id = notifydocRef.id;

              notifypostdata[notification_id] = {

                time: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
                type: "SUBSCRIBED_NOTIFICATION",
                user_id: from_id,
                status: 'unread',
                flag: true,

              }
              firebaseConfig.firestore().collection('notifications/').doc(to_id).set(notifypostdata, { merge: true }).then(function () {
                firebaseConfig.firestore().collection('users/').doc(to_id).update({
                  'Unread_Notification': Unread_Notification_Count,
                }).then(function (docres) {

                }).catch(function (error) {
                  ERROR(error.message);

                });
              }).catch(function (error) {
                console.log(error.message);
              })

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

export const getUserSubscriberCount = (data) => async dispatch => {
  try {

    dispatch({ type: POST_USER_SUBSCRIBEUSER_COUNT_REQUEST, payload: true });
    if (data.user_id) {
      var subscriberCount = 0;
      var subscribeobj = [];
      await firebaseConfig.firestore().collection('users').where('uid', "==", data.user_id)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(doc => {
            var UserData = doc.data();

            if (UserData?.subscribed_list) {
              subscribeobj = UserData.subscribed_list;
              let i = 0;
              Object.keys(subscribeobj).map(async function (subkeyid) {
                if (subkeyid.includes('_RECIEVER')) {
                  var sub_id = subkeyid.replace('_RECIEVER', '');
                  const subres = await firebaseConfig.firestore().collection("users").doc(sub_id);
                  subres.get().then(async (subdoc) => {

                    if (!subdoc.exists) {

                    }
                    else {
                      var Recsubiddata = subscribeobj[sub_id + '_RECIEVER'];

                      if(Recsubiddata.subscribe_type === "one_time_support"){
                        subscriberCount = subscriberCount + 1;
                        if (i >= Object.keys(subscribeobj).length - 1) {
                          dispatch({ type: GET_USER_SUBSCRIBEUSER_COUNT_SUCCESS, payload: subscriberCount });
                        }
                      }else{
                        if (Recsubiddata.date !== '') {
                          var Rec_subs_date = Recsubiddata.date;
                          var rec_checkDate = new Date();
  
                          const milliseconds = Rec_subs_date.seconds * 1000 // 1575909015000
                          var rec_cloneDate = new Date(milliseconds)
  
                          //for monthly subscription
  
                          rec_cloneDate.setDate(rec_cloneDate.getDate() + 30);
                          if (rec_cloneDate.getTime() > rec_checkDate.getTime()) {
                            subscriberCount = subscriberCount + 1;
                            if (i >= Object.keys(subscribeobj).length - 1) {
                              dispatch({ type: GET_USER_SUBSCRIBEUSER_COUNT_SUCCESS, payload: subscriberCount });
                            }
                          }
                        }
                      }
                    }
                  })
                  i = i + 1;
                } else {
                  i = i + 1;
                }
              })

            } else {

              dispatch({ type: GET_USER_SUBSCRIBEUSER_COUNT_FAILURE, payload: subscriberCount });
            }
          })

        }).catch(function (error) {
          dispatch({ type: GET_USER_SUBSCRIBEUSER_COUNT_FAILURE, payload: false });
        })
    }
  } catch (error) {
    dispatch({ type: GET_USER_SUBSCRIBEUSER_COUNT_FAILURE, payload: error });

  }
};
