import React, { useEffect,useState } from "react";

const ReadMore = (props) => {

var text = '';
var length = 0;
var action = 'no';

if(props)
{
    
    text = props.content;
    length = props.length;
    action = props.action;
}
const [isReadMore, setIsReadMore] = useState(true);
const [dotvalue, setdotvalue] = useState('');

const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

useEffect(() => {
    if(text !== undefined && length !== undefined){
        if(text.length > length){
            setdotvalue('...');
        } 
    }
    

},[text,length]);

return (

	<p>
    {text !== undefined && (
        isReadMore ? text.slice(0, length) : text
    )} 
        
        {   action === "yes" ? 
            <span onClick={toggleReadMore} className="read-or-hide">
                {isReadMore ? "...read more" : " show less"}
            </span>
            : dotvalue
    
        }
	</p>
	
);
};

export default ReadMore;
