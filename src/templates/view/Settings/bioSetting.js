import React, {useState,useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core'

//Redux

import {  useSelector,connect } from "react-redux";
import { updateUserProfile,getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import Loader from './../../../utils/Loader';

function BioSetting(props, { history }) {

  const { userDetailsById,authuser,loading } = useSelector((state) => state.authReducer);
  const [isLoader, setLoader] = useState(false);

  useEffect(() => {
    async function fetchdata(){
    if(authuser)
     await props.getUserProfileById(authuser.uid);
      setLoader(loading);
    }
    fetchdata();
},[authuser.uid]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect( () => {

    if(userDetailsById.bio){
     var biores = userDetailsById.bio.replace(/\\n/g, "\n");
    }
    reset({

      bio: biores,
      });
   
},[userDetailsById,reset]);

  const onSubmit = async (event) => {
    const data = {
      update_type: 'bio',
      bio: event.bio,
    };
    await props.updateUserProfile(data);
  };

  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
      {isLoader ? <Loader isLoader={true} /> : null} 
     
      <div className="tab-inner-content1">
        <div className="form-row1 inp2">
          <textarea name="bio" className="form-control log-inp"  placeholder={userDetailsById.bio === "" ? "Enter your Bio here" : "" } {...register('bio', {required: true, })} ></textarea>
          {errors?.bio?.type === "required" && (
            <p className="errMsg">This field is required</p>
          )}
        </div>

        <div className="login-via">
            <Button  type="submit" className="log-btn btn">
            Update BIO
            </Button>
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

const actionCreators = { getUserProfileById,updateUserProfile,fetchUser };
export default connect(mapStateToProps, actionCreators)(BioSetting);


