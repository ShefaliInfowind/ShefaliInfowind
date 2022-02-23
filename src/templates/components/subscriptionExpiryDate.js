import React from "react";


function ExpiryDate(date){
    
    if(date !== ''){
        var checkDate = new Date();
       
        const milliseconds = date.seconds * 1000 // 1575909015000
        var cloneDate  = new Date(milliseconds)
      
        //for monthly subscription
       
        cloneDate.setDate(cloneDate.getDate() + 30);
        if(cloneDate.getTime() > checkDate.getTime()){

            return cloneDate;
        }
        else{
            return '';
        }
    }
   
}
export default ExpiryDate;