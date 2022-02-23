import React,{useEffect} from 'react'
import { useSelector,connect } from "react-redux";
import { getUserProfileById,fetchUser } from "../../Redux/actions/auth-actions";
import user_img from '../../assets/images/dummy_user.png';

function UserProfile(props) {

    const { userDetailsById,authuser } = useSelector((state) => state.authReducer);

    useEffect( () => {
        if(authuser)
            props.getUserProfileById(authuser.uid);
    }, []);

    
    return (
        <div className="user-section-top">
            <div className="user-img">
                <img src={userDetailsById?.avatarURL !== '' ? userDetailsById?.avatarURL : user_img} alt='' />
            </div>
            <div className="gist-name">{userDetailsById?.username}</div>
        </div>
                        
    )
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
    }
  }
  const actionCreators = {
    getUserProfileById: getUserProfileById,
    fetchUser:fetchUser,
  };
  
export default connect(mapStateToProps, actionCreators)(UserProfile);

