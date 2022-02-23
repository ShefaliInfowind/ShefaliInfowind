import React from 'react'
import Navbar from '../Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Tabs, Tab, Accordion } from 'react-bootstrap'
import UserProfile from '../../components/userProfile';

function Insights() {
    return (
        <div className='main-page-wrapper'>
        <Navbar/>

        <div className='middleMainSection'>

            <div className='middleSection-add-insights'>
                <div className="addContentSec">
                <UserProfile/>

                    <div className="insights-view-page">
                        <div className="insights-head">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="insights-head-left">
                                        <div className="ins-head-pro">
                                            <img src={require('../../../assets/images/probr.svg').default} alt='' />
                                        </div>
                                        <div className="ins-head-inn">
                                            <div className="ins-user"><img src={require('../../../assets/images/GIST1.png').default} alt='' /></div>
                                            <div className="ins-label">Audience</div>
                                            <div className="ins-cont">1.4M</div>
                                            <div className="ins-pr">Up 224%</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="insights-head-right">
                                        <div className="ins-label">Insights</div>
                                        <ul>
                                            <li>
                                                <div className="ins-cont">209</div>
                                                <div className="ins-pr">SUBSCRIBERS</div>
                                            </li>
                                            <li>
                                                <div className="ins-cont">$7,000</div>
                                                <div className="ins-pr">Monthly GROSS REVENUE</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="insights-view">
                            <Tabs defaultActiveKey="instagram" id="uncontrolled-tab-example" className="mb-3">
                                <Tab eventKey="facebook" title="Facebook">
                                    Facebook
                                </Tab>
                                <Tab eventKey="youtube" title="Youtube">
                                    Youtube
                                </Tab>
                                <Tab eventKey="instagram" title="Instagram">
                                    <div className="insights-tabs-main">
                                        <div className="insights-tab-head"><span>INSTAGRAM ANALYICS</span></div>
                                        <div className="insights-tab-inn">
                                            <div className="tab-select">
                                                <select>
                                                    <option>This Month</option>
                                                    <option>This Week</option>
                                                    <option>Today</option>
                                                </select>
                                            </div>

                                            <div className="insights-tab-items">
                                                <div className="insights-tab-item">
                                                    <div className='ins-item-head'>
                                                        <h2>Best performing post this week</h2>
                                                        <div className="ins-item-info"><span>?</span></div>
                                                    </div>
                                                    <div className='ins-item-main'>
                                                        <div className='performing-inner'>
                                                            <ul>
                                                                <li><img src={require('../../../assets/images/image-24.png').default} alt='' /></li>
                                                                <li><img src={require('../../../assets/images/image-25.png').default} alt='' /></li>
                                                                <li><img src={require('../../../assets/images/image-26.png').default} alt='' /></li>
                                                                <li><img src={require('../../../assets/images/image-27.png').default} alt='' /></li>
                                                                <li><img src={require('../../../assets/images/image-28.png').default} alt='' /></li>
                                                                <li><img src={require('../../../assets/images/image-29.png').default} alt='' /></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="insights-tab-item">
                                                    <div className='ins-item-head'>
                                                        <h2>This Week</h2>
                                                        <div className="ins-item-info"><span>?</span></div>
                                                    </div>
                                                    <div className='ins-item-main'>
                                                        <div className='progr-inner'>
                                                             <ul>
                                                                 <li className='pro-up'>
                                                                     <div className='pro-tbl'>IMpressions</div>
                                                                     <div className='pro-ttl'>19,992,932</div>
                                                                 </li>
                                                                 <li className='pro-up'>
                                                                     <div className='pro-tbl'>Engagement rate</div>
                                                                     <div className='pro-ttl'>4.09%</div>
                                                                 </li>
                                                                 <li className='pro-dwn'>
                                                                     <div className='pro-tbl'>Avg likes per post</div>
                                                                     <div className='pro-ttl'>332,147</div>
                                                                 </li>
                                                                 <li className='pro-dwn'>
                                                                     <div className='pro-tbl'>Avg views per post</div>
                                                                     <div className='pro-ttl'>1,136,261</div>
                                                                 </li>
                                                                 <li className='pro-up'>
                                                                     <div className='pro-tbl'>Avg comments per post</div>
                                                                     <div className='pro-ttl'>8,433</div>
                                                                 </li>
                                                             </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="insights-tab-item">
                                                    <div className='ins-item-head'>
                                                        <h2>Top cities</h2>
                                                        <div className="ins-item-info"><span>?</span></div>
                                                    </div>
                                                    <div className='ins-item-main'>
                                                        <div className='cities-inner'>
                                                             <table className='table'>
                                                                 <tr>
                                                                     <th colSpan={2}>City</th>
                                                                     <th>FOLLOWERS</th>
                                                                 </tr>
                                                                 <tr>
                                                                     <td>1</td>
                                                                     <td>
                                                                         <div className='cities-name'>
                                                                             <span className='cities-img'><img src={require('../../../assets/images/image-16.png').default} alt='' /></span>
                                                                             <span className='cities-lbl'>Los Angeles</span>
                                                                         </div>
                                                                     </td>
                                                                     <td>270,000</td>
                                                                 </tr>
                                                                 <tr>
                                                                     <td>2</td>
                                                                     <td>
                                                                         <div className='cities-name'>
                                                                             <span className='cities-img'><img src={require('../../../assets/images/image-16.png').default} alt='' /></span>
                                                                             <span className='cities-lbl'>Los Angeles</span>
                                                                         </div>
                                                                     </td>
                                                                     <td>270,000</td>
                                                                 </tr>
                                                                 <tr>
                                                                     <td>3</td>
                                                                     <td>
                                                                         <div className='cities-name'>
                                                                             <span className='cities-img'><img src={require('../../../assets/images/image-16.png').default} alt='' /></span>
                                                                             <span className='cities-lbl'>Los Angeles</span>
                                                                         </div>
                                                                     </td>
                                                                     <td>270,000</td>
                                                                 </tr>
                                                             </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="twitter" title="Twitter">
                                    Twitter
                                </Tab>
                                <Tab eventKey="tiktok" title="Tiktok">
                                    Tiktok
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

export default Insights
