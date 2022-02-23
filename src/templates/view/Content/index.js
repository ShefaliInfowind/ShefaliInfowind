import React from 'react'
import Navbar from '../Navbar';
import { Link } from "react-router-dom";
import UserProfile from '../../components/userProfile';
import square_img from '../../../assets/images/Union.svg';
import mobile_logo from '../../../assets/images/logo.png';
import add_content from '../../../assets/images/plus-mobile.svg';
import Footer from '../footer';

function AddContent(props,{history}) {

    return (
        <div className='main-page-wrapper'>
            <Navbar />

            <div className='middleMainSection'>
                <div className="mob-secion  add-content-header"> 
                    <div className="mobile-top-logo">
                        <div className="left-square"><img src={square_img} alt='' /></div>
                        <div className="mobile-center-logo"><img src={mobile_logo} alt='' /></div>
                        <div className="mobile-add-content"> <Link to="/addContent"><img src={add_content} alt='' /></Link></div>
                    </div>
                </div> 
                <div className='middleSection-add-content'>
                    <div className="addContentSec">
                        <UserProfile/>

                        <div className="choose-content">
                            <h2>Choose the type of content you <br /> want to add to your feed</h2>
                            <ul className="choose-content-tab"> 
                                <li>
                                    <Link to="/addVideo">
                                        <span><img src={require('../../../assets/images/playSmall.svg').default} alt='' /></span>
                                        <span>Video</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/addImage">
                                        <span><img src={require('../../../assets/images/sam-img.svg').default} alt='' /></span>
                                        <span>Image</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/addAudio">
                                        <span><img src={require('../../../assets/images/Vector-aud.svg').default} alt='' /></span>
                                        <span>Audio</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                <Footer />

            </div>
        </div>
    )
}

export default AddContent;

