import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Accordion } from 'react-bootstrap'
import ImageSetting from './imageSetting';
import HelpSetting from './helpSetting';
import InfoSetting from './infoSetting';
import AccountSetting from './accountSetting';
import SubscriptionSetting from './subscriptionSetting';
import BioSetting from './bioSetting';
import SocialLinksSetting from './socialLinksSetting';
import LinkSetting from './linkSetting';
import left_arrow_img from '../../../assets/images/Arrow-Left.svg';
import ac_arrow_img from '../../../assets/images/ac-arrow.svg';
import logo_img from '../../../assets/images/Logo.svg';
import { Link } from "react-router-dom";
import Loader from './../../../utils/Loader';
import {useHistory} from "react-router-dom";


function Settings(props,{ history }) {
    
    const history_back = useHistory();
    const [ontab, setOnTab ] = useState('ACCOUNT');
    const [isLoader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(false);
    }, [ontab]);

    function handleTab(eventKey) {
        if(eventKey.target.innerHTML !== ontab ){
            setLoader(true);
            setOnTab(eventKey.target.innerHTML);
            console.log(eventKey.target.innerHTML);
        }   
    }

    const handleBack =  (event) => {
       
        if(props.location?.prevPath){
            const path = props.location.prevPath.substring(0,props.location.prevPath.lastIndexOf("/") + 1);
            
            if(path === '/userProfile/')
            {
                window.location = window.location.origin+props.location.prevPath;
            }
            else{
                history_back.goBack();
            }
        }else{
            history_back.goBack();
        }
    };

    return (
       
        <div className='main-page-wrapper'>   
         {isLoader ? <Loader isLoader={true} /> : null} 
            <div className='middleMainSection1'>
                <div className="back-arrow">
                    <span className="btn" onClick={handleBack}><img src={left_arrow_img} alt='' />Back</span> 
                {/* <Link to="/dashboard"><img src={left_arrow_img} alt='' /> Back</Link> */}
                </div>
                <div className='middleSection1'> 
                  <div className="login-section setting-sec">
                    <div className="logo">
                        <Link to="/dashboard"><img src={logo_img} alt='' /></Link>
                    </div>
                    <div className="setting-tab">
                        
                        <div className="tabs-menu">
                            
                            <Tabs defaultActiveKey="account" id="uncontrolled-tab-example" onClick={handleTab} className="mb-3">
                           
                                <Tab eventKey="account" title="ACCOUNT">
                                   
                                 <ImageSetting pageHistory={props.history} activeTab={ontab}/>
                               
                                  <div className="info-sec">
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Your Info <img src={ac_arrow_img} alt='' /></Accordion.Header>
                                            <Accordion.Body>
                                                <InfoSetting/>
                                            </Accordion.Body> 
                                        </Accordion.Item> 

                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>Account <img src={ac_arrow_img} alt='' /></Accordion.Header>
                                            <Accordion.Body>
                                                <AccountSetting/>
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        <Accordion.Item eventKey="2"> 
                                            <Accordion.Header>Subscription Settings <img src={ac_arrow_img} alt='' /></Accordion.Header>
                                            <Accordion.Body>
                                            <SubscriptionSetting/>
                                            </Accordion.Body> 
                                        </Accordion.Item> 
                                    </Accordion>
                                  </div>

                                  <HelpSetting pageHistory={props.history}/>
                                </Tab>
                                
                                <Tab  eventKey="content" title="CONTENT">
                                 <ImageSetting pageHistory={props.history} activeTab={ontab}/>
                                
                                  <div className="info-sec">
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <LinkSetting/>
                                        </Accordion.Item> 

                                        <Accordion.Item eventKey="1"> 
                                            <Accordion.Header>BIO <img src={ac_arrow_img} alt='' /></Accordion.Header>
                                            <Accordion.Body> 
                                                <BioSetting/>
                                            </Accordion.Body>
                                        </Accordion.Item> 

                                        <Accordion.Item eventKey="2"> 
                                            <Accordion.Header>Your Social Connections (Links) <img src={ac_arrow_img} alt='' /></Accordion.Header>
                                            <Accordion.Body>
                                                <SocialLinksSetting/>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                  </div>

                                  <HelpSetting pageHistory={props.history}/>
                                </Tab>

                                <Tab eventKey="revnue" title="REVENUE"> 
                                    <p className="comsoon-text">Coming Soon...</p>
                                </Tab>
                            </Tabs>
                        </div>
                    </div> 
                  </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;

