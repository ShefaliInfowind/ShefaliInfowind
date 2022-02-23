import React, {useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core'

//Redux

import { useSelector, connect } from "react-redux";
import { getUserProfileById, changePassword,fetchUser } from "../../../Redux/actions/auth-actions";
import Loader from './../../../utils/Loader';
import eye_img from '../../../assets/images/eye.png';
import eye_slash_img from '../../../assets/images/eyeslash.png';

function AccountSetting(props, { history }) {
    const { userDetailsById,authuser,loading } = useSelector((state) => state.authReducer);
    const [isLoader, setLoader] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [newpasswordShown, setNewPasswordShown] = useState(false);

    const {
        register,
        handleSubmit,
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
   
    const onSubmit = async (event) => {
       
          const data = {
           
            password: event.password,
            new_password: event.new_password,
            
    
          };
        await props.changePassword(data);
        
    };

    const togglePassword = (pass_type) => {
      if (pass_type === 'pass') {
        setPasswordShown(!passwordShown);
      }
      if (pass_type === 'new_pass') {
        setNewPasswordShown(!newpasswordShown);
      }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        {isLoader ? <Loader isLoader={true} /> : null} 
        <div className="tab-inner-content account-settings">
            <div className="form-row1">
                <label>EMAIL</label>
                <input type="text" className="form-control log-inp" disabled={true} value={userDetailsById.email}></input>
            </div>

            <div className="form-row1">
                <label>PASSWORD</label>
                <input type={passwordShown ? "text" : "password"} className="form-control log-inp"  placeholder="Password" name="password" {...register("password", {
                    required: true,
                  })} />
                   <div onClick={() => togglePassword('pass')} className="rd-img"><img src={passwordShown ? eye_img : eye_slash_img} alt='' /></div>
                  {errors?.password?.type === "required" && (
                    <p className="errMsg">This field is required</p>
                  )}
                
                {/* <FontAwesome className="pass-show-hide" name="eye"/> */}
                <div className="should-you change-pass">
                    To change your password enter your current password
                </div>
            </div>

            <div className="form-row1">
                <label>NEW PASSWORD</label>
                <input type={newpasswordShown ? "text" : "password"} className="form-control log-inp" name="new_password" placeholder="New password" {...register("new_password", {
                    required: true,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/i,
                  })} />
                   <div onClick={() => togglePassword('new_pass')} className="rd-img"><img src={newpasswordShown ? eye_img : eye_slash_img} alt='' /></div>
                  {errors?.new_password?.type === "required" && (
                    <p className="errMsg">This field is required</p>
                  )}
                  {errors?.new_password?.type === "pattern" && (
                    <p className="errMsg">Password should be strong</p>
                  )}
                {/* <FontAwesome className="pass-show-hide" name="eye"/> */}
            </div>

            <div className="cancel-logout-sec">
                <div className="login-via create-ac">
                    <Button  type="submit" className="log-btn btn">
                        Update
                    </Button>
                </div>
            </div>
        </div>
        </form>

    )
}

const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
        loading : state.authReducer.loading
    }
}
const actionCreators = { getUserProfileById, changePassword,fetchUser };
export default connect(mapStateToProps, actionCreators)(AccountSetting);


