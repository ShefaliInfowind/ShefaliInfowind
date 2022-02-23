import React from 'react'
import loader from '../assets/images/loader.gif'

function Loader (props){
   
    const displayLoader = props?.isLoader ? 'inline-block' : 'none';
    const style = {
        display: displayLoader,
    }
    return (
          
        // <img alt="" display={props?.isLoader === true ? 'inline-block' :'none'} src={loader }style={{ width:'200px', margin:'auto' , display:'block' , alt:'Loading'}}/>
        <div className="update-loader">
            <img alt="" src={loader }style={style}/>
        </div>
   
       
    )
}

export default Loader