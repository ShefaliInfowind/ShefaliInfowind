import React from "react";


function EncryptDecrypt(props){
    
    var profile_id = props.profile_id;
    var type = props.type;
    var id = '';
  
    if(type === 'encrypt'){
        id = Buffer.from(profile_id).toString('base64');
        return id;
    }
    if(type === 'decrypt'){
        id = Buffer.from(profile_id, 'base64').toString('ascii');
        return id;
    }
  };

export default EncryptDecrypt;