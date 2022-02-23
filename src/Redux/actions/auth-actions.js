import {
  POST_REGISTER_REQUEST, GET_REGISTER_SUCCESS, GET_REGISTER_FAILURE,
  POST_LOGIN_REQUEST, GET_LOGIN_SUCCESS, GET_LOGIN_FAILURE,
  POST_LOG_OUT_REQUEST, GET_LOG_OUT_SUCCESS, GET_LOG_OUT_FAILURE,
  POST_USER_AUTH_REQUEST, GET_USER_AUTH_SUCCESS, GET_USER_AUTH_FAILURE,
  POST_USER_PROFILE_BY_ID_REQUEST, GET_USER_PROFILE_BY_ID_SUCCESS, GET_USER_PROFILE_BY_ID_FAILURE,
  POST_OTHER_USER_PROFILE_BY_ID_REQUEST, GET_OTHER_USER_PROFILE_BY_ID_SUCCESS, GET_OTHER_USER_PROFILE_BY_ID_FAILURE,
  POST_FORGET_PASSWORD_REQUEST, GET_FORGET_PASSWORD_SUCCESS, GET_FORGET_PASSWORD_FAILURE,
  POST_UPDATE_PROFILE_IMAGE_REQUEST, GET_UPDATE_PROFILE_IMAGE_SUCCESS, GET_UPDATE_PROFILE_IMAGE_FAILURE,
  POST_UPDATE_PROFILE_REQUEST, GET_UPDATE_PROFILE_SUCCESS, GET_UPDATE_PROFILE_FAILURE,
  POST_CHANGE_PASSWORD_REQUEST, GET_CHANGE_PASSWORD_SUCCESS, GET_CHANGE_PASSWORD_FAILURE,
  POST_USER_SUBSCRIPTION_REQUEST, GET_USER_SUBSCRIPTION_SUCCESS, GET_USER_SUBSCRIPTION_FAILURE,
  POST_DISABLE_USER_REQUEST,GET_DISABLE_USER_SUCCESS,GET_DISABLE_USER_FAILURE,
  //POST_UPDATE_LINK_THUMBNAIL_IMAGE_REQUEST, GET_UPDATE_LINK_THUMBNAIL_IMAGE_SUCCESS, GET_UPDATE_LINK_THUMBNAIL_IMAGE_FAILURE,

} from './type';
import {
  DISABLE_USER

} from './api_url';
import axios from 'axios';
import firebaseConfig from "../../firebase";
//import { toast } from "react-toastify";
import { googleProvider, facebookProvider, auth } from "../auth-service";
import { ERROR,RedirectModal ,Success } from './../../utils/errors';
import 'antd/dist/antd.css'
import * as moment from 'moment';
import { Redirect } from 'react-router-dom';

// For firebase registration 
export const register = (data, history) => async (dispatch) => {
  try {
   
   // const token = firebaseConfig.messaging();
    dispatch({ type: POST_REGISTER_REQUEST, payload: true });
    // For username unique check 
    //  const uniquecheck = await isUsernameUnique('username', data.username, 'users');
   
    // if (uniquecheck) {

      // For firebase authentication (signup) 
      const response = await auth.createUserWithEmailAndPassword(data.email, data.password);
      if (response.user) {

        response.user.sendEmailVerification().then(() => {
        dispatch({ type: GET_REGISTER_SUCCESS, payload: response.user.toJSON() });
        const user_data = response.user.toJSON()

        // For user other details (firebase collection) 
        firebaseConfig.firestore().collection('users').doc(user_data.uid).set({
          createdAt:moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
          uid: user_data.uid,
          username: data.username,
          dob: data.dob,
         // user_type: data.user_type,
          email: data.email,
          privacy_policy: data.privacy_policy,
          terms_condition: data.terms_condition,
          avatarURL: '',
          slug_name: data.username.toLowerCase(),
          provider_type: 'normal',
          user_active: true,

        })
        // For user profile image (firebase storage) 

        imageUpload(data.user_image, user_data.uid, 'avatars/', 'users', 'avatarURL');
        // firebaseConfig.firestore().collection('users').doc(response.user.uid).collection('device_tokens').doc(response.user+'_1').set({
            
        //   name: 'test',
        
        // })

        Success("Registration successful");
        history.push("/");


      }).catch(function (error) {
          dispatch({ type: GET_REGISTER_FAILURE, payload: error });
          ERROR(error.message);
        })
      } else {
        dispatch({ type: GET_REGISTER_FAILURE, payload: false });
        ERROR("Registration failed");
      }
    // } else {
    //   console.log('not unique');
    //   dispatch({ type: GET_REGISTER_FAILURE, payload: false });
    //   ERROR("User name is already taken");
    // }
  } catch (error) {
    dispatch({ type: GET_REGISTER_FAILURE, payload: error.message });
    ERROR(error.message);
    //throw error;
  }
};



