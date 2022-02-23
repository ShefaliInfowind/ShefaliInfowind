import React, { useState, useEffect } from 'react'
import user_cover_img from '../../../assets/images/user-cover-image.png';
import user_img from '../../../assets/images/dummy_user.png';

//Redux
import { useSelector, connect } from "react-redux";
import { getUserProfileById,updateUserProfileOrCoverImage,fetchUser } from "../../../Redux/actions/auth-actions";
import { ERROR } from './../../../utils/errors';
import 'antd/dist/antd.css'

function ImageSetting(props,{history}) {
    
    const [currentTab, setCurrentTab ] = useState('');
    const [UserViewImage, setUserViewImage] = useState(null);
    const [UserCoverViewImage, setCoverViewImage] = useState(null);
    const { userDetailsById,authuser,imagePath } = useSelector((state) => state.authReducer);

   
    useEffect(() => { 
        if(props.activeTab)
        {
            setCurrentTab(props.activeTab);
        }

        console.log('typeeeeeeeeeee',imagePath.type);
        if(imagePath !== ''){
            if(imagePath.type === "user image"){
                setUserViewImage(imagePath.name) 
            }
            if(imagePath.type === "cover image"){
                setCoverViewImage(imagePath.name) 
            }
        }
    },[imagePath,UserViewImage,props.activeTab]);
    
    useEffect(() => {
     
        async function fetchdata(){
            if(authuser)
                await props.getUserProfileById(authuser.uid);
            }
            fetchdata();
    },[authuser,imagePath,currentTab]);

  
    const UserImageChange =  async (e) => {
       
        const imageFile = e.target.files[0];
      
        if (imageFile) {
            let fileExtension = imageFile.name.split('.').pop();
            let allowFiles = ['png', 'jpg', 'jpeg'];
            if(allowFiles.includes(fileExtension)){
                setUserViewImage(URL.createObjectURL(e.target.files[0]));
                const data = {
                    image: imageFile,
                    type: "user image",
                    name: URL.createObjectURL(e.target.files[0]),
                };
                await props.updateUserProfileOrCoverImage(data,props.pagehistory);
            }else {
                ERROR("Please select only PNG, JPG & JPEG file");
            }
        }
    }

    const CoverImageChange = async (e) => {
      
        const imageFile = e.target.files[0];
        if (imageFile) {
            let fileExtension = imageFile.name.split('.').pop();
            let allowFiles = ['png', 'jpg', 'jpeg'];
            if(allowFiles.includes(fileExtension)){
                setCoverViewImage(URL.createObjectURL(e.target.files[0])); 
                const data = {
                    image: imageFile,
                    type: "cover image",
                    name: URL.createObjectURL(e.target.files[0]),
                };

                 await props.updateUserProfileOrCoverImage(data,props.pagehistory);
            }
            else {
                ERROR("Please select only PNG, JPG & JPEG file");
            }
        }
    }
    
    return (
      
        <div className="profile-cover-photos">
             
            <div className="row">
                <div className="col-6">
                    <div className="user-img">
                        <img src={UserViewImage ? UserViewImage : userDetailsById.avatarURL ? userDetailsById.avatarURL :user_img} alt='' />
                    </div>
                    <div className="change-photo">                       
                        <div className="change-photo-inner">
                            <label for="file">change-photo</label>
                            <input className="foo" name="user_image" type="file" id="file" onChange={UserImageChange} />
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="cover-img">
                        <img src={UserCoverViewImage ? UserCoverViewImage : userDetailsById.coverURL ? userDetailsById.coverURL  : user_cover_img} alt='' />
                    </div>
                    <div className="change-photo">
                        <div className="change-photo-inner">
                            <label for="cover_file">Change COVER</label> 
                            <input className="coverimg" name="user_cover_image" type="file" id="cover_file" onChange={CoverImageChange} />
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
        imagePath: state.authReducer.imagePath,
        authuser: state.authReducer.authuser,
    }
}

const actionCreators = { getUserProfileById, updateUserProfileOrCoverImage,fetchUser };
export default connect(mapStateToProps, actionCreators)(ImageSetting);

