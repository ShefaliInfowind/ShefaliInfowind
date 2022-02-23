import React, { useState, useEffect } from 'react'
import { MediaMusicBookmark,getUserMediaMusic } from "../../Redux/actions/media-actions";
import { useSelector, connect } from "react-redux";

function MediaBookmark(props) {
    
    const { music_content_bookmark } = useSelector((state) => state.mediaReducer);
    const [userBookmark, setUserBookmark] = useState(false);

    useEffect(() => {
       
        if (props.mediaBookmarkData !== '') {
            
            var userBookmarkStatus = false;
            if(props.mediaBookmarkData){

                for(var i in props.mediaBookmarkData)
                {
                    if(i === props.userid ){ 
                        userBookmarkStatus = true;                 
                    }
                }
                setUserBookmark(userBookmarkStatus);
               
            }
        }
    }, [props,music_content_bookmark,userBookmark]);

    const handleBookmark = async (event) => {
        
        if(event){
            
            var flag = false;
            var data ='';
            var result = {};

            for(var i in props.mediaBookmarkData)
            {
                if(i === props.userid){   
                    flag = true;
                }
                else{

                    result[i] = props.mediaBookmarkData[i];
                }
            }

            if(flag){
                let uid = props.userid;
                data = {
                    id: event,
                    user_bookmark: result,
                    type: 'remove_bookmark',
                    by_id :uid,
                };
               
            }else{
                let uid = props.userid;
                
                data = {
                    id: event,
                    user_bookmark: {
                        [uid] : true
                    } ,
                    type: 'bookmark',
                    by_id :uid,
                };
            }
            await props.MediaMusicBookmark(data);
        }
    };

    return (
        userBookmark === true ? (
            <img onClick={() => handleBookmark(props.media_id)} src={require('../../assets/images/Path-fill.svg').default} alt='' />
        ) 
        : (
            <img onClick={() => handleBookmark(props.media_id)} src={require('../../assets/images/Path.svg').default} alt='' />
        )
       
    );
}

const mapStateToProps = (state) => {
    return {
        music_content_bookmark: state.mediaReducer.music_content_bookmark,
    }
}

const actionCreators = {MediaMusicBookmark,getUserMediaMusic };
export default connect(mapStateToProps,actionCreators)(MediaBookmark);
