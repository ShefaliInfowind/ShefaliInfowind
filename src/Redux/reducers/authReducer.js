import {
    POST_REGISTER_REQUEST, GET_REGISTER_SUCCESS, GET_REGISTER_FAILURE,
    POST_LOGIN_REQUEST, GET_LOGIN_SUCCESS, GET_LOGIN_FAILURE,
    POST_LOG_OUT_REQUEST, GET_LOG_OUT_SUCCESS, GET_LOG_OUT_FAILURE,
    POST_USER_AUTH_REQUEST, GET_USER_AUTH_SUCCESS, GET_USER_AUTH_FAILURE,
    POST_USER_PROFILE_BY_ID_REQUEST,GET_USER_PROFILE_BY_ID_SUCCESS,GET_USER_PROFILE_BY_ID_FAILURE,
    POST_OTHER_USER_PROFILE_BY_ID_REQUEST, GET_OTHER_USER_PROFILE_BY_ID_SUCCESS, GET_OTHER_USER_PROFILE_BY_ID_FAILURE,
    POST_FORGET_PASSWORD_REQUEST, GET_FORGET_PASSWORD_SUCCESS, GET_FORGET_PASSWORD_FAILURE,
    POST_UPDATE_PROFILE_IMAGE_REQUEST, GET_UPDATE_PROFILE_IMAGE_SUCCESS, GET_UPDATE_PROFILE_IMAGE_FAILURE,
    POST_UPDATE_PROFILE_REQUEST,GET_UPDATE_PROFILE_SUCCESS,GET_UPDATE_PROFILE_FAILURE,
    POST_CHANGE_PASSWORD_REQUEST, GET_CHANGE_PASSWORD_SUCCESS, GET_CHANGE_PASSWORD_FAILURE,
    POST_USER_SUBSCRIPTION_REQUEST, GET_USER_SUBSCRIPTION_SUCCESS, GET_USER_SUBSCRIPTION_FAILURE,
    POST_UPDATE_LINK_THUMBNAIL_IMAGE_REQUEST, GET_UPDATE_LINK_THUMBNAIL_IMAGE_SUCCESS, GET_UPDATE_LINK_THUMBNAIL_IMAGE_FAILURE,
    PROFILE_URL,POST_DISABLE_USER_REQUEST,GET_DISABLE_USER_SUCCESS,GET_DISABLE_USER_FAILURE,

} from '../actions/type';

export const initialState = {
    loggedIn: false,
    register: false,
    authuser: [],
    userDetailsById: [],
    otherUserDetailsById:'',
    imagePath: '',
    link_thumb_imagePath: '',
    profileUpdate: false,
    passwordChanged: false,
    subscription: false,
    profile_url: '',
    disableUserData : '',
    disableUserStatus: false,
};

export default function authReducer(state = initialState, action) {

    switch (action.type) {
       
        case POST_DISABLE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_DISABLE_USER_SUCCESS:
            return {
                ...state,
                disableUserData: action.payload,
                loading: false
            };
        case GET_DISABLE_USER_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            }; 
        case PROFILE_URL:
            return { 
                ...state, 
                profile_url: action.data 
            };
        case POST_UPDATE_LINK_THUMBNAIL_IMAGE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_UPDATE_LINK_THUMBNAIL_IMAGE_SUCCESS:
            return {
                ...state,
                imageUpdate: true,
                link_thumb_imagePath: action.payload.filepath,
                loading: false
            };
        case GET_UPDATE_LINK_THUMBNAIL_IMAGE_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_USER_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                subscription: true,
                loading: false
            };
        case GET_USER_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                passwordChanged: true,
                loading: false
            };
        case GET_CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                profileUpdate: true,
                loading: false
            };
        case GET_UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_UPDATE_PROFILE_IMAGE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_UPDATE_PROFILE_IMAGE_SUCCESS:
            return {
                ...state,
                imageUpdate: true,
                imagePath: action.payload,
                loading: false
            };
        case GET_UPDATE_PROFILE_IMAGE_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_FORGET_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_FORGET_PASSWORD_SUCCESS:
            return {
                ...state,
                forgetPassword: true,
                loading: false
            };
        case GET_FORGET_PASSWORD_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_USER_PROFILE_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_PROFILE_BY_ID_SUCCESS:

            return {
                ...state,
                userDetailsById: action.payload,
                loading: false
            };
        case GET_USER_PROFILE_BY_ID_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_OTHER_USER_PROFILE_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_OTHER_USER_PROFILE_BY_ID_SUCCESS:
            return {
                ...state,
                otherUserDetailsById: action.payload,
                loading: false
            };
        case GET_OTHER_USER_PROFILE_BY_ID_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };   
        case POST_USER_AUTH_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_AUTH_SUCCESS:
            return {
                ...state,
                authuser: action.payload,
                loading: false
            };
        case GET_USER_AUTH_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_LOG_OUT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_LOG_OUT_SUCCESS:
            return {
                ...state,
                loggedIn: false,
                authuser: {},
                loading: false
            };
        case GET_LOG_OUT_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_LOGIN_SUCCESS:
            return {
                ...state,
                authuser: action.payload,
                loggedIn: true,
                loading: false
            };
        case GET_LOGIN_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_REGISTER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_REGISTER_SUCCESS:
            return {
                ...state,
                register: true,
                loading: false
            };
        case GET_REGISTER_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
