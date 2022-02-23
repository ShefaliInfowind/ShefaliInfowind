import React from "react";
import { useForm } from 'react-hook-form';
import logo_img from '../../../assets/images/Logo.svg';
import rd_img from '../../../assets/images/rd.png';
import black_menu_icon from '../../../assets/images/black-menu-icon.png';
// Redux
import { connect } from "react-redux";
import { Button } from '@material-ui/core'
import { forgotPassword } from "../../../Redux/actions/auth-actions";
import { Link } from "react-router-dom";

const ForgotPassword = (props,{ history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (event) => {
    await props.forgotPassword(event.email,props.history); 
  };

  return (
    <div className='main-page-wrapper'>       

        <div className='middleSection-login-page forgot_password_page'>
          <div className="square-menu-mobile">
            <img src={black_menu_icon} alt='' />
          </div>
          <div className='middleSection-login-form'>
            <div className="sign-form-cont">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="login-section">
                <div className="logo">
                    <Link to="/"><img src={logo_img} alt='' /></Link>
                    </div>  

                    <div className="legal-content"> 
                        <h3>PASSWORD RECOVERY</h3>
                        <p>Enter your email to recover your password</p>
                    </div>

                    <div className="login-form">                       
                        <div className="form-row1 recover-pass">
                            <label>email</label>
                            <input type="email" name="email" className="form-control log-inp" placeholder="example@gmail.com"  {...register("email", {
                            required: true,
                            pattern:
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            })} />
                            {!errors?.email && (
                          <div className="rd-img"><img src={rd_img} alt='' /></div>)}
                        </div> 
                        {errors?.email?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                        )}
                        {errors?.email?.type === "pattern" && (
                          <p className="errMsg">Email should be valid</p>
                        )}
                    </div>

                    <div className="login-via">                        
                        <Button   type="submit" className="log-btn send-email btn">SEND EMAIL</Button>
                        <div class="forgot-pass"> <a href="/">Back to Login</a></div>
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>

    </div>
  );
};

// Redux connect
const mapStateToProps = (state) => {
  return {
    authuser: state.authReducer.authuser,
  }
}
const actionCreators = {
  forgotPassword: forgotPassword,
};

export default connect(mapStateToProps, actionCreators)(ForgotPassword);
