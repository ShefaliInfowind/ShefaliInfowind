import React, { useState, useEffect } from 'react'
import { getUserProfileById, fetchUser } from "../../../Redux/actions/auth-actions";
import { getUserMediaContent } from "../../../Redux/actions/media-actions";
import { useSelector, connect } from "react-redux";
import VideoPlayer from '../../components/videoplayer';
import ReactPlayer from 'react-player'
import { Button, CircularProgress } from '@material-ui/core'
import { Link } from "react-router-dom";
import Loader from './../../../utils/Loader';
import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import { getUserSubscriptionExpired } from "../../../Redux/actions/subscriber-actions";
import ExpiryDate from "../../components/subscriptionExpiryDate";


function HomeVideoImage(props) {

    const [isLoader, setLoader] = useState(true);
    const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
    const { userMedia,MediaTotal, loading } = useSelector((state) => state.mediaReducer);
    const [profileId, setProfileId] = useState();
    const [lightboxStatus, setLightboxStatus] = useState('');
    const [initialLimit, setInitialLimit] = useState(6);
    const [dataLimit, setDataLimit] = useState(6);
    const { subscribeExpired } = useSelector((state) => state.subscriberReducer);
    const [expiredDate, setExpiredDate] = useState('');
    const [viewPermission, setViewPermission] = useState('');

    useEffect(() => {
        if(subscribeExpired.subscribe_type === 'one_time_support'){
            setViewPermission(true);
        }else{
            if(subscribeExpired.date){
                var exp_date = ExpiryDate(subscribeExpired.date);
                if(exp_date !== ''){
                    
                    setExpiredDate(exp_date);
                    setViewPermission(true);
                    
                }else{
                    setViewPermission(false);
                }
                console.log('exp_date',exp_date);
            }else{
                setViewPermission(false);
            }
        }

    },[subscribeExpired]);

    console.log('subscribeExpired',subscribeExpired);
    useEffect(() => {
        async function fetchdata() {
           
            if (props.userProfileId) {
                const profileid = Buffer.from(props.userProfileId, 'base64').toString('ascii');
                setProfileId(profileid);
                await props.getUserProfileById(profileid);
                await props.getUserMediaContent(profileid,dataLimit);
                const data ={
                    user_id:authuser.uid,
                    subscriberId:profileid,
                }
                await props.getUserSubscriptionExpired(data);
                setLoader(false);
            }
            else {
                await props.getUserProfileById(authuser.uid);
                await props.getUserMediaContent(authuser.uid,dataLimit);
                setLoader(false);
            }          
        }
        fetchdata();
    }, [authuser.uid,dataLimit,isLoader]);

    
    const handleLightbox = (eventId) =>  {
        if(lightboxStatus !== ''){
            setLightboxStatus('');
        }else{
            setLightboxStatus(eventId);
        }
    };

    const handleNext = () =>  {
        var new_limit = dataLimit + initialLimit;
        setDataLimit(new_limit);
    }; 

    return (

        <div className='middle-post-items1'>
            {isLoader ? <Loader isLoader={true} /> : null}
            {userMedia.length > 0 ? (
                userMedia.map((mediaContent) => (

                    mediaContent.media_type === "video" && mediaContent.via === "youtube" ? (
                        <div className={`middle-post-item ${props.userProfileId ? mediaContent.public === 'true' ? 'media-unlock' : viewPermission === true ? 'media-unlock' : '' : 'media-unlock'}`}>
                            <div className={`middle-post-item-div you-tube-vd`}>
                                <div className="vd-player-cus">
                               
                                <ReactPlayer 
                                    config={{
                                        file: { 
                                            attributes: { controlsList: 'nodownload' }
                                        } ,

                                        youtube: {
                                            playerVars: {
                                                'playsinline': 1,
                                                'enablejsapi': 1,
                                                'captions' : 0,
                                                'controls' : 0,
                                            },
                                        },
                                    }} 
                                    onContextMenu={e => e.preventDefault()}
                                    width="320" height="240" url={mediaContent.media_url}/>
                                
                                </div>
                            </div>
                        </div>) :


                        mediaContent.media_type === "video" && mediaContent.via === "local" ? (
                            <div className={`middle-post-item ${props.userProfileId ? mediaContent.public === 'true' ? 'media-unlock' : viewPermission === true ? 'media-unlock' : '' : 'media-unlock'}`}>
                                <div className={`middle-post-item-div`}>
                                    
                                    <VideoPlayer type="homeVideo" videourl={mediaContent.media_url} />
                                    <div className='middle-post-txt'>{mediaContent.caption}</div>
                                    
                                </div>
                            </div>) :

                            mediaContent.media_type === "image" && (
                                
                                <div className={`middle-post-item ${props.userProfileId ? mediaContent.public === 'true' ? 'media-unlock' : viewPermission === true ? 'media-unlock' : '' : 'media-unlock'}`}>
                                 
                                    <div className={`middle-post-item-div`}>
                                        <div onClick={props.userProfileId ? mediaContent.public === 'true' ?  () => handleLightbox(mediaContent.id) : viewPermission === true ?  () => handleLightbox(mediaContent.id) : (event) => event.preventDefault() :() => handleLightbox(mediaContent.id)} className='middle-post-img'>
                                        
                                        <img 
                                        src={mediaContent.media_url}
                                        alt=""
                                        oncontextmenu="return false;"
                                        />
                                        
                                        </div>

                                        {lightboxStatus === mediaContent.id && (
                                            
                                            <Lightbox
                                            image={mediaContent.media_url}
                                            title={mediaContent.caption}
                                            showTitle="true"
                                            allowZoom="true"
                                            allowRotate="true"
                                            allowReset="true"
                                            buttonAlign="flex-end"
                                            onClose={handleLightbox}
                                            doubleClickZoom="0"
                                        />
                                        )}
                                        <div className='middle-post-txt'>{mediaContent.caption}</div>
                                    </div>
                                </div>
                               
                            )
                ))
            )  
            :
                <div className="ald1">No content is uploaded, please upload content from  <br /><Link to="/addContent">here...</Link></div>
            }
            {   userMedia && (
                userMedia.length < MediaTotal  ?
                <div className='LoadMore-btn'>
                <Button className="btn" type="button" onClick={handleNext} >
                    Load More...
                    {/* <CircularProgress /> */}
                </Button></div> : '' )
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        userMedia: state.mediaReducer.userMedia,
        loading: state.mediaReducer.loading,
        MediaTotal : state.mediaReducer.MediaTotal,
        subscribeExpired: state.subscriberReducer.subscribeExpired,
    }
}

const actionCreators = { getUserProfileById, fetchUser, getUserMediaContent,getUserSubscriptionExpired };
export default connect(mapStateToProps, actionCreators)(HomeVideoImage);
