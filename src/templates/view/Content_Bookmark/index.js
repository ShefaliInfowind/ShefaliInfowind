import React,{useEffect,useState} from 'react'
import Navbar from '../Navbar';
import { Link } from "react-router-dom";
import UserProfile from '../../components/userProfile';
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import add_content from '../../../assets/images/plus-mobile.svg';
import { getUserBookmarkMusic } from "../../../Redux/actions/media-actions";
import { useSelector, connect } from "react-redux";
import MusicComponent from '../../components/musicComponent';
import Loader from '../../../utils/Loader';
import { Button, CircularProgress } from '@material-ui/core'

function ContentBookmark(props, { history }) {

    const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
    const { user_music_bookmark,music_content_bookmark,loading,MusicBookmarkTotal } = useSelector((state) => state.mediaReducer);
    const [isLoader, setLoader] = useState(false);
    const [initialLimit, setInitialLimit] = useState(6);
    const [dataLimit, setDataLimit] = useState(6);

    useEffect(() => {
        async function fetchdata(){
            if(authuser)
                await props.getUserBookmarkMusic(authuser.uid,dataLimit);
                setLoader(loading);
                
            }
        fetchdata();

    },[authuser.uid,music_content_bookmark,dataLimit]);

    const handleNext = () =>  {
        var new_limit = dataLimit + initialLimit;
        setDataLimit(new_limit);
    }; 
    console.log('user_music_bookmark',user_music_bookmark);
    console.log('music_content_bookmark',music_content_bookmark);
    return (
        <div className='main-page-wrapper'>
            {isLoader ? <Loader isLoader={true} /> : null} 
            <Navbar />

            <div className='middleMainSection'>
                <div className="mob-secion add-content-header">
                    <div className="mobile-top-logo">
                        <div className="left-square"><img src={square_img} alt='' /></div>
                        <div className="mobile-center-logo"><img src={mobile_logo} alt='' /></div>
                        <div className="mobile-add-content"> <Link to="/addContent"><img src={add_content} alt='' /></Link></div>
                    </div>
                </div>
                
                <div className='middleSection-add-content'>
                    <div className="addContentSec">
                        <UserProfile />

                        <div className="saves-post-sec">
                            <div className="saves-post-head">Saves</div>
                            <div className='saves-post-items'>
                                
                                {user_music_bookmark.length !== 0 ? (
                                
                                    user_music_bookmark.map((usrval,i) => (
                                        usrval &&
                                        (
                                            Object.keys(usrval).map((key, index) => (
                                                

                                                <div className={`post-item ${usrval[key].postedById !== userDetailsById.uid ? usrval[key].public === 'true' ? 'media-unlock' : usrval[key].viewPermission === true ? 'media-unlock' : '' : 'media-unlock'}`}>
                                                    <MusicComponent  type="bookmark" mediaId={usrval[key].id} uid={authuser.uid} mediaData={usrval[key]} /> 
                                                </div>
                                            ))
                                        )
                                    ))
                                
                                    ): <span>There is no post bookmark...</span>
                                } 
                            </div>
                            {   user_music_bookmark && (
                                user_music_bookmark.length  < MusicBookmarkTotal  ?
                                <div className='LoadMore-btn'>
                                <Button className="btn" type="button" onClick={handleNext} >
                                    Load More...
                                    {/* <CircularProgress /> */}
                                </Button></div> : '' )
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,    
        music_content_bookmark: state.mediaReducer.music_content_bookmark,   
        loader: state.mediaReducer.loader, 
        user_music_bookmark: state.mediaReducer.user_music_bookmark, 
        MusicBookmarkTotal: state.mediaReducer.MusicBookmarkTotal,

    }
}

const actionCreators = {getUserBookmarkMusic };
export default connect(mapStateToProps, actionCreators)(ContentBookmark);


