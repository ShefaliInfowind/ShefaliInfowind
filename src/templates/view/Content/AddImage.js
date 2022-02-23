import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar';
import UserProfile from '../../components/userProfile';
import { useForm } from 'react-hook-form';
import imagePreview from '../../../assets/images/p-imgs.png';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core'
// Redux
import { useSelector, connect } from "react-redux";
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import { addMediaContent } from "../../../Redux/actions/media-actions";
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import add_content from '../../../assets/images/plus-mobile.svg';
import Loader from './../../../utils/Loader';

function AddImage(props) {

    const [isLoader, setLoader] = useState(false);
    const [MediaImage, setMediaImage] = useState(null);
    const [MediaViewImage, setMediaViewImage] = useState(imagePreview);
    const { userDetailsById,authuser } = useSelector((state) => state.authReducer);
    const { progress_bar,loading } = useSelector((state) => state.mediaReducer);
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

    const MediaImageChange = async (e) => {

        const imageFile = e.target.files[0];
        if (imageFile) {
            if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                setimgError("Please select valid image.");
                return false;
            }else{
               
                setMediaViewImage(URL.createObjectURL(e.target.files[0]));
                setMediaImage(e.target.files[0]);
                setimgError(null);
            }
        }
    }

    useEffect( () => {
        setLoader(loading);
        reset({
            title: '',
        });
        setMediaViewImage(null);
        setMediaImage(null);
    },[progress_bar,reset,loading]);

    const onSubmit = async (event) => {
        if (MediaImage === null) {
            setimgError('Please select image.');
            return false;
        } else {
            const data = {
                uid: userDetailsById.uid,
                username: userDetailsById.username,
                userAvatarUrl: userDetailsById.avatarURL,
                title: event.title,
                media_type: 'image',
                user_type: event.user_type,
                public: event.public_content,
                media_content: MediaImage,

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
                            <h2>Add an image to your profile feed</h2>
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
                                                        <label for="test1"><span>Subscribers only</span></label>
                                                    </div>
                                                    <div className="cus-rd">
                                                        <input type="radio" id="test2" name="public_content" value="true" {...register("public_content", { required: true })} />
                                                        <label for="test2"><span>Everyone</span></label>
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
                                                    <span><img src={require('../../../assets/images/sam-img.svg').default} alt='' /></span>
                                                    <span>Image</span>
                                                </div>
                                             </div>
                                             <div className="choose-who-mdl-right">
                                                <div className="vd-right">
                                                    <div className="progress">
                                                        <div className="progress-bar" role="progressbar" style={{ width: progress_bar + '%' }} aria-valuenow={progress_bar} aria-valuemin="0" aria-valuemax="100"><span className="pro-pra">{progress_bar}%</span></div>
                                                    </div>
                                                    <div className="upload-vd upload-imgs">
                                                        <label for="file">UPLOAD image</label>
                                                        <input type="file" id="file" onChange={MediaImageChange} />
                                                        {imgError && (
                                                            <p className="errMsg">{imgError}</p>
                                                        )}
                                                    </div>
                                                    <div className="title-name">
                                                        <p>
                                                            <input type="text" name="title" className="form-control log-inp" placeholder="Title"  {...register("title", {
                                                            required: true,maxLength: 20, })} />
                                                            {errors?.title?.type === "required" && (
                                                                <p className="errMsg">This field is required</p>
                                                            )}
                                                            {errors?.title?.type === "maxLength" && (
                                                                <p className="errMsg">Title cannot exceed 20 characters</p>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                             </div>
                                         </div>
                                     </div>
                                     <div className="choose-who-right">
                                        <div className="up-rights">
                                            <p>Preview</p>
                                            <div className="up-rights-img"><img src={MediaViewImage ? MediaViewImage : imagePreview} alt='' /></div>
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
export default connect(mapStateToProps, actionCreators)(AddImage);
