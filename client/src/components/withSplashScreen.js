import React, { useEffect, useState } from 'react';
// import './assets/css/App.css'
// import mainlogo from './assets/images/mainlogo1.png'


function SplashMessage() {
    return (
        <div className="mainlogo">
        <div className="">
          SKYCHAT
            {/* <img src={mainlogo}  alt="logo" /> */}
        </div>
        <p className="by">by dheeraj gupta</p>
    </div>
    );
}

const withSplashScreen = (WrappedComponent) => {
    return (props) => {
      const [loading, setLoading] = useState(true);
  
      useEffect(() => {
        const fetchData = async () => {
          try {
            // Put your await requests/API requests here
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } catch (err) {
            console.log(err);
            setLoading(false);
          }
        };
  
        fetchData();
      }, []);
  
      // While checking user session, show "loading" message
      if (loading) return SplashMessage();
  
      // Otherwise, show the desired route
      return <WrappedComponent {...props} />;
    };
  };

export default withSplashScreen;