import React, { useState, useEffect } from 'react'
import { MediaMusicLike,getUserMediaMusic } from "../../Redux/actions/media-actions";
import { useSelector, connect } from "react-redux";

function MediaLike(props) {
    
    const [likeCount, setLikeCount] = useState('');
    const [userLike, setUserLike] = useState(false);
    const { music_content_like } = useSelector((state) => state.mediaReducer);
    const likestyle = {
        color: '#FF0039',
    }
    const unlikestyle = {
        color: 'black',
    }
    
    useEffect(() => {
       
        if (props.mediaLikedata !== '') {
           
            var  mediacount ='';
            var userlikeStatus = false;
            if(props.mediaLikedata){

                mediacount = Object.keys(props.mediaLikedata).length;
                for(var i in props.mediaLikedata)
                {
                    if(i === props.userid ){ 
                        userlikeStatus = true;                 
                    }
                }
                setUserLike(userlikeStatus);
                setLikeCount(mediacount);
            }else{
                setLikeCount(0);
            }
        }
    }, [props,music_content_like,userLike]);


    const handleLikes = async (event,postedById) => {
        if(event){
            
            var flag = false;
            var data ='';
            var result = {};

            for(var i in props.mediaLikedata)
            {
                if(i === props.userid){   
                    flag = true;
                }
                else{

                    result[i] = props.mediaLikedata[i];
                }
            }

            if(flag){
                let uid = props.userid;
                data = {
                    id: event,
                    user_likes: result,
                    type: 'unlike',
                    by_id :uid,
                    postedUserId :postedById,
                };
               
            }else{
                let uid = props.userid;
                
                data = {
                    id: event,
                    user_likes: {
                        [uid] : true
                    } ,
                    type: 'like',
                    by_id :uid,
                    postedUserId :postedById,
                };
            }
        
            await props.MediaMusicLike(data);
        }
    };
   
    return (
           
        userLike === true ? (
            <span style={likestyle} onClick={() => handleLikes(props.media_id,props.postedById)}><img src={require('../../assets/images/heart.svg').default} alt='' /> {likeCount} Likes</span>
        ) 
        : (
            <span style={unlikestyle} onClick={() => handleLikes(props.media_id,props.postedById)}><img src={require('../../assets/images/heart.svg').default} alt='' /> {likeCount} Likes</span>
        )
    );
}

const mapStateToProps = (state) => {
    return {
        music_content_like: state.mediaReducer.music_content_like,
    }
}


const actionCreators = {MediaMusicLike,getUserMediaMusic };
export default connect(mapStateToProps,actionCreators)(MediaLike);
