import {
    POST_USER_NOTIFICATION_REQUEST,GET_USER_NOTIFICATION_SUCCESS,GET_USER_NOTIFICATION_FAILURE,
    UNREAD_NOTIFICATION_COUNT_REQUEST, UNREAD_NOTIFICATION_COUNT_SUCCESS, UNREAD_NOTIFICATION_COUNT_FAILURE,
    REMOVE_NOTIFICATION_REQUEST,REMOVE_NOTIFICATION_SUCCESS,REMOVE_NOTIFICATION_FAILURE,

} from '../actions/type';

export const initialState = {
    notification_data: [],
    Total_notification:0,
    UserUnreadNotificationCount : 0,
    RemoveNotificationId: '',
   
};

export default function notificationReducer(state = initialState, action) {
   
    switch (action.type) {
        case REMOVE_NOTIFICATION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case REMOVE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                RemoveNotificationId: action.payload,
                loading: false
            };
        case REMOVE_NOTIFICATION_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case UNREAD_NOTIFICATION_COUNT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UNREAD_NOTIFICATION_COUNT_SUCCESS:
            return {
                ...state,
                UserUnreadNotificationCount: action.payload,
                loading: false
            };
        case UNREAD_NOTIFICATION_COUNT_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_USER_NOTIFICATION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notification_data: action.payload,
                Total_notification : action.notificationTotal,
                loading: false,
            };
        case GET_USER_NOTIFICATION_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
