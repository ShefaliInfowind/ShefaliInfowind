import {
    POST_MEDIA_CONTENT_REQUEST, GET_MEDIA_CONTENT_SUCCESS, GET_MEDIA_CONTENT_FAILURE,
    POST_USER_MEDIA_REQUEST, GET_USER_MEDIA_SUCCESS, GET_USER_MEDIA_FAILURE,
    POST_USER_MEDIA_MUSIC_REQUEST, GET_USER_MEDIA_MUSIC_SUCCESS, GET_USER_MEDIA_MUSIC_FAILURE,
    POST_Like_MEDIA_MUSIC_REQUEST,GET_Like_MEDIA_MUSIC_SUCCESS,GET_Like_MEDIA_MUSIC_FAILURE,
    POST_BOOKMARK_MEDIA_MUSIC_REQUEST,GET_BOOKMARK_MEDIA_MUSIC_SUCCESS,GET_BOOKMARK_MEDIA_MUSIC_FAILURE,
    POST_USER_BOOKMARK_MUSIC_REQUEST,GET_USER_BOOKMARK_MUSIC_SUCCESS,GET_USER_BOOKMARK_MUSIC_FAILURE,
   // POST_SHARE_MEDIA_MUSIC_REQUEST, GET_SHARE_MEDIA_MUSIC_SUCCESS, GET_SHARE_MEDIA_MUSIC_FAILURE,

} from '../actions/type';

export const initialState = {
    media_content: false,
    progress_bar: 0,
    userMedia: [],
    userMusic: [],
    loading: false,
    music_content_like: '',
  //  music_content_share: '',
    music_content_byid: false,
    music_content_bookmark: '',
    user_music_bookmark: [],
    MediaTotal : 0,
    MusicTotal : 0,
    MusicBookmarkTotal :0,

};

export default function mediaReducer(state = initialState, action) {
    var mediaLoader = false;
 
    switch (action.type) {
      
        case POST_USER_BOOKMARK_MUSIC_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_BOOKMARK_MUSIC_SUCCESS:
            return {
                ...state,
                user_music_bookmark: action.payload,
                MusicBookmarkTotal : action.MusicBookmarkTotal,
                loading: false,
            };
        case GET_USER_BOOKMARK_MUSIC_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_BOOKMARK_MEDIA_MUSIC_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_BOOKMARK_MEDIA_MUSIC_SUCCESS:
            return {
                ...state,
                music_content_bookmark: action.payload,
                loading: false
            };
        case GET_BOOKMARK_MEDIA_MUSIC_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_Like_MEDIA_MUSIC_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_Like_MEDIA_MUSIC_SUCCESS:
            return {
                ...state,
                music_content_like: action.payload,
                loading: false
            };
        case GET_Like_MEDIA_MUSIC_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_USER_MEDIA_MUSIC_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_MEDIA_MUSIC_SUCCESS:
            return {
                ...state,
                userMusic: action.payload,
                MusicTotal : action.MusicTotal,
                loading: false
            };
        case GET_USER_MEDIA_MUSIC_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_USER_MEDIA_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_MEDIA_SUCCESS:
            return {
                ...state,
                userMedia: action.payload,
                MediaTotal : action.MediaTotal,
                loading: false
            };
        case GET_USER_MEDIA_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case POST_MEDIA_CONTENT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_MEDIA_CONTENT_SUCCESS:
            if(action.payload !== 100 && action.payload !== 0)
            {
                mediaLoader = true
            }else{
                mediaLoader = false
            }
            return {
                ...state,
                media_content: true,
                progress_bar: action.payload,
                loading: mediaLoader
                
            };
        case GET_MEDIA_CONTENT_FAILURE:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