async function UserToken(uid,type){


      const tokenres = firebaseConfig.messaging();
      console.log('tokenres',tokenres)
      await tokenres.getToken({vapidKey: 'BMojzVLMq7lcRZRFLrhhDu03Pz1nvxuA8g5BtOoKwssL2Rt2LcjSoBTPeflpQceuQYc7AQGIup_FksjMe_ei-Q4'}).then(function (refreshedToken) {
          
        if(refreshedToken){
            if(type === 'login'){
              firebaseConfig.firestore().collection('users/').doc(uid).update({
                Notification_tokens: firebaseConfig.firestore.FieldValue.arrayUnion(refreshedToken),
              }).then(function (docres) {
               console.log('tokkkkeeennn',refreshedToken);
              }).catch(function (error) {
               //ERROR(error.message);
  
              });
            }

            if(type === 'logout'){
              firebaseConfig.firestore().collection('users/').doc(uid).update({
                Notification_tokens: firebaseConfig.firestore.FieldValue.arrayRemove(refreshedToken),
              }).then(function (docres) {
                console.log('tokkkkeeennn',refreshedToken);
              }).catch(function (error) {
              // ERROR(error.message);
  
              });
            }
          }
      }).catch(function (error) {
        // ERROR(error.message);

        });
  
}

// For firebase login 
export const login = (email, password, history,profile_url) => async (dispatch) => {
  
  try {
    dispatch({ type: POST_LOGIN_REQUEST, payload: true });
        console.log('-----helloevevvvvv----------');
        const response = await auth.signInWithEmailAndPassword(email, password)

           if (response.user) {
            console.log('rs-----------------',response.user);
             if(response.user.emailVerified === true){
               await UserToken(response.user.uid,'login');
               if(profile_url !== '')
               {
                 dispatch({ type: GET_LOGIN_SUCCESS, payload: response.user.toJSON() });
                 window.location = window.location.origin+profile_url;
               }else{
                 dispatch({ type: GET_LOGIN_SUCCESS, payload: response.user.toJSON() });
                 history.push("/addContent");
               }
             }else{
               response.user.sendEmailVerification();
               dispatch({ type: GET_LOGIN_FAILURE, payload: "Please verify your email, Check your emails for a confirmation email" });
               ERROR("Please verify your email, Check your emails for a confirmation email");
             }
             
           } else {
             dispatch({ type: GET_LOGIN_FAILURE, payload: false });
             ERROR("Invalid email and password");
           }
       
  } catch (error) {
  
    dispatch({ type: GET_LOGIN_FAILURE, payload: error.message });
    ERROR("Invalid email and password");
    console.log('login errorrrr',error.message);
    //throw error;
  }
};

