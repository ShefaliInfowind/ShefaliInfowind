import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core'

//Redux
import { useSelector, connect } from "react-redux"; 
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import {addNewsLetter} from "../../../Redux/actions/subscriber-actions";
import HomeAbout from './homeAbout';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import HomeAudio from './homeAudio';
import HomeVideoImage from './homeVideoAndImage';

function HomePage(props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        mode: "onChange",
    });
   
    const { userDetailsById,authuser} = useSelector((state) => state.authReducer);
    const [profileId,setProfileId] = useState();
 
    useEffect(() => {
        async function fetchdata(){
            if(props.userProfileId)
            {
                const profileid  = Buffer.from(props.userProfileId, 'base64').toString('ascii');
                setProfileId(profileid);
                await props.getUserProfileById(profileid);
            }
            else{
                await props.getUserProfileById(authuser.uid);
            }
        }
        fetchdata();
        
    },[authuser.uid]);
    
    const onSubmit = async (event) => {
       
        const data = {
          subscribe_to: profileId,
          email: event.email,
          subscribe_by: authuser.uid,
        };
         await props.addNewsLetter(data);
    };

    const linkarr = userDetailsById?.links;
    var contentValues ='';
    if(linkarr){

        contentValues = Object.values(linkarr);
    }

    const handleLinks = (event) => {
        if(event){
           
            if (event.indexOf("http://") === 0 || event.indexOf("https://") === 0) {
                
                window.open(event);
            }
            else{
                window.open('//'+event);
            }
        }
    };

    return (
        <>
            
            { props?.userProfileId &&
            (
             <form onSubmit={handleSubmit(onSubmit)}>
                <div className='submt-frm'>
               
                    <div className='frm-input'>
                        <input name="email" type='text' placeholder="Dont forget to leave your email to keep up with me!"
                        {...register('email', {
                            required: true,
                            pattern:
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, })} />
                        {errors?.email?.type === "required" && (
                            <p className="errMsg">This field is required</p>
                        )}
                        {errors?.email?.type === "pattern" && (
                            <p className="errMsg">Email should be valid</p>
                        )}
                    </div>
                    <div className='frm-btn'>
                        <Button  type="submit" className='btn'>
                        SUBMIT
                        </Button>
                    </div>
                </div>
            </form>
            )}
            <div className='top-tb-btn'>
                {  contentValues &&
                    <ul>
                        {
                            contentValues && contentValues.map((val) => 
                            val?.title ?
                                <li><span className='btn' onClick={() => handleLinks(val.url)}>{val.title}</span></li> :
                            ''
                            )
                        }
                    </ul>
                }
            </div>
        </>
    );
}


const mapStateToProps = (state) => {
    return {
        userDetailsById: state.authReducer.userDetailsById,
        authuser: state.authReducer.authuser,
    }
}

const actionCreators = { getUserProfileById,fetchUser,addNewsLetter };
export default connect(mapStateToProps, actionCreators)(HomePage);
