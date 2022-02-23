import React, {useRef, useState, useEffect } from 'react'
import Navbar from '../Navbar';
import UserProfile from '../../components/userProfile';
import { useForm } from 'react-hook-form';
import imagePreview from '../../../assets/images/upload-aud.png';
import { Button } from '@material-ui/core'
import { Link } from "react-router-dom";
// Redux
import { useSelector, connect } from "react-redux";
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import { addMediaContent } from "../../../Redux/actions/media-actions";
import { Media, Player, controls } from 'react-media-player'
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import Loader from './../../../utils/Loader';
import add_content from '../../../assets/images/plus-mobile.svg';
import audio_img from '../../../assets/images/upload-aud.png';
const { PlayPause } = controls


function AddAudio(props) {

    const jsmediatags = window.jsmediatags;
    const ref = useRef();
    const [isLoader, setLoader] = useState(false);
    const [MediaAudio, setMediaAudio] = useState(null);
    const [MediaViewAudio, setMediaViewAudio] = useState(imagePreview);
    const { userDetailsById,authuser } = useSelector((state) => state.authReducer);
    const { progress_bar,loading } = useSelector((state) => state.mediaReducer);
    const [audioError, setaudioError] = useState(null);
    const [coverImage, setCoverImage] = useState('');
    const [CoverImageView, setCoverImageView] = useState(audio_img);
    const [imgError, setimgError] = useState(null);

    useEffect(() => {
        if(authuser)
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

    
    const UploadCoverArt = async (e) => {

        const imageFile = e.target.files[0];
        if (imageFile) {
            if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                setimgError("Please select valid image.");
                return false;
            }else{
               
                setCoverImageView(URL.createObjectURL(e.target.files[0]));
                setCoverImage(e.target.files[0]);
                setimgError(null);
            }
        }
    }

    const MediaAudioChange = async (e) => {

        const imageFile = e.target.files[0];
        if (imageFile) {
            if (!imageFile.name.match(/\.(mp3)$/)) {
                setaudioError("Please select valid audio.");
                return false;
            } else {
              
                setMediaViewAudio(URL.createObjectURL(e.target.files[0]));
                setMediaAudio(e.target.files[0]);
                setaudioError(null);
               
                const fille = e.target.files[0];
                jsmediatags.read(fille, {
                onSuccess: function(tag) {
                   
                    if(tag.tags?.picture){
                        ref.current.value = ""
                        const img_data = tag.tags.picture.data;
                        const img_format = tag.tags.picture.format;
                        let base64String = "";
                        for (let i = 0; i < img_data.length; i++) {
                        base64String += String.fromCharCode(img_data[i]);
                        
                        }
                        
                        var myimg = `data:${img_format};base64,${window.btoa(base64String)}`;
                        if(myimg){
                            var arr = myimg.split(','),
                            mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), 
                            n = bstr.length, 
                            u8arr = new Uint8Array(n);
                            
                            while(n--){
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            var timestamp = new Date().getTime().toString();
                            var filetype = mime.toLowerCase();
                            var filename = 'coverart_'+timestamp+'.'+filetype;
                            
                            var coverimg =  new File([u8arr], filename, {type:'image/'+mime});
                            setCoverImage(coverimg);
                            setCoverImageView(myimg)
                        }
                    }else{
                        setCoverImageView(audio_img)
                    }
                },
                onError: function(error) {
                    console.log(error);
                }
                });
            }
        }
    }

    useEffect(() => {
        setLoader(loading);
        reset({
            title: '',
        });
        setMediaViewAudio(null);
        setMediaAudio(null);
        setCoverImageView(audio_img);
        setCoverImage('');
    }, [progress_bar, reset,loading]);

    const onSubmit = async (event) => {
      
        if (MediaAudio === null) {
            setaudioError('Please select audio.');
            return false;
        } else if(coverImage === ''){
            setimgError('Please upload cover art for audio.');
            return false;
        }else{
            const data = {
                uid: userDetailsById.uid,
                username: userDetailsById.username,
                userAvatarUrl: userDetailsById.avatarURL,
                title: event.title,
                media_type: 'audio',
                user_type: event.user_type,
                public: event.public_content,
                media_content: MediaAudio,
                cover_art: coverImage,
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
                            <h2>Add an audio to your profile feed</h2>
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
                                                    <span><img src={require('../../../assets/images/Vector-aud.svg').default} alt='' /></span>
                                                    <span>Audio</span>
                                                </div>
                                            </div>
                                            <div className="choose-who-mdl-right">
                                                <div className="vd-right">
                                                    <div className="progress">
                                                        <div className="progress-bar" role="progressbar" style={{ width: progress_bar + '%' }} aria-valuenow={progress_bar} aria-valuemin="0" aria-valuemax="100"><span className="pro-pra">{progress_bar}%</span></div>
                                                    </div>
                                                    <div className="upload-vd upload-ad">
                                                        <label for="file">UPLOAD audio</label>
                                                        <input type="file" id="file" onChange={MediaAudioChange} />
                                                        {audioError && (
                                                            <p className="errMsg">{audioError}</p>
                                                        )}
                                                    </div> 
                                                    <div className="title-name">
                                                        <p><input type="text" name="title" className="form-control log-inp" placeholder="Title" {...register("title", {
                                                            required: true,maxLength: 20,
                                                        })} />
                                                        {errors?.title?.type === "required" && (
                                                            <p className="errMsg">This field is required</p>
                                                        )}
                                                        {errors?.title?.type === "maxLength" && (
                                                            <p className="errMsg">Title cannot exceed 20 characters</p>
                                                        )}
                                                        </p>
                                                    </div>
                                                    {/* <div className="upload-vd upload-imgs"> */}
                                                    {/* <label for="file">UPLOAD Cover Art</label> */}
                                                    <div className='coverfile_upload_img'>
                                                        <label for="coverfile">Upload Image</label>
                                                        <input ref={ref} type="file" className='form-control' id="coverfile" onChange={UploadCoverArt} />
                                                        {imgError && (
                                                            <p className="errMsg">{imgError}</p>
                                                        )}
                                                    </div>
                                                    <div className="ad-will">Audio will appear in your audio section</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="choose-who-right">
                                        <div className="up-rights vd-buttons">
                                            <p>Preview</p>
                                            <div className="up-rights-img">  
                                                <img value="coverPreview" name="coverPreview" src={CoverImageView} alt=''/>
                                                {MediaViewAudio !== null ? (
                                                <Media>
                                                    <div className="media">
                                                    <div className="media-player">
                                                        <Player src={MediaViewAudio} /> 
                                                    </div>
                                                    <div className="media-controls">
                                                        <PlayPause />
                                                    </div>
                                                    </div>
                                                </Media>) :''}
                                            </div>
                                            <Button type="submit" className='btn'>Done</Button>
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
        loading : state.mediaReducer.loading
    }
}

const actionCreators = { getUserProfileById, addMediaContent,fetchUser };
export default connect(mapStateToProps, actionCreators)(AddAudio);
