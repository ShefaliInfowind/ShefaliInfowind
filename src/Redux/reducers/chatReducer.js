import {
    POST_CONVERSATION_REQUEST,GET_CONVERSATION_SUCCESS,GET_CONVERSATION_FAILURE,
    POST_MESSAGES_REQUEST,GET_MESSAGES_SUCCESS,GET_MESSAGES_FAILURE,
    POST_ADD_CONVERSATION_REQUEST,GET_ADD_CONVERSATION_SUCCESS,GET_ADD_CONVERSATION_FAILURE,
    SEND_MESSAGE_REQUEST,SEND_MESSAGE_SUCCESS,SEND_MESSAGE_FAILURE,
    POST_GROUP_MESSAGES_REQUEST,GET_GROUP_MESSAGES_SUCCESS,GET_GROUP_MESSAGES_FAILURE,
    SEND_GROUP_MESSAGE_REQUEST,SEND_GROUP_MESSAGE_SUCCESS,SEND_GROUP_MESSAGE_FAILURE,
    UNREAD_MESSAGE_COUNT_REQUEST,UNREAD_MESSAGE_COUNT_SUCCESS,UNREAD_MESSAGE_COUNT_FAILURE,

} from '../actions/type';



export const initialState = {
    messageStatus: false,
    conversationList: [],
    messageList: [],
    groupMessageList :[],
    ChatId:'',
    sendMsgStatus: '',
    sendGroupMsgStatus: '',
    UserUnreadMSGCount : 0,
};



export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case UNREAD_MESSAGE_COUNT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UNREAD_MESSAGE_COUNT_SUCCESS:
            return {
                ...state,
                UserUnreadMSGCount: action.payload,
                loading: false
            };
        case UNREAD_MESSAGE_COUNT_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case SEND_GROUP_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case SEND_GROUP_MESSAGE_SUCCESS:
            return {
                ...state,
                sendGroupMsgStatus: action.payload,
                loading: false
            };
        case SEND_GROUP_MESSAGE_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_GROUP_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_GROUP_MESSAGES_SUCCESS:
            return {
                ...state,
                groupMessageList: action.payload,
                loading: false
            };
        case GET_GROUP_MESSAGES_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case SEND_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                sendMsgStatus: action.payload,
                loading: false
            };
        case SEND_MESSAGE_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_ADD_CONVERSATION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_ADD_CONVERSATION_SUCCESS:
            return {
                ...state,
                ChatId: action.payload,
                loading: false
            };
        case GET_ADD_CONVERSATION_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_MESSAGES_SUCCESS:
            return {
                ...state,
                messageList: action.payload,
                loading: false
            };
        case GET_MESSAGES_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_CONVERSATION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_CONVERSATION_SUCCESS:
            return {
                ...state,
                conversationList: action.payload,
                loading: false
            };
        case GET_CONVERSATION_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        default:
            return state;
    }
}



