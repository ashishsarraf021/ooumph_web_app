import React from "react";

import style from  "./splashScreen.module.css"

const SplashScreen = () => {
    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center bg-var(--color-background)"
        >
            <div className="text-black text-5xl rounded-lg flex flex-col items-center">
                <img
                    src="/assets/logo_md.jpg" 
                    alt="App Icon"
                    className="w-32 h-32 mb-4 rounded-md animate-pulse" 
                />
                <h1 className="text-3xl">OOUMPH</h1> {/* Added text */}
            </div>
            <div className={`w-32 h-2 mt-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 ${style.animateGradient}`}></div>
        </div>
    );
};

export default SplashScreen;
