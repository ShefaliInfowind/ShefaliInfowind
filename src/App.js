import React,{useLayoutEffect,useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './assets/css/style.css';
import './assets/css/responsive.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './templates/view/Home';
import Subscription from './templates/view/Subscription';
import Payment from './templates/view/Payment';
import SignUp from './templates/view/Signup';
import LogIn from './templates/view/Login';
import ForgotPassword from './templates/view/ForgotPassword';
import Settings from './templates/view/Settings';
import AddContent from './templates/view/Content';
import AddVideo from './templates/view/Content/AddVideo';
import AddImage from './templates/view/Content/AddImage';
import AddAudio from './templates/view/Content/AddAudio';
import UserProfile from './templates/view/Home/userProfile';
import ContentBookmark from './templates/view/Content_Bookmark';
import Audience from './templates/view/Audience';
import './App.css';
import PrivateRoute from "./private-route";
import { fetchUser } from "./Redux/actions/auth-actions";
import { connect } from "react-redux";
import ChatInbox from "./templates/view/Chat_Inbox/";
import Notification from './notification';
import NotificationsList from './templates/view/Notifications';
import Insights from './templates/view/Insights';


function App({ fetchUser }) {

    useLayoutEffect(() => {
     fetchUser();
    }, []);
  

    

  return (
      <div className="App">
       
       <Router>
            <Switch>
              <PrivateRoute component={Home} path="/dashboard" exact/>
              <PrivateRoute component={Payment} path="/payment" exact/>
              <PrivateRoute component={Subscription} path="/subscription/:subscibe_user_id"/>
              <PrivateRoute component={Settings} path="/settings" exact/>
              <PrivateRoute component={AddContent} path="/addContent" exact/>
              <PrivateRoute component={AddVideo} path="/addVideo" exact/>
              <PrivateRoute component={AddImage} path="/addImage" exact/>
              <PrivateRoute component={AddAudio} path="/addAudio" exact/>
              <PrivateRoute component={ContentBookmark} path="/saves"/>
              <PrivateRoute component={Audience} path="/audience"/>
              <PrivateRoute component={ChatInbox} path="/inbox"/>
              <PrivateRoute component={UserProfile} path="/userProfile/:user_id"/>
              <PrivateRoute component={NotificationsList} path="/notifications"/>
              <PrivateRoute component={Insights} path="/insights"/>
              <Route path="/signup" component={SignUp} />
              <Route exact path="/" component={LogIn} /> 
              <Route exact path="/forgot_password" component={ForgotPassword} />
              <Route path="/*" component={LogIn} />

            </Switch>
            <ToastContainer autoClose={5000} hideProgressBar />
            <Notification/>
        </Router>
        
      </div>
  );
}
export default connect(null, { fetchUser })(App);


