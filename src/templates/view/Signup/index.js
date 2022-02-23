import React, { useState, useRef } from "react";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import * as moment from 'moment';
import { Button } from '@material-ui/core'
import { DateDropDown, MonthDropDown, YearDropDown } from '../../components/calendar_date';
//images
import user_img from '../../../assets/images/dummy_user.png';
import logo_img from '../../../assets/images/Logo.svg';
import arrow_left_img from '../../../assets/images/Arrow-Left.svg';
import calendar_img from '../../../assets/images/Calendar.png';
import black_menu_icon from '../../../assets/images/black-menu-icon.png';
// Redux
import { useSelector, connect } from "react-redux";
import { register as userSignup } from "../../../Redux/actions/auth-actions";
import eye_img from '../../../assets/images/eye.png';
import eye_slash_img from '../../../assets/images/eyeslash.png';
import validator from 'validator'

import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = (props, { history }) => {
  const { registers } = useSelector((state) => state.authReducer);
  const [UserImage, setUserImage] = useState(null);
  const [UserViewImage, setUserViewImage] = useState(user_img);
  const [imgError, setimgError] = useState(null);
  const [bday_set, setBDay] = useState('');
  const [bmonth_set, setBMonth] = useState('');
  const [byear_set, setBYear] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [newpasswordShown, setNewPasswordShown] = useState(false);
  // validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const iconRemove = {
    backgroundImage: 'none',
  }
  const iconAdd = {
    backgroundImage: '',
  }

  const user_password = useRef({});
  user_password.current = watch("password", "");

  const handleChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setUserImage(e.target.files[0]);
      setUserViewImage(URL.createObjectURL(e.target.files[0]));
      setimgError(null);
    }
  }

  const togglePassword = (pass_type) => {
    if (pass_type === 'pass') {
      setPasswordShown(!passwordShown);
    }
    if (pass_type === 'new_pass') {
      setNewPasswordShown(!newpasswordShown);
    }
  }


  // age validation
  const isAgeGreater = (birth_year) => {

    var age = 0;
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    age = currentYear - birth_year;
    if (age > 14) {
      return true;
    }
    else {
      return false;
    }
  }

  const emailValidation = (email) => {
    if (validator.isEmail(email)) {
      return true;
    }
    else {
      return false;
    }
  }

  const onSubmit = async (event) => {
    if (UserImage === null) {
      setimgError('Please select image.');
      return false;
    } else {

      const birthdate = moment(event.birth_month + '/' + event.birth_day + '/' + event.birth_year).format('MM/DD/YYYY');
      const data = {
        email: event.email,
        password: event.password,
      //  user_type: event.user_type,
        username: event.user_name,
        user_image: UserImage,
        dob: new Date(birthdate).toLocaleDateString(),
        privacy_policy: event.privacyPolicy === true ? 'yes' : '',
        terms_condition: event.termsAndCondition === true ? 'yes' : '',

      };
      await props.register(data, props.history);
    }
  };

  return (

    <div className='main-page-wrapper'>
      <div className='middleSection-login-page signup_site_page'>

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

                <div className="sec-head">CREATE AN ACCOUNT</div>

                <div className="user-img">
                  <img src={UserViewImage} alt='' />
                </div>

                <div className="change-photo">
                  <div className="change-photo-inner">
                  <label for="file">change-photo</label>
                  <input className="foo" name="user_image" type="file" id="file" onChange={handleChange} />
                  </div>
                  <div className="make-sure">Make sure you upload a Picture to get started!</div>
                </div>
                {imgError && (
                  <p className="errMsg">{imgError}</p>
                )}

                <div className="login-form">

                  <div className="form-row1">
                    <label>USER NAME</label>
                    <input type="text" className="form-control log-inp" name="user_name" {...register("user_name", {
                      required: true,
                      maxLength: 30,
                    })} />
                    {errors?.user_name?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                    {errors?.user_name?.type === "maxLength" && (
                      <p className="errMsg">
                        User name cannot exceed 30 characters
                      </p>
                    )}
                  </div>
                  <div className="form-row1">
                    <label>EMAIL</label>
                    <input type="email" className="form-control log-inp" name="email" {...register("email", {
                      required: true,
                      // pattern:
                      //   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      validate: emailValidation  
                    })} />
                    {errors?.email?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                    {/* {errors?.email?.type === "pattern" && (
                      <p className="errMsg">Email should be valid</p>
                    )} */}
                    {errors?.email?.type === "validate" && (
                      <p className="errMsg">Email should be valid</p>
                    )}
                  </div>

                  <div className="form-row1">
                    <label>PASSWORD</label>
                    <input type={passwordShown ? "text" : "password"} className="form-control log-inp" name="password" {...register("password", {
                      required: true,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/i,
                    })} />
                    <div onClick={() => togglePassword('pass')} className="rd-img"><img src={passwordShown ? eye_img : eye_slash_img} alt='' /></div>                  
                    {errors?.password?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                    {errors?.password?.type === "pattern" && (
                      <p className="errMsg">Password should be strong</p>
                    )}

                  </div>

                  <div className="form-row1">
                    <label>CREATE PASSWORD</label>
                    <input type={newpasswordShown ? "text" : "password"} className="form-control log-inp" name="create_password" {...register("create_password", {
                      required: true,
                      validate: (value) => value === user_password.current,
                    })} />
                    <div onClick={() => togglePassword('new_pass')} className="rd-img"><img src={newpasswordShown ? eye_img : eye_slash_img} alt='' /></div>
                    {errors?.create_password?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                    {errors?.create_password?.type === "validate" && (
                      <p className="errMsg">Create passwords do not match</p>
                    )}
                  </div>

                  {/* <div className="form-row1">
                    <label>User Type</label>
                    <select className="form-control log-inp" name="user_type"  {...register("user_type", { required: true, })}>
                      <option value="Creator">Creator</option>
                      <option value="Subscriber">Subscriber</option>
                    </select>
                    {errors?.user_type?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                    <div className="lm">Learn more about Creators and Supporters</div>
                  </div> */}
                </div>

                <div className="your-birth">
                  <div className="your-bith-head">
                    <img src={calendar_img} alt='' /> your birthday
                  </div>

                  <div className="your-birth-time">
                    <select style={bday_set !== '' ? iconRemove : iconAdd} onClick={e => setBDay(e.target.value)} name="birth_day" class="form-control log-inp"  {...register("birth_day", { required: true, })}>
                      <DateDropDown />
                    </select>

                    <select style={bmonth_set !== '' ? iconRemove : iconAdd} onClick={e => setBMonth(e.target.value)} name="birth_month" class="form-control log-inp" {...register("birth_month", { required: true, })}>
                      <MonthDropDown />
                    </select>

                    <select style={byear_set !== '' ? iconRemove : iconAdd} onClick={e => setBYear(e.target.value)} name="birth_year" class="form-control log-inp" {...register("birth_year", { required: true, validate: isAgeGreater })}>
                      <YearDropDown />
                    </select>
                  </div>

                  {(errors?.birth_day?.type === "required" || errors?.birth_year?.type === "required" || errors?.birth_month?.type === "required") && <p className="errMsg">This field is required</p>}
                  {errors?.birth_year?.type === "validate" &&
                    <p className="errMsg">You must be 14 years old or above.</p>
                  }
                </div>

                <div className="legal-content">
                  <h3>LEGAL CONSENT</h3>
                  <p>I have read and agree to the following</p>
                </div>

                <div className="legal-text">
                  <p>
                    <a>Terms and Conditions</a>
                    <label className="cus-check">
                      <input id="termsAndCondition" type="checkbox" name="termsAndCondition"
                        {...register('termsAndCondition', {
                          required: true,
                        })} />
                      <span className="checkmark"></span>
                    </label>
                    {errors?.termsAndCondition?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                  </p>

                  <p>
                  <a>Privacy Policy</a>
                    <label className="cus-check">
                      <input id="privacyPolicy" type="checkbox" name="privacyPolicy"
                        {...register('privacyPolicy', {
                          required: true,
                        })} />
                      <span className="checkmark"></span>
                    </label>
                    {errors?.privacyPolicy?.type === "required" && (
                      <p className="errMsg">This field is required</p>
                    )}
                  </p>
                </div>

                <div className="login-via create-ac">
                  <Button  type="submit" className="log-btn btn">
                    Create an account
                  </Button>
                  <div className="ald">Already have an account?  <Link to="/">Login</Link></div>
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
    register: state.authReducer.register,
  }
}
const actionCreators = {
  register: userSignup,
};

export default connect(mapStateToProps, actionCreators)(SignUp);

