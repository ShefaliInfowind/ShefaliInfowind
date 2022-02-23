import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from 'react-stripe-elements'
import '../../../assets/css/CheckoutForm.css'
import { useSelector, connect } from "react-redux";
import { UserSubscriptionPayment } from "../../../Redux/actions/subscriber-actions";
import { getUserProfileById,fetchUser } from "../../../Redux/actions/auth-actions";
import { ERROR } from './../../../utils/errors';
import Loader from './../../../utils/Loader';
import left_arrow_img from '../../../assets/images/Arrow-Left.svg';
import logo_img from '../../../assets/images/Logo.svg';

function CheckoutForm(props,{history }) {
    console.log('checkout---propss',props);
    const { subscribeData,loading } = useSelector((state) => state.subscriberReducer);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [CheckoutReqData, setCheckoutReqData] = useState('');
    const { userDetailsById,authuser} = useSelector((state) => state.authReducer);
    const [cardPrice, setCardPrice] = useState('');
    const [isLoader, setLoader] = useState(false);

    
    useEffect(() => {
      if(props?.checkoutData !== undefined)
      {
        setCheckoutReqData(props.checkoutData);
      }else{
        props.history.push('/dashboard'); 
      }
       
     },[props]);

     useEffect(() => {
      if(CheckoutReqData)
      {
        if(CheckoutReqData.state.type === 'one_time_support'){
          setCardPrice(26.06);
        }else{
          setCardPrice( 4.45);
        }
      }
       
     },[CheckoutReqData,props]);
   
    const handleSubmit = async event => {
      event.preventDefault();

      var payment_amt =0;
      var subscribe_type = '';
      const { token } = await props.stripe.createToken()
     console.log('tokennnnnnn',token);
      // for subscribe = 3.99
      // for onetimesupport = 25

      if(CheckoutReqData && token){
        setLoader(true);
       
        if(CheckoutReqData.state.type === 'one_time_support'){
          payment_amt = cardPrice * 100;
         
        }else{
          payment_amt =  cardPrice * 100;
          
        }

        console.log('payment_amt----',payment_amt);
        const data = {
          amount: payment_amt,
          source: token.id,
          receipt_email: props.authuser.email,
          user_id: props.authuser.uid,
          subscribe_user_id: CheckoutReqData.state.subscribeId,
          type:CheckoutReqData.state.type,
         
          
        };

        console.log('mypayment',data);
        await props.UserSubscriptionPayment(data,history);
        
      }else{
        ERROR('Field value should be valid');
      }
    }

    useEffect(() => {
     
      if(subscribeData?.data){
        setLoader(loading);
        setReceiptUrl(subscribeData.data.charge.receipt_url)
        var subid = Buffer.from(CheckoutReqData.state.subscribeId).toString('base64');
        props.props.history.push('/userProfile/'+subid);
      }
  },[subscribeData]);

  
    if (receiptUrl) {
        return (
          <div className="success">
            <h2>Payment Successful!</h2>
            <a href={receiptUrl}>View Receipt</a>
            <Link to="/">Home</Link>
          </div>
        )
      }
      
      return (

        <div className='payment-main-page'>
           {isLoader ? <Loader isLoader={true} /> : null} 
           <div className="back-arrow">
                <span className="btn"><img src={left_arrow_img} alt='' />Back</span> 
            {/* <Link to="/dashboard"><img src={left_arrow_img} alt='' /> Back</Link> */}
            </div>
          <div className='payment-heading'>
            <div className='payment-logo'>
              <div className="logo">
                <img src={logo_img} alt='' />
              </div>
            </div>
            <h2>Card Infomation</h2>
          </div>
          <div className='payment-details'>
            <div className='payment-card'></div>
            <div className="checkout-form">
              <p>Amount: ${cardPrice}</p>
              <form onSubmit={handleSubmit}>
                <label>
                  Card details
                  <CardNumberElement />
                </label>
                <label>
                  Expiration date
                  <CardExpiryElement />
                </label>
                <label>
                  CVC
                  <CardCVCElement />
                </label>
                <button type="submit" className="order-button">
                  Pay
                </button>
              </form>
            </div>
          </div>
        </div>
      )
    }
    
  const mapStateToProps = (state) => {
    return {
      subscribeData: state.subscriberReducer.subscribeData,
      userDetailsById: state.authReducer.userDetailsById,
      authuser: state.authReducer.authuser,
      loading : state.subscriberReducer.loading
    }
  }
  
  const actionCreators = { getUserProfileById,fetchUser,UserSubscriptionPayment };
  export default connect(mapStateToProps, actionCreators)(injectStripe(CheckoutForm));
  
   