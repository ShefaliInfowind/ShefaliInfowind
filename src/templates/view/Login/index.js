import React,{useEffect} from "react";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core'
//image
import logo_img from '../../../assets/images/Logo.svg';
import google_icon from '../../../assets/images/flat-color-icons_google.svg';
import apple_icon from '../../../assets/images/n-apple-logo.svg';
import facebook_icon from '../../../assets/images/logos_facebook.svg';
import black_menu_icon from '../../../assets/images/black-menu-icon.png';
// Redux
import { useSelector, connect } from "react-redux";
import { login, socialLogin } from "../../../Redux/actions/auth-actions";


const LogIn = (props, { history }) => {

  const { profile_url} = useSelector((state) => state.authReducer);
  const { authuser } = useSelector((state) => state.authReducer);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
   
  const onSubmit = async (event) => {
    await props.login(event.email, event.password, props.history,profile_url);
  };

  const onSocialLogin = async (event) => {

    await props.socialLogin(event, props.history,profile_url);
  }

  const createAccount = () => {
    props.history.push('/signup');
  }

  return (

    <div className='main-page-wrapper'>

        <div className='middleSection-login-page login_site_page'>
          <div className="square-menu-mobile">
            <img src={black_menu_icon} alt='' />
          </div>
          <div className='middleSection-login-form'>
            <div className="sign-form-cont">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="login-section">
                  <div className="logo">
                    <img src={logo_img} alt='' />
                  </div>
                  <div className="login-form">
                    <h2>Login to continue</h2>
                    <div className="form-row1">
                      <label>email</label>
                      <input type="email" name="email" className="form-control log-inp" {...register("email", {
                        required: true,
                        pattern:
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      })} />
                      {errors?.email?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                      )}
                      {errors?.email?.type === "pattern" && (
                        <p className="errMsg">Email should be valid</p>
                      )}
                    </div>
                    <div className="form-row1">
                      <label>Password</label>
                      <input type="password" name="password" className="form-control log-inp" {...register("password", {
                        required: true,
                      })} />
                      {errors?.password?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="login-via">
                    <h2>Or Login Via</h2>
                    <ul>
                      <li onClick={e => onSocialLogin('google')}><img src={google_icon} alt='' /></li>
                      <li><img src={apple_icon} alt='' /></li>
                      {/* <li><img src={facebook_icon} alt='' /></li> */}
                      <li onClick={e => onSocialLogin('facebook')}><img src={facebook_icon} alt='' /></li> 
                    </ul>
                    <Button  type="submit" className="log-btn logBtn btn">LOGIN</Button>
                    <div className="forgot-pass"> <Link to="/forgot_password">Forgot password?</Link></div>
                    <Button  type="button" onClick={e => createAccount()} className="log-btn create-acc btn">Create an account</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

    </div>
  );
};

const mapState = (state) => ({

  authuser: state.authReducer.authuser,
  loggedIn: state.authReducer.loggedIn,
});
const actionCreators = { login, socialLogin };
export default connect(mapState, actionCreators)(LogIn);

