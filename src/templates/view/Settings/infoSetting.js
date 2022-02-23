import React, {useState, useEffect } from 'react'
import calendar_img from '../../../assets/images/Calendar.png';
import { DateDropDown, MonthDropDown, YearDropDown } from '../../components/calendar_date';
import { useForm } from 'react-hook-form';
import * as moment from 'moment';
import { Button } from '@material-ui/core'

//Redux

import { useSelector, connect } from "react-redux";
import { getUserProfileById,updateUserProfile,fetchUser } from "../../../Redux/actions/auth-actions";
import Loader from './../../../utils/Loader';

function InfoSetting(props,{history}) {
    const { userDetailsById,authuser,loading } = useSelector((state) => state.authReducer);
    const [isLoader, setLoader] = useState(false);
    const [bday_set,setBDay] = useState('');
    const [bmonth_set,setBMonth] = useState('');
    const [byear_set,setBYear] = useState('');

    const iconRemove = {
        backgroundImage : 'none',
    }
    const iconAdd = {
        backgroundImage : '',
    }
    const {
      register,
      handleSubmit,
      getValue,
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
    
    useEffect( () => {
       
        reset({
            user_name: userDetailsById.username,
            user_type: userDetailsById.user_type,
            birth_day:  moment(userDetailsById.dob, "DD-MM-YYYY").format('D'),
            birth_month:  moment(userDetailsById.dob, "DD-MM-YYYY").format('M'),
            birth_year:  moment(userDetailsById.dob, "DD-MM-YYYY").format('YYYY'),
           
          });
         console.log('---------',userDetailsById);
    },[userDetailsById,reset]);
   
    const onSubmit = async (event) => {
       
        const birthdate = moment( event.birth_month + '/' +  event.birth_day+ '/' + event.birth_year).format('MM/DD/YYYY');
        const data = {
        update_type: 'info',
        //user_type: event.user_type,
        username: event.user_name,
        dob: new Date(birthdate).toLocaleDateString(),
        };

        await props.updateUserProfile(data, props.history);
        
    };
    const ValidateSpacesFields =  (value) => !!value.trim();
    return (
       
        <div className="tab-inner-content account-settings">
            {isLoader ? <Loader isLoader={true} /> : null} 
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row1">
                    <label>USER NAME</label>
                    <input type="text" name="user_name" className="form-control log-inp" {...register("user_name", {
                        required: true,
                        maxLength: 30,
                        validate: ValidateSpacesFields
                       
                    })}/>
                    {errors?.user_name?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    {errors?.user_full_name?.type === "maxLength" && (
                        <p className="errMsg">
                        User name cannot exceed 30 characters
                        </p>
                    )}
                    {errors?.user_name?.type === "validate" &&
                        <p className="errMsg">Space should not be allowed.</p>
                    }
                </div>

                {/* <div className="form-row1">
                    <label>USER TYPE</label>
                    <select name="user_type" className="form-control log-inp" {...register("user_type", { required: true, })}>
                        <option selected={userDetailsById.user_type === "Creator" ? 'selected': ''} value="Creator">Creator</option>
                        <option selected={userDetailsById.user_type === "Subscriber" ? 'selected' : ''} value="Subscriber">Subscriber</option>
                    </select>
                    {errors?.user_type?.type === "required" && (
                        <p className="errMsg">This field is required</p>
                    )}
                    <div className="lm">Learn more about Creators and Supporters</div>
                </div>  */}

                <div className="your-birth">
                <div className="your-bith-head">
                <img src={calendar_img} alt='' /> your birthday
                </div>

                <div className="your-birth-time">
                    <select style={bday_set !== '' ? iconRemove : userDetailsById.dob !== '' ? iconRemove : iconAdd } onClick={e => setBDay(e.target.value)}  name="birth_day" className="form-control log-inp"  {...register("birth_day", { required: true, })}>
                        <DateDropDown selectedDate={userDetailsById.dob}/>
                    </select>

                    <select style={bmonth_set !== '' ? iconRemove : userDetailsById.dob !== '' ? iconRemove : iconAdd } onClick={e => setBMonth(e.target.value)} name="birth_month" className="form-control log-inp"  {...register("birth_month", { required: true, })}>
                        <MonthDropDown selectedMonth={userDetailsById.dob}/>
                    </select>

                    <select style={byear_set !== '' ? iconRemove : userDetailsById.dob !== '' ? iconRemove : iconAdd } onClick={e => setBYear(e.target.value)} name="birth_year" className="form-control log-inp" {...register("birth_year", { required: true, validate: isAgeGreater })}>
                        <YearDropDown selectedYear={userDetailsById.dob}/>
                    </select> 
                   
                </div> 
                {(errors?.birth_day?.type === "required" || errors?.birth_year?.type === "required" || errors?.birth_month?.type === "required") && <p className="errMsg">This field is required</p>}
                {errors?.birth_year?.type === "validate" &&
                <p className="errMsg">You must be 14 years old or above.</p>
                }
               
                <div className="cancel-logout-sec">
                    <div className="login-via create-ac">
                        <Button  type="submit" className="log-btn btn">
                            Update
                        </Button>
                    </div>
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

const actionCreators = { getUserProfileById,updateUserProfile,fetchUser };
export default connect(mapStateToProps, actionCreators)(InfoSetting);


