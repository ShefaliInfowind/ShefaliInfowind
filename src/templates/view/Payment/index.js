import React, { useState,useEffect } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm';

function Payment(props) {
  const [CheckoutData,setCheckoutData] = useState('');
  console.log('propspayment',props)
  useEffect(() => {
   if(props.location !== undefined)
   {
      if(props.location.state !== undefined){
        setCheckoutData(props.location);
      }else{
        props.history.push('/dashboard');
      }
   }else{
    props.history.push('/dashboard'); 
   
   }
    
  },[]);

  useEffect(() => {
   
   },[CheckoutData]);

  return (
       
    <StripeProvider apiKey="pk_test_YsxosxluJOFApzTGLBBXiy0O00UEOtWzAC">
      <Elements>
        <CheckoutForm props={props} checkoutData={CheckoutData}/>
      </Elements>
    </StripeProvider>

  );
};

export default Payment;