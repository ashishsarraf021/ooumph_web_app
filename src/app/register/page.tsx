// @ts-nocheck
'use client'

import React, { useState } from "react"
import { useMutation, gql } from "@apollo/client"
import Link from "next/link" 
import { useRouter } from 'next/navigation';
import styles from "./register.module.css"
import { FaFacebook, FaGoogle, FaGithub } from "react-icons/fa6"
import useAuthStore from '../../stores/userAuth';
import { enqueueSnackbar } from 'notistack'
import {CREATE_USER_MUTATION} from "@/graphql/mutations";
import UserProfileStore from "@/stores/userProfile";

const logo = "/assets/ooumph.png" //ooumphLogo

const RegistrationPage = () => {

  const router = useRouter();
  const {setEmail} = UserProfileStore()

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  })

  const { setAuthToken, setRefreshToken } = useAuthStore();

  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER_MUTATION)


  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUserMutation({
        variables: {
          username: formData.username,
          password: formData.password,
          email: formData.email,
        },
      })

      const { token,user,profile} = response.data.createUser

      console.log("Registration successful!")
      console.log("Token:", token)
      console.log("User Data:", response.data.createUser)

      if(token){
      setAuthToken(token)
      setRegistrationSuccess(true)

      if(profile.isEmailVerified===false){
        setEmail(user.email || null)
        router.push('/otp');
      }
      else{

      router.push('/home');
      }

      enqueueSnackbar(`Welcome ${formData.username}`, {
        variant: 'info',
        root: { fontSize: "16px" },
        hideIconVariant: false,
        autoHideDuration: 3000,
        anchorOrigin: {
            horizontal: "center",
            vertical: "top",
        }})

      }

    } catch (error) {
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



  // TODO: ADD VALIDATION FOR  THE USER REGISTRATION FORM DATA


  return (
    <div className={`wrapper ${styles.container}`}>
      {/* Left Container */}
      <div className={styles.leftContainer}>
        <div className={styles.imageContainer}>
          <img src={logo} alt="Logo" className={styles.image} />
          <h2 className={styles.companyName}>OOUMPH</h2>
        </div>
      </div>

      {/* Right Container */}
      <div className={styles.rightContainer}>
        <h1 className={styles.title}>APPLY ACCOUNT</h1>
        <div className={styles.rightContentContainer}>
          {/* Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Full Name Input */}
              {/* <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className={styles.input}
                value={formData.fullName}
                onChange={handleInputChange}
              /> */}

              {/* Username Input */}
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={styles.input}
                value={formData.username}
                onChange={handleInputChange}
              />

              {/* Email Input */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input}
                value={formData.email}
                onChange={handleInputChange}
              />

              {/* Password Input */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className={styles.toggleContainer}>
                <div
                  className={`${styles.toggleButton} ${
                    acceptedTerms ? styles.accepted : ""
                  }`}
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                >
                  <div className={styles.toggleCircle}></div>
                </div>
                <p
                  className={`${styles.toggleText} ${
                    acceptedTerms ? styles.acceptedText : ""
                  }`}
                >
                  I {acceptedTerms ? "accepted" : "accept"} all the terms and
                  conditions
                </p>
              </div>

              <button
                type="submit"
                className={`${styles.ContinueBtn} w-full bg-blue-400 hover:bg-blue-600 `}
              >
                Continue
              </button>

              {registrationSuccess && (
                <p className={styles["registration-success"]}>
                  Registration successful!
                </p>
              )}
            </form>
            <p className={styles.regText}>
              Already have an account?{" "}
              <Link href="/login" className={styles.signIn}>
                Sign in
              </Link>
            </p>
            <p className={styles.regText}>or</p>

            <p className={styles.regText}>Register using social media</p>
            <div className={styles["auth-options"]}>
              {/* Facebook Icon */}
              <FaFacebook className={styles.socialIcon} />

              {/* Google Icon */}
              <FaGoogle className={styles.socialIcon} />

              {/* GitHub Icon */}
              <FaGithub className={styles.socialIcon} />
              {/* Add social media icons here */}
            </div>

            {/* Add the "Login" button */}
          </div>
        </div>
      </div>

      


    </div>
  )
}

export default RegistrationPage
