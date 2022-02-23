import React from 'react';
import ConversationView from './ConversationView';
import UserProfile from '../../components/userProfile';
import Footer from '../footer';
import Navbar from '../Navbar';
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import add_content from '../../../assets/images/plus-mobile.svg';
import { Link } from "react-router-dom";

function Inbox(props) {

    
    return (
        <div className='main-page-wrapper'>
        <Navbar />

        <div className='middleMainSection chat-page-main'>
            <div className="mob-secion add-content-header"> 
                <div className="mobile-top-logo">
                    <div className="left-square"><img src={square_img} alt='' /></div>
                    <div className="mobile-center-logo"><img src={mobile_logo} alt='' /></div>
                    <div className="mobile-add-content"> <Link to="/addContent"><img src={add_content} alt='' /></Link></div>
                </div>
            </div> 
                <div className='middleSection-add-content'>
                    <div className="addContentSec chat-page">
                        <UserProfile/>
                        <div className="choose-content">
                            <ConversationView/>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Inbox;
