import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Accordion } from 'react-bootstrap'
import ac_arrow_img from '../../../assets/images/ac-arrow.svg';
import headphone_img from '../../../assets/images/headphone.png';
import { Button } from '@material-ui/core'
//Redux

import { useSelector, connect } from "react-redux";
import { updateUserProfile, getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import { ERROR } from './../../../utils/errors';
import 'antd/dist/antd.css'
import Loader from './../../../utils/Loader';

function LinkSetting(props, { history }) {
  const [linkError_0, SetLinkError_0] = useState('');
  const [linkError_1, SetLinkError_1] = useState('');
  const [linkError_2, SetLinkError_2] = useState('');
  const [linkError_3, SetLinkError_3] = useState('');
  const [alllinkError, SetAllLinkError] = useState('');
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

  useEffect(() => {
    reset({
      title_0: userDetailsById.links?.link_0?.title,
      title_1: userDetailsById.links?.link_1?.title,
      title_2: userDetailsById.links?.link_2?.title,
      title_3: userDetailsById.links?.link_3?.title,
      link_0: userDetailsById.links?.link_0?.url,
      link_1: userDetailsById.links?.link_1?.url,
      link_2: userDetailsById.links?.link_2?.url,
      link_3: userDetailsById.links?.link_3?.url,
      listen_now_link: userDetailsById.listen_now_link,
    });

  }, [userDetailsById, reset]);

 
  const validateListenLink = (link) => {
    if (link) {
      const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
      return regex.test(link);
    }
    else {
      return true;
    }
  };

  const validateMultiTitle = (title) => {
    if (title) {
      return true;
    }
  };

  const validateMultiLink = (link) => {
    if (link) {
      const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
      return regex.test(link);
    }
  };

  const onSubmit = async (event) => {

    // validation
    var flag = 'true';
    if (event.link_0 || event.title_0) {
      if (event.link_0 && event.title_0) {
        SetLinkError_0('');
        flag = true;
      } else {
        SetLinkError_0('Link and title both should be required.');
        flag = false;
      }
    }
    if (event.link_1 || event.title_1) {
      if (event.link_1 && event.title_1) {
        SetLinkError_1('');
        flag = true;
      } else {
        SetLinkError_1('Link and title both should be required.');
        flag = false;
      }
    }
    if (event.link_2 || event.title_2) {
      if (event.link_2 && event.title_2) {
        SetLinkError_2('');
        flag = true;
      } else {
        SetLinkError_2('Link and title both should be required.');
        flag = false;
      }
    }
    if (event.link_3 || event.title_3) {
      if (event.link_3 && event.title_3) {
        SetLinkError_3('');
        flag = true;
      } else {
        SetLinkError_3('Link and title both should be required.');
        flag = false;
      }
    }
    console.log('event.title_0',event.title_0);
    console.log('event.link_0',event.link_0);
    console.log('event.title_1',event.title_1);
    console.log('event.link_1',event.link_1);
    console.log('event.title_2',event.title_2);
    console.log('event.link_2',event.link_2);
    console.log('event.title_3',event.title_3);
    console.log('event.link_3',event.link_3);
    if((event.title_0 !== "" && event.link_0 !== "") || (event.title_1 !== "" && event.link_1 !== "" ) ||
     (event.title_2 !== "" && event.link_2 !== "" ) || (event.title_3 !== "" && event.link_3 !== "" ))
    {
      SetAllLinkError('');
      flag = true;
    }else{
      if(event.title_0 === "" && event.link_0 === "" && event.title_1 === "" && event.link_1 === "" &&
      event.title_2 === "" && event.link_2 === "" && event.title_3 === "" && event.link_3 === "" && event.listen_now_link !== "")
      {
        SetAllLinkError('');
        flag = true;
      }else{
        SetAllLinkError('Fill at least one field');
        flag = false;
      }
    }

    if (flag === true) {

      var links = {};
      if (event.title_0 !== "" && event.link_0 !== "") {
        links['link_0'] = {

          title: event.title_0,
          url: event.link_0
        }
      }
      if (event.title_1 !== "" && event.link_1 !== "") {
        links['link_1'] = {

          title: event.title_1,
          url: event.link_1
        }
      }
      if (event.title_2 !== "" && event.link_2 !== "") {
        links['link_2'] = {

          title: event.title_2,
          url: event.link_2
        }
      }
      if (event.title_3 !== "" && event.link_3 !== "") {
        links['link_3'] = {

          title: event.title_3,
          url: event.link_3,
        }
      }
     
      const data = {
        listen_links: event.listen_now_link,
        update_type: 'links',
        links,
      }
      await props.updateUserProfile(data);
    }
  };

  return (
   
    <form onSubmit={handleSubmit(onSubmit)}>
      {isLoader ? <Loader isLoader={true} /> : null} 
      <Accordion.Header>LISTEN NOW + LINKS <img src={ac_arrow_img} alt='' /></Accordion.Header>
      <Accordion.Body>
        <div className="tab-inner-content">
          <div className="form-row1">
            <label>Listen Now LINK <img src={headphone_img} alt='' /></label>
            <input name="listen_now_link" type="text" className="form-control log-inp" placeholder="Preffered link to music platform URL (www.yourlink.com)"  {...register("listen_now_link", {
              validate: validateListenLink,
            })} />
            {errors?.listen_now_link?.type === "validate" && (
              <p className="errMsg">Invalid url</p>
            )}
          </div>

          <div className="form-row1 inp2">
            <label>LINK 1</label>

            <input name="title_0" type="text" className="form-control log-inp" placeholder="Link Title" {...register("title_0", {
              validate: validateMultiTitle,

            })} />

            <input name="link_0" type="text" className="form-control log-inp" placeholder="Link URL (http://www.yourlink.com)"  {...register("link_0", {
              validate: validateMultiLink,

            })} />
            {errors?.link_0?.type === "validate" && (
              <p className="errMsg">Link should be valid</p>
            )}
            {linkError_0 ?
              <p className="errMsg">{linkError_0}</p> : ''
            }
          
          </div>

          <div className="form-row1 inp2">
            <label>LINK 2</label>
            <input name="title_1" type="text" className="form-control log-inp" placeholder="Link Title" {...register("title_1", {
              validate: validateMultiTitle,

            })} />

            <input name="link_1" type="text" className="form-control log-inp" placeholder="Link URL (http://www.yourlink.com)" {...register("link_1", {
              validate: validateMultiLink,

            })} />
            {errors?.link_1?.type === "validate" && (
              <p className="errMsg">Link should be valid</p>
            )}
            {linkError_1 ?
              <p className="errMsg">{linkError_1}</p> : ''
            }
           
          </div>

          <div className="form-row1 inp2">
            <label>LINK 3</label>
            <input name="title_2" type="text" className="form-control log-inp" placeholder="Link Title" {...register("title_2", {
              validate: validateMultiTitle,

            })} />

            <input name="link_2" type="text" className="form-control log-inp" placeholder="Link URL (http://www.yourlink.com)" {...register("link_2", {
              validate: validateMultiLink,

            })} />
            {errors?.link_2?.type === "validate" && (
              <p className="errMsg">Link should be valid</p>
            )}
            {linkError_2 ?
              <p className="errMsg">{linkError_2}</p> : ''
            }
           
          </div>

          <div className="form-row1 inp2">
            <label>LINK 4</label>
            <input name="title_3" type="text" className="form-control log-inp" placeholder="Link Title" {...register("title_3", {
              validate: validateMultiTitle,

            })} />

            <input name="link_3" type="text" className="form-control log-inp" placeholder="Link URL (http://www.yourlink.com)" {...register("link_3", {
              validate: validateMultiLink,

            })} />
            {errors?.link_3?.type === "validate" && (
              <p className="errMsg">Link should be valid</p>
            )}
            {linkError_3 ?
              <p className="errMsg">{linkError_3}</p> : ''
            }
           
          </div>
          {alllinkError ?
              <p className="errMsg">{alllinkError}</p> : ''
          }
        </div>
        <div class="tab-inner-content1">
          <div className="login-via">
            <Button  type="submit" className="log-btn btn">
              Update
            </Button>
          </div> 
        </div>
      </Accordion.Body>
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

const actionCreators = { getUserProfileById, updateUserProfile,fetchUser };
export default connect(mapStateToProps, actionCreators)(LinkSetting);


