import React,{useState,useEffect} from 'react'
import Navbar from '../Navbar';
import Footer from '../footer';
import HomePage from '../Home/homePage';
import HomeProfile from '../Home/homeProfile';
import HomeAbout from '../Home/homeAbout';
import HomeAudio from '../Home/homeAudio';
import { useSelector } from "react-redux"; 
import SubscriptionDetails from './SubscriptionDetails';
import { useParams } from "react-router-dom";
import { RedirectModal } from '../../../utils/errors';

function Subscription(props) {
    const { userDetailsById} = useSelector((state) => state.authReducer);
    const [Subsc_UserId,setSubsc_UserId] = useState('');
    const params = useParams();
    const [modalStatus,setmodalStatus] = useState(false);

    useEffect(() => {

        if(params.subscibe_user_id)
        {
            setSubsc_UserId(params.subscibe_user_id) 
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
                            <HomeProfile props={props} userProfileId={Subsc_UserId}/>
                        </div>
                    </div>
                    <div className='right-top-box hide-mobile'>
                        <div className="ab-desc">
                            <HomeAbout userProfileId={Subsc_UserId}/>
                        </div>
                    </div>
                    <div className="about-sec-mobile">
                        <div className="ab-desc">
                            <HomeAbout viewType={'mobile_view'} userProfileId={Subsc_UserId}/>
                        </div>
                    </div>
                </div>

                <div className='middleMainSec'>
                    <div className='middleSection'>
                        <div className='middleSectionInn'>
                            {/* <HomePage userProfileId={Subsc_UserId}/> */}
                            <SubscriptionDetails Subsc_UserId={Subsc_UserId} />
                        </div>
                    </div>
                    <div className='rightSection hide-mobile'>
                        <HomeAudio userProfileId={params.subscibe_user_id}/>
                    </div>
                </div>

                <Footer userProfileId={Subsc_UserId}/>
            </div>
            )}
            
        </div>
    )
}

export default Subscription;

