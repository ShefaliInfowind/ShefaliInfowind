import React,{useState} from 'react';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core'

function Navhead(props) {

    const [isOpen, setIsOpen] = useState('menu-active')
    
    // for menu toggle
    const handleMenu = () => {
        if(isOpen === 'menu-active')
        {
            setIsOpen('');
            document.body.classList.add('menu-close');
           
        }
        else{
            setIsOpen('menu-active');
           document.body.classList.remove('menu-close');
            
        }
    }
    
    return (
        <div className='nav-head'>
            <div className={`menuIcon ${isOpen}`}>
                <Button  type="button" onClick={e => handleMenu()} className='btn'>
                    <img src={require('../../assets/images/Union.svg').default} alt='' />
                </Button>
            </div>
            <div className='nav-lgSec'>
                <div className='mainLogo'>
                    <Link to='/dashboard'><img src={require('../../assets/images/n-logo.svg').default} alt='' /> </Link>
                </div>
                <div className="add-contetn-btn">
                    <Link to="/addContent"> <span>+</span> Add Content </Link>
                </div>
            </div>
        </div>
    );
  }

export default Navhead;