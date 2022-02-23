import React from "react";


function EncryptProfileUrl(id){
    
    if(id !== ''){
        
       // const path = window.location.origin;
        const ids = Buffer.from(id).toString('base64');
        const url = '/userProfile/' + ids;
        return url;
    }
   
  };

export default EncryptProfileUrl;