// Social login.
export const socialLogin = (data, history,profile_url) => async dispatch => {
  try {
    var provider_type = '';
    var uname = '';
    if (data === 'google') {
      provider_type = googleProvider;
    }
    else if (data === 'facebook') {
      provider_type = facebookProvider;
    }
    dispatch({ type: POST_LOGIN_REQUEST, payload: true });


    const response = await auth.signInWithPopup(provider_type)
   
    if (response.user) {
     
      console.log('accesstokennnn',response.credential.accessToken)
      const user_data = response.user.toJSON()
      console.log('myuserrr',user_data);
      if( user_data.displayName !== '')
      {
        uname = user_data.displayName
      }
      await UserToken(response.user.uid,'login');

      dispatch({ type: GET_LOGIN_SUCCESS, payload: response.user.toJSON() });
      const userexist = firebaseConfig.firestore().collection('users').doc(user_data.uid)
      userexist.get().then((doc) => {
        if (!doc.exists) {

          // For user other details (firebase collection) 
          firebaseConfig.firestore().collection('users').doc(user_data.uid).set({
            createdAt: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
            uid: user_data.uid,
            email: user_data.email,
            provider_type: data,
            username :uname,
            slug_name: uname.toLowerCase(),
            avatarURL: '',
            user_active: true,
          })
        }
      })
    
      if(profile_url !== '')
      {
        window.location = window.location.origin+profile_url;
      }else{
        console.log('checkkkkkkk',history);
        history.push("/addContent");
      }
    } else {
      dispatch({ type: GET_LOGIN_FAILURE, payload: false });
      ERROR("Invalid email and password");
     
    }
  } catch (error) {
    dispatch({ type: GET_LOGIN_FAILURE, payload: error });
    //ERROR(error.message);
  }
};

// For firebase logout 
export const logout = (history) => async (dispatch) => {
  try {
    dispatch({ type: POST_LOG_OUT_REQUEST, payload: true });
    await UserToken(auth.currentUser.uid,'logout');
    await auth.signOut()
    dispatch({ type: GET_LOG_OUT_SUCCESS, payload: true });
    history.push('/');
  } catch (error) {
    dispatch({ type: GET_LOG_OUT_FAILURE, payload: error.message });
    ERROR(error.message);
   // throw error;
  }
};

// For checking user login 
export const fetchUser = () => async (dispatch) => {
  try {

    dispatch({ type: POST_USER_AUTH_REQUEST, payload: true });
    await auth.onAuthStateChanged((currentUser) => {
      console.log('checkkkkkcurrent',currentUser);
      if (currentUser) {
        console.log('-----igi',currentUser.providerData[0].providerId);
        if(currentUser.emailVerified === true){
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("user_id", currentUser.uid);
          dispatch({
            type: GET_USER_AUTH_SUCCESS,
            payload: currentUser.toJSON(),
          });
        }else {
          if(currentUser.providerData[0].providerId === 'facebook.com'){
            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("user_id", currentUser.uid);
            dispatch({
              type: GET_USER_AUTH_SUCCESS,
              payload: currentUser.toJSON(),
            });
          }else{
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user_id");
          dispatch({
            type: GET_USER_AUTH_FAILURE,
            currentUser: null,
          });
        }
      }
      } else {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user_id");
        dispatch({
          type: GET_USER_AUTH_FAILURE,
          currentUser: null,
        });
      }
    });
  } catch (error) {
    dispatch({ type: GET_USER_AUTH_FAILURE, payload: error.message });
    //throw error;
  }
};

// For get user collection data 
export const getUserProfileById = (userid) => async dispatch => {
  try {
    console.log('userid',userid);
    dispatch({ type: POST_USER_PROFILE_BY_ID_REQUEST, payload: true });
    //await auth.onAuthStateChanged((currentUser) => {
      if (userid) {
        
        const res = await firebaseConfig.firestore().collection("users").doc(userid);
        res.get().then((doc) => {
          
          if (!doc.exists) {
          
            dispatch({ type: GET_USER_PROFILE_BY_ID_FAILURE, payload: false });
          }
          else {
            dispatch({ type: GET_USER_PROFILE_BY_ID_SUCCESS, payload: doc.data() }); 
            
          }
        });
      } else {
       
        dispatch({ type: GET_USER_PROFILE_BY_ID_FAILURE, payload: false });
       
      }
  //  })
  } catch (error) {
   
    dispatch({ type: GET_USER_PROFILE_BY_ID_FAILURE, payload: error });
  }
};

// For unique check
async function isUsernameUnique(field_name, value, collection_name) {
  try {
    const nameDoc = await firebaseConfig.firestore().collection(collection_name).where(field_name, "==", value).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return true;
        } else {
          return false;
        }
      })
    return nameDoc;
  } catch (e) {
    console.log(e)
    return false;
  }
}

