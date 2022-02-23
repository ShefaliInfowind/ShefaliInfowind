import React, { useState, useEffect } from 'react'
import { getUserProfileById, fetchUser } from "../../../Redux/actions/auth-actions";
import { getUserMediaMusic } from "../../../Redux/actions/media-actions";
import { useSelector, connect } from "react-redux";
import {MediaDuration} from '../../components/mediaDuration';
import {PostedTime} from '../../components/calendar_date';
import MediaLike from '../../components/mediaLike';
import MediaBookmark from '../../components/mediaBookmark';
import { Media, Player, controls } from 'react-media-player'
const { PlayPause,Duration } = controls

function HomeAudio(props) {

    
    const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
    const { userMusic,music_content_like,music_content_bookmark } = useSelector((state) => state.mediaReducer);
    const [profileId, setProfileId] = useState();
   
    useEffect(() => {
        async function fetchdata() {
           console.log('propsprofileid',props);
            if (props.userProfileId) {
                const profileid = Buffer.from(props.userProfileId, 'base64').toString('ascii');
                setProfileId(profileid);
                await props.getUserProfileById(profileid);
                await props.getUserMediaMusic(profileid);
            }
            else {
                await props.getUserProfileById(authuser.uid);
                await props.getUserMediaMusic(authuser.uid);
            }
        }
        fetchdata();
       
    }, [authuser.uid,music_content_like,music_content_bookmark]);

    return (
             
            <div className='right-post-items'>
                {userMusic.length > 0 ? (
                    userMusic.map((mediaContent) => (
                        
                        mediaContent.media_type === "audio" && (

                            <div className={`post-item ${props.userProfileId ? mediaContent.public === 'true' ? 'media-unlock' : '' : 'media-unlock'}`}>
                                
                          
                            <div className='post-item-top'>
                                <div className='post-item-user'>
                                    <span className='item-user-img'><img src={userDetailsById?.avatarURL} alt='' /></span>
                                    <span className='item-user-name'>{userDetailsById?.username}</span>
                                </div>
                                <div className='post-tr-bt'>
                                    <span>Released a new</span>
                                    <b>Track</b>
                                </div>
                            </div>
                            <div className='post-item-main'>
                                <div className='post-item-vid'>
                                    <div className='item-vid'><img src={userDetailsById?.avatarURL} alt='' /></div>
                                    <div className='item-vid-btn'><img src={require('../../../assets/images/Play.svg').default} alt='' /></div>
                                </div>
                                <div className='post-item-cont'>
                                    <div className='post-item-dtl'>
                                        <div className='post-item-nm'>{mediaContent.caption}</div>
                                        <div className='post-item-txt'>{mediaContent.caption} <br /><MediaDuration mediaURL={mediaContent.media_url}/></div>
                                        <div className='post-item-btn'>
                                            <Media>
                                           
                                                <div className="media">
                                                    <div className="media-player">
                                                    <Player src={mediaContent.media_url} />
                                                    </div>
                                                    <div className="media-controls">
                                                        <PlayPause />
                                                        <Duration/>
                                                        
                                                    </div>
                                                </div>
                                            </Media>
                                        </div>
                                    </div>
                                    <div className='post-item-btns'>
                                        <Button  className='btn'>
                                        <MediaBookmark user_media_id={props.userProfileId? props.userProfileId :authuser.uid} mediaBookmarkData={mediaContent.user_bookmark} userid={authuser.uid} media_id={mediaContent.id}/>
                                            
                                        </Button>
                                        <Button  className='btn'>
                                            <img src={require('../../../assets/images/icon.svg').default} alt='' />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='post-item-btm'>
                                {/* <div className='post-item-tim'>Today</div> */}
                                <div className='post-item-tim'><PostedTime posted_time={mediaContent.postedAt}/></div>
                                <div className='post-item-lik'>
                                    <MediaLike user_media_id={props.userProfileId? props.userProfileId :authuser.uid} mediaLikedata={mediaContent.user_likes} userid={authuser.uid} media_id={mediaContent.id}/>
                                    <span><img src={require('../../../assets/images/Shape-iic.svg').default} alt='' /> 34 shares</span>
                                </div>
                            </div> 
                        </div>
                    )
                            
                    ))) : ''}   
            </div>

    );
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        userMusic: state.mediaReducer.userMusic,
        music_content_like: state.mediaReducer.music_content_like,
        music_content_bookmark: state.mediaReducer.music_content_bookmark,
        
    }
}

const actionCreators = { getUserProfileById, fetchUser, getUserMediaMusic };
export default connect(mapStateToProps, actionCreators)(HomeAudio);
