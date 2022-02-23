import React, { useState,useEffect } from 'react'
import down_arrow from '../../../assets/images/d-arrow.png';

//Redux
import { useSelector, connect } from "react-redux";
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";

function HomeAbout(props,{history}) {

    const { userDetailsById,authuser } = useSelector((state) => state.authReducer);
    const [aboutToggle,setAboutToggle] = useState(props?.viewType ? 'false' : 'true');
    const [bioval, setBioval] = useState('');
    useEffect(() => {
        
        async function fetchdata(){
            if(props.userProfileId)
            {
                const profileid  = Buffer.from(props.userProfileId, 'base64').toString('ascii')
                await props.getUserProfileById(profileid);
            }
            else{
                await props.getUserProfileById(authuser.uid);
            }
        }
        fetchdata();
    },[authuser.uid,bioval]);

    useEffect( () => {

        if(userDetailsById.bio){
         var biores = userDetailsById.bio.replace(/\\n/g, "\n");
        }
        setBioval(biores);
       
    },[userDetailsById]);
    const handleAboutToggle = () => {
        if(props?.viewType){
            if(aboutToggle === 'false'){
                setAboutToggle('true');
            }else{
                setAboutToggle('false');
            }  
        }
    };
   
   
  console.log("props.viewType",props.viewType);
    return (
            <>
                <h2 className={`ab-head ${aboutToggle === 'true' ? 'about-toggle-active' : ''}`} onClick={() => handleAboutToggle()}>ABOUT <b>{userDetailsById?.username}</b>
                <img src={down_arrow} alt='' /></h2>
                {aboutToggle === 'true' && (
                        <div className='placeholder-bio'>
                        {/* <textarea>{userDetailsById.bio ? userDetailsById.bio.replace(/\\n/g, "\n") : 'Please update your bio...'}</textarea> */}
                        <pre>{bioval ? bioval: <div class="placeholder-msg">Please update your bio...</div>}</pre>
                        <h4>{userDetailsById?.listen_now_link ? userDetailsById.listen_now_link : ""}</h4>
                    </div>
                )}
            </>
    );
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
    }
}

const actionCreators = { getUserProfileById,fetchUser };
export default connect(mapStateToProps, actionCreators)(HomeAbout);

