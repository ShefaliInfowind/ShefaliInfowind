import React, { useState,useEffect} from "react";
import * as moment from 'moment';

export const DateDropDown = (props) => {
    const [selectDate, setSelectDate] = useState('');
    const date_list = [];

    useEffect(() => {
        if(props.selectedDate !== '' && props.selectedDate !== undefined){
           
            var dobdate = moment(props.selectedDate).format("DD");
            // // var dobdate = moment(props.selectedDate, "DD-MM-YYYY").format('DD');
            // console.log('dd----------',dobdate);
            setSelectDate(dobdate);
            
        }
    }, [props,selectDate]);

    console.log('selectDate',selectDate);
    // useEffect(() => {
    //     if(props.selectedDate !== '' && props.selectedDate !== undefined){
    //         var dobdate = moment(props.selectedDate).format("DD");
    //        // var dobdate = moment(props.selectedDate, "DD-MM-YYYY").format('DD');
          
    //         setSelectDate(dobdate);
    //     }
    // }, [props]);

    for (var i = 1; i <= 31; i++) {
       
        date_list.push(i);
    }
   
    return (
        <> 
        
            <option value="">DD</option>
            {date_list.map((date) => (
             
                <option selected={selectDate == date ? 'selected' : ''} value={date}>{date}</option>
            ))}
        </>
    );
}

export const MonthDropDown = (props) => {
    const [selectMonth, setSelectMonth] = useState('');
    
    useEffect(() => {
       
        if(props.selectedMonth !== '' && props.selectedMonth !== undefined){
            //var dobmonth = moment(props.selectedMonth, "DD-MM-YYYY").format('MM');
            
            var dobmonth = moment(props.selectedMonth).format("MM");
            // console.log('mm----------',dobmonth);
          
            if(dobmonth < 10 ){
                dobmonth = dobmonth.replace(0, '');
                setSelectMonth(dobmonth);
             }else{
                setSelectMonth(dobmonth);
             }
         
            console.log('setSelectMonth',selectMonth);
        }
    }, [props,selectMonth]);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month_list = [];
   
    for (let i = 0; i < monthNames.length; i++) {
    
        month_list.push({ id: i+1, value: monthNames[i] });
    }
   
    return (
        <>
            <option value="">MM</option>
            {month_list.map((month) => (

                <option selected={selectMonth == month.id ? 'selected' : ''}  value={month.id}>{month.value}</option>
            ))}
        </>
    );
}

export const YearDropDown = (props) => {
    const [selectYear, setSelectYear] = useState('');
    const currentYear = new Date().getFullYear();
    const year_list = [];

    for (let i = currentYear; i >= 1900; i--) {
       
        year_list.push(i);
    }
    useEffect(() => {
       
        if(props.selectedYear !== '' && props.selectedYear !== undefined){
           
            //var dobyear = moment(props.selectedYear, "DD-MM-YYYY").format('YYYY');

           
            var dobyear = moment(props.selectedYear).format("YYYY");
            console.log('yy----------',dobyear);
            setSelectYear(dobyear);
        }
    }, [props,selectYear]);
   
    
    console.log('selectedYear',selectYear);
    return (
        <>
            <option value="">YYYY</option>
            {year_list.map((yr) => (

                <option selected={selectYear == yr ? 'selected' : ''} value={yr}>{yr}</option>
            ))}
        </>
    );
}


export const PostedTime = (props) => {
    const [postTime, setPostTime] = useState('');

    useEffect(() => {
        var datechange = '';
        if(props.posted_time !== ''){
            
            if(props.pageName === 'conversation'){
                //datechange = moment(props.posted_time).format('MM/DD/YYYY HH:mm:ss');

                var inputstartdate = moment(props.posted_time, 'DD/MM/YYYY HH:mm:ss a').format('MM/DD/YYYY HH:mm:ss');
                //datechange = moment(new Date(props.posted_time)).format('DD/MM/YYYY HH:mm:ss');
                var time_val =  moment(inputstartdate).fromNow(); 
                //var time_val = moment.utc(formateDate).local().startOf('seconds').fromNow();
            
                setPostTime(time_val);
            }else{
                datechange = moment(props.posted_time).format('MM/DD/YYYY HH:mm:ss');
                //var datechange = moment(new Date(props.posted_time)).format('DD/MM/YYYY HH:mm:ss');
                
                var time_val =  moment(datechange).fromNow(); 
                //var time_val = moment.utc(formateDate).local().startOf('seconds').fromNow();
            
                setPostTime(time_val);
            }
            
        }
    }, [props]);

    return (
        <>
            {postTime}
        </>
    );
}

export const ExpiryDateFormate = (props) => {
    const [postDate, setPostDate] = useState('');

    useEffect(() => {
       
            if(props.date !== ''){
                
                var d = new Date(props.date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        
            var resDate = [month,day,year].join('/');
            setPostDate(resDate);
        }
    }, [props]);

    return (
        <>
            {postDate}
        </>
    );
}



export const CalculateExpiryDays = (props) => {
    const [expiryDays, setExpiryDays] = useState('');

    useEffect(() => {
       
            if(props.date !== ''){
                
                var date1 = new Date();
                var date2 = new Date(props.date);
              
                var Difference_In_Time = date2.getTime() - date1.getTime();
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                var resDays = Difference_In_Days.toFixed(0)
                setExpiryDays(resDays);
        }
    }, [props]);

    return (
        <>
            {expiryDays}
        </>
    );
}
   

