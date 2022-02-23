import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core'

//Redux

import { useSelector, connect } from "react-redux";
import { getUserProfileById, updateUserProfile,fetchUser } from "../../../Redux/actions/auth-actions";
import Loader from './../../../utils/Loader';

function SocialLinksSetting(props, { history }) {
    const { userDetailsById,authuser,loading } = useSelector((state) => state.authReducer);
    const [isLoader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    useEffect(() => {
        async function fetchdata(){
        if(authuser)
         await props.getUserProfileById(authuser.uid);
         setLoader(loading);
        }
        fetchdata();
    },[authuser.uid]);


    useEffect(() => {

        reset({
            facebook_link: userDetailsById?.social_links?.facebook,
            instagram_link: userDetailsById?.social_links?.instagram,
            tiktok_link: userDetailsById?.social_links?.tiktok,
            twitter_link: userDetailsById?.social_links?.twitter,
            youtube_link: userDetailsById?.social_links?.youtube,
        });

    }, [userDetailsById, reset]);

    const validateURL = (link) => {
        if(link){
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');    
        return regex.test(link);
        }
        else{
            return true;
        }
       
    };
   
    const onSubmit = async (event) => {

        const data = {
            update_type: 'social_links',
            facebook: event.facebook_link,
            instagram: event.instagram_link,
            tiktok: event.tiktok_link,
            twitter: event.twitter_link,
            youtube: event.youtube_link,
        };
        await props.updateUserProfile(data, props.history);

    };

    return (

        <div className="tab-inner-content social-medias">
            {isLoader ? <Loader isLoader={true} /> : null} 
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row1">
                    <label>Instagram</label>
                    <input name="instagram_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Instagram.com/Username)" 
                    {...register("instagram_link", {
                        validate: validateURL,
                    })}/>
                    {errors?.instagram_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>Facebook</label>
                    <input name="facebook_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Facebook.com/Username)"
                    {...register("facebook_link", {
                       validate: validateURL,
                    })}/>
                    {errors?.facebook_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>Twitter</label>
                    <input name="twitter_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Twitter.com/Username)"
                    {...register("twitter_link", {
                        validate: validateURL,
                    })}/>
                    {errors?.twitter_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>Youtube</label>
                    <input name="youtube_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Youtube.com/Channelname"
                    {...register("youtube_link", {
                        validate: validateURL,
                    })}/>
                    {errors?.youtube_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>TikTok</label>
                    <input name="tiktok_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.TikTok.com/Username"
                    {...register("tiktok_link", {
                       validate: validateURL,
                    })}/>
                    {errors?.tiktok_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>
                <div class="tab-inner-content1">
                    <div className="login-via">
                        <Button  type="submit" className="log-btn btn">
                        Update
                        </Button>
                    </div> 
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        loading : state.authReducer.loading
    }
}

const actionCreators = { getUserProfileById, updateUserProfile,fetchUser };
export default connect(mapStateToProps, actionCreators)(SocialLinksSetting);


