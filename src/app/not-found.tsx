import React from "react";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <img
                        src="/assets/logo.jpg" // 
                        alt="Not Found"
                        className="w-24 h-24 mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
                    <p className="text-gray-600">Sorry, we couldn't find the requested resource.</p>
                    <Link href="/">
                        <p className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                            Return to Home
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
