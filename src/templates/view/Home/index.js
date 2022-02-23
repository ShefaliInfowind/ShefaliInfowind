import React from 'react'
import Navbar from '../Navbar';
import Footer from '../footer';
import HomePage from './homePage';
import HomeProfile from './homeProfile';
import HomeAbout from './homeAbout';
import HomeAudio from './homeAudio';
import HomeVideoImage from './homeVideoAndImage';
import { useSelector } from "react-redux"; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; 

function Home() {
    const { userDetailsById} = useSelector((state) => state.authReducer);
    return (
        <div className='main-page-wrapper'>
            <Navbar />
            {userDetailsById?.user_active === true &&
            (
            <div className='middleMainSection'>

                <div className='topHomeProfile'>
                    <div className='middleSection'>
                        <div className='middleSectionInn'>
                            <HomeProfile />
                        </div>
                    </div>
                    <div className='right-top-box hide-mobile'>
                        <div className="ab-desc">
                            <HomeAbout />
                        </div>
                    </div>
                    <div className="about-sec-mobile">
                        <div className="ab-desc">
                            <HomeAbout viewType={'mobile_view'} />
                        </div>
                    </div>
                </div>

                <div className='middleMainSec'>
                    <div className='middleSection mainHome hide-mobile'>
                        <div className='middleSectionInn'>
                            <HomePage />
                            <HomeVideoImage />
                        </div>
                    </div>
                    <div className='rightSection hide-mobile'>
                        <HomeAudio />
                    </div>

                    <div className='vd-img-section'>
                        <Tabs>
                            <TabList>
                                <Tab>Content</Tab>
                                <Tab>Music</Tab>
                            </TabList>

                            <TabPanel>
                                <HomePage />
                                <HomeVideoImage />
                            </TabPanel>

                            <TabPanel>
                                <HomeAudio />
                            </TabPanel>
                        </Tabs> 
                    </div>

                </div>

                <Footer />
            </div>
            )}
            
        </div>
    )
}

export default Home;