//For forgot password
export const forgotPassword = (email, history) => (dispatch) => {
  try {
    dispatch({ type: POST_FORGET_PASSWORD_REQUEST, payload: true });
    const response = auth.sendPasswordResetEmail(email)
      .then(function () {
        dispatch({ type: GET_FORGET_PASSWORD_SUCCESS, payload: response.data });
        Success("Email sent");
        history.push('/');
      }).catch(function (error) {
        dispatch({ type: GET_FORGET_PASSWORD_FAILURE, payload: error });
        ERROR(error.message);
      })
  } catch (error) {
    dispatch({ type: GET_FORGET_PASSWORD_FAILURE, payload: error });
    ERROR(error.message);
    //throw error;
  }
};

// Update profile image.
export const updateUserProfileOrCoverImage = (data, history) => async dispatch => {
  try {
    console.log('all history', history);
    dispatch({ type: POST_UPDATE_PROFILE_IMAGE_REQUEST, payload: true });
    const uid = localStorage.getItem("user_id");
    if (uid) {
     
      if (data.type === "user image") {
       
        const response = imageUpload(data.image, uid, 'avatars/', 'users', 'avatarURL')
          .then(function () {
            dispatch({ type: GET_UPDATE_PROFILE_IMAGE_SUCCESS, payload: data });
            Success("Profile image successfully updated");
           // history.push('/settings');
          }).catch(function (error) {
            ERROR(error.message);
            dispatch({ type: GET_UPDATE_PROFILE_IMAGE_FAILURE, payload: error.message });
          })
      }
      else {
        const response = imageUpload(data.image, uid, 'covers/', 'users', 'coverURL')
          .then(function () {
            dispatch({ type: GET_UPDATE_PROFILE_IMAGE_SUCCESS, payload: data});
            Success("Cover image successfully updated");
           // history.push('/settings');
          }).catch(function (error) {
            ERROR(error.message);
            dispatch({ type: GET_UPDATE_PROFILE_IMAGE_FAILURE, payload: error.message });
          })
      }
    }
  } catch (error) {
    dispatch({ type: GET_UPDATE_PROFILE_IMAGE_FAILURE, payload: error });
  }
};

async function imageUpload(image, id, folder_name, collection_name, columnname) {
  try {

    // For user profile image (firebase storage) 
    if (image !== null) {

      // const img_ext = image.type.split('/').pop();
      // const imagename = id + '.'+img_ext;
      const imagename = id + '.png';
      var storage = firebaseConfig.storage();
      var storageRef = storage.ref();
      storageRef.child(folder_name + imagename).put(image).then(data => {

        data.ref.getDownloadURL().then(url => {
          firebaseConfig.firestore().collection(collection_name).doc(id).update({
            [columnname]: url,
          })

        })
        return true;
      })
     
    }
  } catch (e) {
    console.log(e)
    return false;
  }
}

//update user info
export const updateUserProfile = (data) => async dispatch => {
  try {

    var postdata = {};
    const uid = localStorage.getItem("user_id");

    dispatch({ type: POST_UPDATE_PROFILE_REQUEST, payload: true });
    if (data.update_type === "info") {
      postdata =
      {
        username: data.username,
        dob: data.dob,
        //user_type: data.user_type,
        slug_name: data.username.toLowerCase(),
      }

    }
    else if (data.update_type === "bio") {
      var bioval = data.bio.replace(/\n/g, "\\n");
      postdata =
      {
        bio: bioval,
      }
    } else if (data.update_type === "social_links") {
      postdata =
      {
        'social_links': {
          'facebook': data.facebook,
          'instagram': data.instagram,
          'tiktok': data.tiktok,
          'twitter': data.twitter,
          'youtube': data.youtube,
        }
      }
    } else if (data.update_type === "links") {

      const listen_link = data.listen_links;
      if (listen_link !== '') {
        postdata =
        {
          'listen_now_link': listen_link,
          'links': data.links
        }
      } else {
        postdata =
        {
          'links': data.links
        }
      }
    }

    const resp = await firebaseConfig.firestore().collection('users').doc(uid).update(postdata).then(function (docres) {
      dispatch({ type: GET_UPDATE_PROFILE_SUCCESS, payload: true });
      Success('Updated Successfully');
    }).catch(function (error) {
      ERROR(error.message);
      dispatch({ type: GET_UPDATE_PROFILE_FAILURE, payload: error });
    })
  } catch (error) {
    dispatch({ type: GET_UPDATE_PROFILE_FAILURE, payload: error });
  }
};

