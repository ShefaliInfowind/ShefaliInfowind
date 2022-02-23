import React, { useState, useEffect } from 'react'
import { getUserProfileById, fetchUser } from "../../../Redux/actions/auth-actions";
import { getUserMediaMusic } from "../../../Redux/actions/media-actions";
import { useSelector, connect } from "react-redux";
import MusicComponent from '../../components/musicComponent';
import { Button, CircularProgress } from '@material-ui/core'
import { getUserSubscriptionExpired } from "../../../Redux/actions/subscriber-actions";
import ExpiryDate from "../../components/subscriptionExpiryDate";

function HomeAudio(props) {

    const [isLoader, setLoader] = useState(true);
    const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
    const { userMusic,music_content_like,music_content_bookmark,MusicTotal,loading } = useSelector((state) => state.mediaReducer);
    const [profileId, setProfileId] = useState();
    const [initialLimit, setInitialLimit] = useState(6);
    const [dataLimit, setDataLimit] = useState(6);
    const { subscribeExpired } = useSelector((state) => state.subscriberReducer);
    const [expiredDate, setExpiredDate] = useState('');
    const [viewPermission, setViewPermission] = useState(false);
   
    useEffect(() => {
        async function fetchdata() {
           console.log('propsprofileid',props);
           
            if (props.userProfileId) {
                const profileid = Buffer.from(props.userProfileId, 'base64').toString('ascii');
                setProfileId(profileid);
                await props.getUserProfileById(profileid);
                await props.getUserMediaMusic(profileid,dataLimit);
                const data ={
                    user_id:authuser.uid,
                    subscriberId:profileid,
                }
                await props.getUserSubscriptionExpired(data);
                setLoader(false);
            }
            else {
                await props.getUserProfileById(authuser.uid);
                await props.getUserMediaMusic(authuser.uid,dataLimit);
                setLoader(false);
            }
        }
        fetchdata();
      
    }, [authuser.uid,music_content_like,music_content_bookmark,dataLimit,isLoader]);

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
            }
        }

    },[profileId,subscribeExpired]);

    const handleNext = () =>  {
       var new_limit = dataLimit + initialLimit;
       setDataLimit(new_limit);
    }; 

    return (
             
            <div className='right-post-items'>
                {userMusic.length > 0 ? (
                    userMusic.map((mediaContent) => (
                        mediaContent.media_type === "audio" && (
                        <div className={`post-item ${props.userProfileId ? mediaContent.public === 'true' ? 'media-unlock' : viewPermission === true ? 'media-unlock' : '' : 'media-unlock'}`}>
                            <MusicComponent type="home" mediaId={mediaContent.id} uid={props.userProfileId ? props.userProfileId : authuser.uid} mediaData={mediaContent}/>
                        </div>
                    )
                    ))) : ''} 
                {
                    userMusic && (
                        userMusic.length < MusicTotal ?
                        <div className='LoadMore-btn'>
                            <Button className="btn" type="button" onClick={handleNext}>
                                Load More...
                                {/* <CircularProgress /> */}
                            </Button>
                        </div> : '' )
                }
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
        MusicTotal: state.mediaReducer.MusicTotal,  
        subscribeExpired: state.subscriberReducer.subscribeExpired,
    }
}

const actionCreators = { getUserProfileById, fetchUser, getUserMediaMusic,getUserSubscriptionExpired };
export default connect(mapStateToProps, actionCreators)(HomeAudio);
