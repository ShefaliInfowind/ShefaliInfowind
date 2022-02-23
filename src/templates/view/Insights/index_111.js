import React,{ useState,useEffect } from 'react'
import Navbar from '../Navbar';
import UserProfile from '../../components/userProfile';
import Footer from '../footer';
import user_img from '../../../assets/images/dummy_user.png';
import axios from 'axios';
import {
    InstgramData
  
  } from '../../../Redux/actions/api_url';

function Insights(props,{history}) {
    
    useEffect(() => {
        async function fetchdata(){
            const data = {
                username :'infowindtech',
            }
            const response = await axios.post(InstgramData,data);
            console.log('instagram ressssss', response);
                
            }
        fetchdata();

    },[]);

  
    return (
        <div className='main-page-wrapper'>
        <Navbar/>
        
        <div className='middleMainSection'>

            <div className='middleSection-add-content1'>
                <div className="addContentSec">
                    <UserProfile/>
                </div>
            </div>
        </div>
        </div>
                    )
    }

export default Insights;

