import React, { useState, useEffect,useLayoutEffect } from 'react'
import { Link } from "react-router-dom";
import FAQ from './FAQ';
import Support from './support';
import PrivacyPolicy from './privacyPolicy';
import { Button } from '@material-ui/core'
// Redux
import { connect,useSelector } from "react-redux";
import { logout,DisableUser } from "../../../Redux/actions/auth-actions";
import { getAuthenticationStatus } from "../../../Redux/auth-service";
import Loader from './../../../utils/Loader';
import {auth } from "../../../Redux/auth-service";
import { confirm } from "react-confirm-box";

function HelpSetting(props, { history }) {
    const options = {
        labels: {
            confirmable: "Confirm",
            cancellable: "Cancel"
        }
    }
    const { disableUserData,authuser } = useSelector((state) => state.authReducer);

    const [showFAQ, setShowFAQ] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoader, setLoader] = useState(false);

    useLayoutEffect(() => {

        setLoader(false);
        setIsAuthenticated(getAuthenticationStatus());
    });

    const handleLogout = async (event) => {
        await props.logout(props.pageHistory);
    };

    const handleCancelAccount = async (event) => {
        const results = await confirm("Are you sure you want to cancel your account?",options);
        if (results) {
            var user = auth.currentUser;
            const data = {
                uid: user.uid, 
            };
            await props.DisableUser(data, props.pageHistory); 
        }
    };
   
    return (
        <>
            {isLoader ? <Loader isLoader={true} /> : null}
            <div className="help-sec">
                <FAQ show={showFAQ} close={() => setShowFAQ(false)} />
                <Support show={showSupport} close={() => setShowSupport(false)} />
                <PrivacyPolicy show={showPrivacyPolicy} close={() => setShowPrivacyPolicy(false)} />

                <h3>Help</h3>
                <ul>
                    <li>
                        <Button  className='btn' onClick={() => { setShowFAQ(true); setLoader(true); }}>Frequently Asked Questions (FAQ) <img src={require('../../../assets/images/redShape.png').default} alt='' /></Button>
                    </li>

                    <li>
                        <Button  className='btn' onClick={() => { setShowPrivacyPolicy(true); setLoader(true); }}>Privacy Policy <img src={require('../../../assets/images/redShape.png').default} alt='' /></Button>
                    </li>

                    <li>
                        <Button  className='btn' onClick={() => { setShowSupport(true); setLoader(true); }}>Support <img src={require('../../../assets/images/redShape.png').default} alt='' /></Button>
                    </li>
                </ul>
            </div>

            <div className="cancel-logout-sec">
                <div className="login-via create-ac">
                    {isAuthenticated &&
                        <Button className="log-btn btn" type="button" onClick={handleLogout}>LOG OUT</Button>
                    }
                   <div className="ald"> <Button className='log-btn btn' type="button" onClick={handleCancelAccount}> Cancel Account</Button></div>
                    {/* <div className="ald"> <a href="#">Cancel Account</a></div> */}
                </div>
            </div>
        </>
    )
}

const mapState = (state) => ({
    authuser: state.authReducer.authuser,
    disableUserData:state.authReducer.disableUserData
});
const actionCreators = { logout,DisableUser };
export default connect(mapState, actionCreators)(HelpSetting);
