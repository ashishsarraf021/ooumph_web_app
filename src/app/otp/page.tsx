// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import styles from "../register/register.module.css";
import { useMutation, gql } from "@apollo/client";
import useAuthStore from '@/stores/userAuth';
import UserProfileStore from "@/stores/userProfile";
import { enqueueSnackbar } from 'notistack';

const generateOTP = gql`
mutation SendOtp {
  sendOtp(email: true) {
      success
  }
}
`;


const vfyOTP = gql`mutation VerifyOtp($emailotp: String!) {
  verifyOtp(emailotp: $emailotp) {
      success
  }
}`

const OTPVerification = () => {
  const [formData, setFormData] = useState({ OTP: "" });
  const [resendTimer, setResendTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [generateOtp] = useMutation(generateOTP);
  const [verifyOtp] = useMutation(vfyOTP);
  const { authToken, removeTokens } = useAuthStore();
  const { email } = UserProfileStore()
  const [pageLoaded, setPageLoaded] = useState(false);
  const [msg, setMsg] = useState("")


  const router = useRouter()

  const inputRefs = {
    OTP1: useRef(null),
    OTP2: useRef(null),
    OTP3: useRef(null),
    OTP4: useRef(null),
    OTP5: useRef(null),
    OTP6: useRef(null),
  }

  const resetForm = () => {
    setFormData({
      OTP1: "",
      OTP2: "",
      OTP3: "",
      OTP4: "",
      OTP5: "",
      OTP6: "",
    });
  };


  const handleInputChange = (e, currentInputName) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [currentInputName]: value,
    }));

    if (value && value.length === 1) {
      const nextInputName = currentInputName === "OTP6" ? "OTP6" : `OTP${parseInt(currentInputName[3], 10) + 1}`;
      if (inputRefs[nextInputName] && inputRefs[nextInputName].current) {
        inputRefs[nextInputName].current.focus();
      }
    }
  };



  const handleSubmit = async () => {
    const { data } = await generateOtp({
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });

    console.log(data);

    setOtpSent(true);
  };

  const handleItsNotMe = () => {
    removeTokens()
    router.push("/")
  }

  const handleResend = async () => {
    setOtpSent(true);
    setResendTimer(60);
    resetForm();
    await handleSubmit();
  };

  useEffect(() => {
    if (!pageLoaded) {
      // This code will run only when the component is first mounted
      handleSubmit();
      setPageLoaded(true);
    }
  }, [pageLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (resendTimer === 0) {
      setShowResend(true);
    } else {
      setShowResend(false);
    }
  }, [resendTimer]);

  const verifyOTP = async () => {
    console.log(formData)
    const otps = Object.values(formData);
    const concatenatedOTP = otps.join('');
    try {

      const { data } = await verifyOtp({
        variables: {
          "emailotp": concatenatedOTP
        },
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      if (data?.verifyOtp?.success) {

        enqueueSnackbar("OTP is Verified.", {
          variant: 'default',
          root: { fontSize: "16px" },
          hideIconVariant: false,
          autoHideDuration: 3000,
          anchorOrigin: {
            horizontal: "center",
            vertical: "top",
          },
        })
        router.push("/home")
      }
      else {
        enqueueSnackbar("Please Enter Valid OTP.", {
          variant: 'default',
          root: { fontSize: "16px" },
          hideIconVariant: false,
          autoHideDuration: 3000,
          anchorOrigin: {
            horizontal: "center",
            vertical: "top",
          },
        })
      }

    }
    catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'default',
        root: { fontSize: "16px" },
        hideIconVariant: false,
        autoHideDuration: 3000,
        anchorOrigin: {
          horizontal: "center",
          vertical: "top",
        },
      })
    }

  }

  return (

    <div className="flex items-center justify-center min-h-screen">
      <div className={styles.rightContainer}>
        <div className={styles.rightContentContainer}>
          <div className={styles.formContainer}>
            <div className="w-screen">
              <div className="w-screen">
                <div className="w-full">
                  <div className="w-full">
                    <div className="py-3 rounded text-center">
                      <h1 className="text-4xl font-bold">OTP Verification</h1>
                      <div className="flex flex-col mt-4 text-2xl">
                        <span>Enter the OTP you received at</span>
                        <span className="font-bold text-2xl"> {email ? email : "OTP has been send to your registered email."} </span>
                      </div>

                      <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
                        {/* <input
                          className="m-2 border h-20 w-20 text-center form-control rounded"
                          type="text"
                          name="OTP1"
                          maxLength="1"
                          value={formData.OTP1 || ''}
                          onChange={handleInputChange}
                        />
                        <input
                          className="m-2 border h-20 w-20 text-center form-control rounded"
                          type="text"
                          name="OTP2"
                          maxLength="1"
                          value={formData.OTP2 || ''}
                          onChange={handleInputChange}
                        />
                        <input
                          className="m-2 border h-20 w-20 text-center form-control rounded"
                          type="text"
                          name="OTP3"
                          maxLength="1"
                          value={formData.OTP3 || ''}
                          onChange={handleInputChange}
                        />
                        <input
                          className="m-2 border h-20 w-20 text-center form-control rounded"
                          type="text"
                          name="OTP4"
                          maxLength="1"
                          value={formData.OTP4 || ''}
                          onChange={handleInputChange}
                        />
                        <input
                          className="m-2 border h-20 w-20 text-center form-control rounded"
                          type="text"
                          name="OTP5"
                          maxLength="1"
                          value={formData.OTP5 || ''}
                          onChange={handleInputChange}
                        />
                        <input
                          className="m-2 border h-20 w-20 text-center form-control rounded"
                          type="text"
                          name="OTP6"
                          maxLength="1"
                          value={formData.OTP6 || ''}
                          onChange={handleInputChange}
                        /> */}
                        {Object.keys(inputRefs).map((inputName) => (
                          <input
                            key={inputName}
                            ref={inputRefs[inputName]}
                            className="m-2 border h-20 w-20 text-center form-control rounded"
                            type="text"
                            name={inputName}
                            maxLength="1"
                            value={formData[inputName] || ''}
                            onChange={(e) => handleInputChange(e, inputName)}
                          />
                        ))}

                      </div>


                      <div className="flex justify-center text-center mt-5">

                        <p> You can resend OTP {resendTimer > 0 ? `after ${resendTimer} sec.` : 'now.'}</p>

                        {resendTimer <= 0 && (
                          <a className="flex items-center text-blue-700 hover-text-blue-900 cursor-pointer">
                            <span className="font-bold text-2xl" onClick={() => handleResend()} >Resend OTP</span>
                            <i className='bx bx-caret-right ml-1'></i>
                          </a>
                        )}



                      </div>


                      <div className="flex flex-col items-center mt-5">
                        <p className="text-lg text-red-500 hover:text-red-700 transition duration-300 cursor-pointer mb-3" onClick={handleItsNotMe}>
                          It's not me
                        </p>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={verifyOTP}
                        >
                          Verify OTP
                        </button>
                      </div>





                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
