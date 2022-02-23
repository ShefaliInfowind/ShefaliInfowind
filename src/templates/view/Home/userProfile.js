import React,{useState,useEffect} from 'react'
import Navbar from '../Navbar';
import Footer from '../footer';
import HomePage from './homePage';
import HomeProfile from './homeProfile';
import HomeAbout from './homeAbout';
import { useParams } from "react-router-dom";
import HomeAudio from './homeAudio';
import HomeVideoImage from './homeVideoAndImage';
import { useDispatch } from "react-redux";
import {PROFILE_URL} from '../../../Redux/actions/type';
import { useSelector } from "react-redux"; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; 
import { RedirectModal } from '../../../utils/errors';

function UserProfile(props) {

    const { userDetailsById} = useSelector((state) => state.authReducer);
    const [userid,setuserId] = useState('');
    const [modalStatus,setmodalStatus] = useState(false);
    const params = useParams();
    const dispatch = useDispatch();
   
   
    useEffect(() => {
        console.log('greateeeee');
        if(params.user_id)
        {
            setuserId(params.user_id) 
            dispatch({ type: PROFILE_URL, data: '' });
        }

    },[]);

    useEffect(() => {
       
        if(modalStatus === false){
            
            if(userDetailsById?.user_active === false )
            {   
                setmodalStatus(true);
                RedirectModal('The user account has been disabled by an administrator.');
            }
        }
        
    },[userDetailsById]);
    
  
    return (
        
        <div className='main-page-wrapper'>
             <Navbar />
            {userDetailsById?.user_active === true &&
            (
           
            <div className='middleMainSection'>

                <div className='topHomeProfile'>
                    <div className='middleSection'>
                        <div className='middleSectionInn'>
                            <HomeProfile props={props} userProfileId={userid}/>
                        </div>
                    </div>
                    <div className='right-top-box hide-mobile'>
                        <div className="ab-desc">
                            <HomeAbout userProfileId={userid} />
                        </div>
                    </div>
                    <div className="about-sec-mobile">
                        <div className="ab-desc">
                            <HomeAbout userProfileId={userid} viewType={'mobile_view'} />
                        </div>
                    </div>
                </div>

                <div className='middleMainSec'>
                    <div className='middleSection hide-mobile'>
                        <div className='middleSectionInn'>
                            <HomePage userProfileId={userid} />
                            <HomeVideoImage userProfileId={userid}/>
                        </div>
                    </div>
                    <div className='rightSection hide-mobile'>
                        <HomeAudio userProfileId={userid}/>
                    </div>

                    <div className='vd-img-section'>
                        <Tabs>
                            <TabList>
                                <Tab>Content</Tab>
                                <Tab>Music</Tab>
                            </TabList>

                            <TabPanel>
                                <HomePage userProfileId={userid} />
                                <HomeVideoImage userProfileId={userid}/>
                            </TabPanel>
                            
                            <TabPanel>
                                <HomeAudio userProfileId={userid}/>
                            </TabPanel>
                        </Tabs> 
                    </div>

                </div>
                
                <Footer userProfileId={userid}/>
            </div>
            )
        }
        </div>
    )
}

export default UserProfile;