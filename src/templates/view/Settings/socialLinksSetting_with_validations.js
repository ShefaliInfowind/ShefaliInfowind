import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

//Redux

import { useSelector, connect } from "react-redux";
import { getUserProfileById, updateUserProfile } from "../../../Redux/actions/auth-actions";

function SocialLinksSetting(props, { history }) {
    const { userDetailsById } = useSelector((state) => state.authReducer);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    useEffect(() => {
        props.getUserProfileById();

    }, []);


    useEffect(() => {

        reset({
            facebook: userDetailsById?.social_links?.facebook,
            instagram: userDetailsById?.social_links?.instagram,
            tiktok: userDetailsById?.social_links?.tiktok,
            twitter: userDetailsById?.social_links?.twitter,
            youtube: userDetailsById?.social_links?.youtube,
        });

    }, [userDetailsById, reset]);

    const validateURL = (link) => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');    
        return regex.test(link);
       
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row1">
                    <label>Instagram</label>
                    <input name="instagram_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Instagram.com/Username)" 
                    {...register("instagram_link", {
                        validate: validateURL,
                    })}/>
                    {errors?.instagram_link?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    {errors?.instagram_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>Facebook</label>
                    <input name="facebook_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Facebook.com/Username)"
                    {...register("facebook_link", {
                        required: true,
                        validate: validateURL,
                    })}/>
                    {errors?.facebook_link?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    {errors?.facebook_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>Twitter</label>
                    <input name="twitter_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Twitter.com/Username)"
                    {...register("twitter_link", {
                        required: true,
                        validate: validateURL,
                    })}/>
                    {errors?.twitter_link?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    {errors?.twitter_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>Youtube</label>
                    <input name="youtube_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.Youtube.com/Channelname"
                    {...register("youtube_link", {
                        required: true,
                        validate: validateURL,
                    })}/>
                    {errors?.youtube_link?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    {errors?.youtube_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>

                <div className="form-row1">
                    <label>TikTok</label>
                    <input name="tiktok_link" type="text" className="form-control log-inp" placeholder="PROFILE URL (http://www.TikTok.com/Username"
                    {...register("tiktok_link", {
                        required: true,
                        validate: validateURL,
                    })}/>
                    {errors?.tiktok_link?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    {errors?.tiktok_link?.type === "validate" && (
                        <p className="errMsg">Invalid url</p>
                    )}
                </div>
                <div className="login-via">
                    <Button  type="submit" className="log-btn btn">
                    Update
                    </Button>
                </div> 
            </form>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,

    }
}

const actionCreators = { getUserProfileById, updateUserProfile };
export default connect(mapStateToProps, actionCreators)(SocialLinksSetting);


