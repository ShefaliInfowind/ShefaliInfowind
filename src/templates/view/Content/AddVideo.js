import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar';
import UserProfile from '../../components/userProfile';
import { useForm } from 'react-hook-form';
import imagePreview from '../../../assets/images/p-vd.png';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core'
// Redux
import { useSelector, connect } from "react-redux";
import { getUserProfileById, fetchUser } from "../../../Redux/actions/auth-actions";
import { addMediaContent } from "../../../Redux/actions/media-actions";
import ReactPlayer from 'react-player'
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import add_content from '../../../assets/images/plus-mobile.svg';
import Loader from './../../../utils/Loader';
import VideoPlayer from '../../components/videoplayer';

function AddVideo(props) {

    const [isLoader, setLoader] = useState(false);
    const [MediaVideo, setMediaVideo] = useState(null);
    const [MediaViewVideo, setMediaViewVideo] = useState(imagePreview);
    const { userDetailsById, authuser } = useSelector((state) => state.authReducer);
    const { progress_bar, loading } = useSelector((state) => state.mediaReducer);
    const [videoError, setvideoError] = useState(null);
    const [MediaYoutubeVideo, setMediaYoutubeVideo] = useState(null);
    const [title, setTitle] = useState('');
    const [errorsval, setErrors] = useState({
        title_err: "",
        media_err: "",
    });

    useEffect(() => {
        if (authuser)
            props.getUserProfileById(authuser.uid);
        setLoader(loading);
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    const MediaVideoChange = async (e) => {

        const videoFile = e.target.files[0];
        if (videoFile) {
            setMediaVideo(null);
            if (!videoFile.name.match(/\.(mp4|mpg|avi)$/)) {
                setvideoError("Please select valid video.");
                return false;
            } else {

                setMediaVideo(e.target.files[0]);
                setMediaViewVideo(URL.createObjectURL(e.target.files[0]));
                setvideoError(null);
                setMediaYoutubeVideo(null);
                setErrors('');
            }
        }
    }

    useEffect(() => {
        setLoader(loading);
        reset({
            title: '',
            youtube_url: '',
        });
        setMediaViewVideo(null);
        setMediaVideo(null);
        setMediaYoutubeVideo(null);

    }, [progress_bar, reset, loading]);

    const MediaYoutubeVideoChange = async (e) => {
        console.log('lastword',e.target.value);
        const youtubeVideoFile = e.target.value;
        if (youtubeVideoFile) {

            setMediaYoutubeVideo(youtubeVideoFile);
            console.log('previewyoutube', youtubeVideoFile);
            setMediaVideo(null);
            setTitle('');
            setErrors({ 'media_err': '' })
        }else{
            setMediaYoutubeVideo(null);
        }
    }

    console.log('MediaYoutubeVideo8888', MediaYoutubeVideo);
    console.log('MediaViewVideo9999', MediaViewVideo);

    const handleTitle = (e) => {
        setTitle(e.target.value);
        if (e.target.value === '') {
            setErrors({ 'title_err': 'Title is required' });
            return false;
        }
        else if (e.target.value.length >= 20) {
            setErrors({ 'title_err': 'Title cannot exceed 20 characters' });
            return false;
        }
        else {
            setErrors({ 'title_err': '' });
        }
    }


    const onSubmit = async (event) => {

        if (MediaVideo === null && MediaYoutubeVideo === null) {
            setErrors({ 'media_err': 'Please upload video or add a link' })
            return false;
        }
        else if (MediaVideo !== null) {
            if (title === '') {
                setErrors({ 'title_err': 'Title is required' });
                return false;
            }
            else if (title.length >= 20) {
                setErrors({ 'title_err': 'Title cannot exceed 20 characters' });
                return false;
            }
            else {
                setErrors({ 'title_err': '' });
            }
        } else {
            if (MediaYoutubeVideo !== null) {
                console.log('MediaYoutubeVideo', MediaYoutubeVideo);
                if (MediaYoutubeVideo !== undefined || MediaYoutubeVideo !== '') {
                    var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

                    // var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                    var match = MediaYoutubeVideo.match(regExp);
                    if (match) {
                        console.log('correct');
                        setErrors({ 'media_err': '' })
                    }
                    else {
                        console.log('notcorrect');
                        setErrors({ 'media_err': 'Please enter valid url' })
                        return false;

                    }
                }
            }
        }

        if ((MediaVideo !== null && title !== '') || (MediaYoutubeVideo !== null)) {
            var via = '';
            var media_url = '';
            if (MediaVideo !== null) {
                via = 'local';
                media_url = MediaVideo;
            }
            else {
                via = 'youtube';
                media_url = MediaYoutubeVideo;
            }
            const data = {
                uid: userDetailsById.uid,
                username: userDetailsById.username,
                userAvatarUrl: userDetailsById.avatarURL,
                title: title,
                media_type: 'video',
                public: event.public_content,
                media_content: media_url,
                via: via,

            };

            await props.addMediaContent(data, props.history);
        }
    };

    return (
        <div className='main-page-wrapper'>
            {isLoader ? <Loader isLoader={true} /> : null}
            <Navbar />

            <div className='middleMainSection'>
                <div className="mob-secion  add-content-header">
                    <div className="mobile-top-logo">
                        <div className="left-square"><img src={square_img} alt='' /></div>
                        <div className="mobile-center-logo"><img src={mobile_logo} alt='' /></div>
                        <div className="mobile-add-content"> <Link to="/addContent"><img src={add_content} alt='' /></Link></div>
                    </div>
                </div>
                <div className='middleSection-add-content1'>
                    <div className="addContentSec">
                        <UserProfile />

                        <div className="choose-content">
                            <h2>Upload your video or add a link <br /> from youtube</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="choose-who-row">
                                    <div className="choose-who-left">
                                        <div className="choose-who-top">
                                            <div className="who-inner">
                                                <div className="choose-who-top-left">
                                                    <div className="ch-in"><span>*</span> Choose who can see this content</div>
                                                </div>
                                                <div className="choose-who-top-right">
                                                    <div className="cus-rd">
                                                        <input type="radio" id="test1" name="public_content" value="false" {...register("public_content", { required: true })} />
                                                        <label for="test1">
                                                            <span>Subscribers only</span>
                                                        </label>
                                                    </div>
                                                    <div className="cus-rd">
                                                        <input type="radio" id="test2" name="public_content" value="true" {...register("public_content", { required: true })} />
                                                        <label for="test2">
                                                            <span>Everyone</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {errors?.public_content?.type === "required" && (
                                                <p className="errMsg">This field is required</p>
                                            )}
                                        </div>
                                        <div className="choose-who-mdl">
                                            <div className="choose-who-mdl-left">
                                                <div className="vd-in">
                                                    <span><img src={require('../../../assets/images/playSmall.svg').default} alt='' /></span>
                                                    <span>Video</span>
                                                </div>
                                            </div>
                                            <div className="choose-who-mdl-right">
                                                <div className="vd-right">
                                                    <div className="progress">
                                                        <div className="progress-bar" role="progressbar" style={{ width: progress_bar + '%' }} aria-valuenow={progress_bar} aria-valuemin="0" aria-valuemax="100"><span className="pro-pra">{progress_bar}%</span></div>
                                                    </div>

                                                    <div className="upload-vd upload-vido">
                                                        <label for="file">UPLOAD VIDEO</label>
                                                        <input type="file" id="file" onChange={MediaVideoChange} />
                                                        {videoError && (
                                                            <p className="errMsg">{videoError}</p>
                                                        )}
                                                    </div>

                                                    <div className="title-name">
                                                        <p><input type="text" name="title" className="form-control log-inp" value={title !== '' ? title : ''} placeholder="Title" onChange={handleTitle} />
                                                        </p>
                                                        {errorsval.title_err ? <p className="errMsg">{errorsval.title_err}</p> : ''}

                                                        <p className="tl-or">or</p>
                                                        <p><input type="text" onChange={MediaYoutubeVideoChange} name="youtube_url" className="form-control log-inp" value={MediaYoutubeVideo !== null ? MediaYoutubeVideo : "" } placeholder="Video Youtube Link URL (youtube.com/sfdskphfa)" />
                                                        </p>
                                                    </div>
                                                    {errorsval.media_err ? <p className="errMsg">{errorsval.media_err}</p> : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="choose-who-right">
                                        <div className="up-rights">
                                            <p>Preview</p>
                                            <div className="up-rights-img up-right-vi-do"></div>
                                            {MediaYoutubeVideo !== null ? (
                                                <ReactPlayer width="320" height="240" url={MediaYoutubeVideo} />
                                            ) : MediaViewVideo !== null ? (
                                                <VideoPlayer type="addContent" videourl={MediaViewVideo} />

                                            ) : <img src={require('../../../assets/images/p-vd.png').default} alt='' />}

                                            <Button type="submit" className='btn'>
                                                Done
                                            </Button>
                                            {/* <video width="320" height="240" controls>
                                                        <source src={MediaViewVideo} type="video/mp4"/>
                                                    </video> */}
                                        </div>
                                    </div>
                                </div>
                            </form>
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
        progress_bar: state.mediaReducer.progress_bar,
        authuser: state.authReducer.authuser,
        loading: state.mediaReducer.loading
    }
}

const actionCreators = { getUserProfileById, addMediaContent, fetchUser };
export default connect(mapStateToProps, actionCreators)(AddVideo);

