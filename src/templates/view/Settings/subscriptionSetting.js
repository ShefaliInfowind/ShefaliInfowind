import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core'

//Redux

import { useSelector, connect } from "react-redux";
import { getUserProfileById, userSubscription,fetchUser } from "../../../Redux/actions/auth-actions";
import Loader from './../../../utils/Loader';

function SubscriptionSetting(props, { history }) {
  const { userDetailsById,authuser,loading } = useSelector((state) => state.authReducer);
  const [isLoader, setLoader] = useState(false);

  const {
      register,
      reset,
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

    useEffect( () => {

        reset({
          subscription_info: userDetailsById?.subscription?.info,
          });
      
    },[userDetailsById,reset]);
 
    const onSubmit = async (event) => {
        
          const data = {
              info: event.subscription_info,
              price: 3.99,
            
          };
        await props.userSubscription(data);
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isLoader ? <Loader isLoader={true} /> : null} 
      <div className="tab-inner-content account-settings scubcriptions">
        <div className="form-row1">
          <label>Monthly Subscription rate</label>
          <div className="month-susj">
          <input type="text" disabled="true" className="form-control log-inp" name="price" value="$3.99 (Customize Pricing at 100 Subscribers)" />
            {/* <span>$3.99</span> (Customize Pricing at 100 Subscribers) */}
          </div>
          <div className="lma">Learn more about our fees</div>
        </div>

        <div className="form-row1">
          <label>Subscription Info</label>
          <div className="month-sus1ss">
            <textarea name="subscription_info" className="form-control log-inp text-tag" {...register('subscription_info', {
                        required: true,
                      })} >Tell your fans why they should subscribe and support you monthly! Make sure you tell them things that are important like upcoming shows, any new projects your working on and even if you want to list out your monthly expenses.
            "Make it Good! Its your pitch to your paying fans!"</textarea>
          </div>
          {errors?.subscription_info?.type === "required" && (
            <p className="errMsg">This field is required</p>
          )}
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
const actionCreators = { getUserProfileById, userSubscription,fetchUser };
export default connect(mapStateToProps, actionCreators)(SubscriptionSetting);


