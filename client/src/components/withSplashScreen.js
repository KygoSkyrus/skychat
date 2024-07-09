import React, { useEffect, useState } from 'react';
import logo1 from './../assets/logo/logo (1).png'

function SplashMessage() {
  return (
    <div className='splash'>
      <div className="mainlogo absolute-centered mainlogo text-center text-light">
        <img src={logo1} width={200} alt='' />
        <p className="by fs-3">
          <i className='text-light fs-12'>by</i> dheeraj gupta
        </p>
      </div>
    </div>
  );
}

const withSplashScreen = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setTimeout(() => {
            setLoading(false);
          }, 1800);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };
      
      fetchData();
    }, []);

    if (loading) return SplashMessage();
    return <WrappedComponent {...props} />;
  };
};

export default withSplashScreen;