//Change Password
export const changePassword = (data) => async dispatch => {
  try {
    var users = auth.currentUser;

    dispatch({ type: POST_CHANGE_PASSWORD_REQUEST, payload: true });
    await auth.signInWithEmailAndPassword(users.email, data.password)
      .then(function (user) {

        users.updatePassword(data.new_password).then(function () {
          Success('Successfully changed password');
          dispatch({ type: GET_CHANGE_PASSWORD_SUCCESS, payload: true });
        }).catch(function (error) {
          ERROR(error.message);
          dispatch({ type: GET_CHANGE_PASSWORD_FAILURE, payload: error });
        });
      }).catch(function (error) {
        ERROR(error.message);
        dispatch({ type: GET_CHANGE_PASSWORD_FAILURE, payload: error });
      });

  } catch (error) {
    ERROR(error.message);
    dispatch({ type: GET_CHANGE_PASSWORD_FAILURE, payload: error });
  }
};

// user subscription

export const userSubscription = (data) => async dispatch => {
  try {

    var users = auth.currentUser;
    dispatch({ type: POST_USER_SUBSCRIPTION_REQUEST, payload: true });

    const resp = await firebaseConfig.firestore().collection('users').doc(users.uid).update({ 'subscription': data })
      .then(function (docres) {
        Success("Successfully Updated");
        dispatch({ type: GET_USER_SUBSCRIPTION_SUCCESS, payload: true });
      }).catch(function (error) {
        ERROR(error.message);
        dispatch({ type: GET_USER_SUBSCRIPTION_FAILURE, payload: error });
      });

  } catch (error) {
    ERROR(error.message);
    dispatch({ type: GET_USER_SUBSCRIPTION_FAILURE, payload: error });
  }
};

//disable User (cancel account)
export const DisableUser = (data,history) => async dispatch => {
  try {
      if (data) {
          dispatch({ type: POST_DISABLE_USER_REQUEST, payload: true });
          const response = await axios.get(DISABLE_USER+'/'+data.uid,{}, {
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          console.log('ressssss',response);
          if (response.status === 200) {
                const updatedata = {
                  user_active: false,
                };
                await firebaseConfig.firestore().collection('users').doc(data.uid).update(updatedata)
                .then(function (docres) {
             
                  dispatch(logout(history));
                  dispatch({ type: GET_DISABLE_USER_SUCCESS,payload: response.data});
                  console.log('ressssss',response.data);
                }).catch(function (error) {
                  ERROR(error.message);
                  dispatch({ type: GET_DISABLE_USER_FAILURE, payload: error });
                });
              
          } else {
              dispatch({ type: GET_DISABLE_USER_FAILURE, payload: false });
              console.log('false',false);
          }
     
      } else {
        dispatch({ type: GET_DISABLE_USER_FAILURE, payload: false });
        console.log('false',false);
      }
  } catch (error) {
    dispatch({ type: GET_DISABLE_USER_FAILURE, payload: error });
    console.log('error------',error.message);
  }
};


export const getOtherUserProfileById = (userid) => async dispatch => {
  try {
    
    dispatch({ type: POST_OTHER_USER_PROFILE_BY_ID_REQUEST, payload: true });
    //await auth.onAuthStateChanged((currentUser) => {
      if (userid) {
        const res = await firebaseConfig.firestore().collection("users").doc(userid);
        res.get().then((doc) => {
          
          if (!doc.exists) {
            
            dispatch({ type: GET_OTHER_USER_PROFILE_BY_ID_FAILURE, payload: false });
          }
          else {
           
            dispatch({ type: GET_OTHER_USER_PROFILE_BY_ID_SUCCESS, payload: doc.data() }); 
            
          }
        });
      } else {
        dispatch({ type: GET_OTHER_USER_PROFILE_BY_ID_FAILURE, payload: false });
      }
  //  })
  } catch (error) {
    dispatch({ type: GET_OTHER_USER_PROFILE_BY_ID_FAILURE, payload: error });
  }
};

