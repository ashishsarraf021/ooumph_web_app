import React from 'react';

const NoInternet = () => {
    return (
        <div className="no-internet-screen">
            <img src="/assets/logo.png" alt="My Logo" />
            <h1>No Internet Connection</h1>
            <p>Please try again later.</p>
            <a href="/">Contact Us</a>
        </div>
    );
};

export default NoInternet;