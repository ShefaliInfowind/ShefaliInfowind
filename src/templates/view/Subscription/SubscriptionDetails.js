import React,{useState,useEffect} from 'react'
import { Button } from '@material-ui/core'
import { Link } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import { fetchUser } from "../../../Redux/actions/auth-actions";
import { getUserSubscriptionExpired } from "../../../Redux/actions/subscriber-actions";
import ExpiryDate from "../../components/subscriptionExpiryDate";
import {ExpiryDateFormate,CalculateExpiryDays} from "../../components/calendar_date";

function SubscriptionDetails(props) {

    const [subsId, setSubsId] = useState('');
    const { authuser } = useSelector((state) => state.authReducer);
    const { subscribeExpired } = useSelector((state) => state.subscriberReducer);
    const [expiredDate, setExpiredDate] = useState('');
    
    useEffect(() => {
        const subsid = Buffer.from(props.Subsc_UserId, 'base64').toString('ascii');
        setSubsId(subsid);
       },[props]);

    useEffect(() => {
        async function fetchdata() {
            const data ={
                user_id:authuser.uid,
                subscriberId:subsId,
            }
            await props.getUserSubscriptionExpired(data);
         }
         fetchdata();

    },[subsId]);   

    useEffect(() => {
   
    },[subsId]);

    useEffect(() => {
        if(subscribeExpired.date){
            var exp_date = ExpiryDate(subscribeExpired.date);
            if(exp_date !== ''){
                
                setExpiredDate(exp_date);
            }
            console.log('exp_date',exp_date);
        }

    },[subscribeExpired]);
   
  
    console.log('subscribeExpired',subscribeExpired.date);
    
    return (
        <div className='subscription-page'>
            <div className='subs-page-inn'>
                <div className='subs-top-txt'>
                    <h5>Subscribe</h5>
                    <p>Subscribe to support me and get exclusive content.(Merch, Advance show tickets, First Listens + More)</p>
                    <h4>WHY SUPPORT</h4>
                    <h6>Offer supporters the ability to hear new music before anyone else, see exclusive content and be apart of your creative process.</h6>
                </div>
                <div className='subs-item'>
                    {expiredDate !== '' ?

                        <Button disabled className='btn'>SUbscribed</Button>
                        :
                        <Link className='btn' to ={{
                            pathname: "/payment", 
                            state: { 
                                subscribeId: subsId, 
                                type: 'subscription', 
                            }
                            }} > SUbscribe </Link>
                    }
                   
                    {expiredDate !=='' ? 
                        <div>
                            <h6>Expired in : <ExpiryDateFormate date={expiredDate} /> (<CalculateExpiryDays date={expiredDate} /> days)</h6>
                        </div>
                        :
                        <h4>$3.99 / Monthly</h4>
                    }
                    <h6>+ 2.9% + 30¢ (Stripe Processing Fees)</h6>
                </div>
                <div className='subs-item-btm'>
                    <Link className='btn btn-danger' to ={{
                        pathname: "/payment", 
                        state: { 
                            subscribeId: subsId, 
                            type: 'one_time_support', 
                        }
                        }} >DAP
                        </Link>
                    {/* <Button className='btn'>DAP</Button> */}
                    <h4>$25 / One time Support</h4>
                    <p>This is a one time payment [DAP] to support this artist. To access exclusive content, direct communication and more please subscribe.</p>
                    <h6>+ 2.9% + 30¢ (Stripe Processing Fees)</h6>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        subscribeExpired: state.subscriberReducer.subscribeExpired,
        authuser: state.authReducer.authuser,
    }
}

const actionCreators = { getUserSubscriptionExpired,fetchUser };
export default connect(mapStateToProps, actionCreators)(SubscriptionDetails);



