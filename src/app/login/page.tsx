// @ts-nocheck
"use client"

import React, { useState } from "react";
import {useRouter} from 'next/navigation';
import styles from "./login.module.css";
import { gql, useMutation } from "@apollo/client";
import useAuthStore from '../../stores/userAuth';
// Import useNavigate hook
import { FaFacebook, FaGoogle, FaGithub } from "react-icons/fa6";
import { enqueueSnackbar } from 'notistack'

const logo = "assets/ooumph.png"; //ooumph logo 

// GraphQL mutation to authenticate the user and obtain tokens
const LOGIN_MUTATION = gql`
  mutation TokenAuth($password: String!, $username: String!) {
    tokenAuth(password: $password, username: $username) {
      token
      refreshToken
    }
  }
`;

// Login component
const LoginPage = () => {

    // State to manage form inputs and login success status
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const { setAuthToken, setRefreshToken } = useAuthStore();
    const router =useRouter()

    // Use the Apollo Client's useMutation hook to execute the login mutation
    const [loginMutation] = useMutation(LOGIN_MUTATION);
    // const navigate = useNavigate()

    // Function to handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Execute the login mutation with the provided credentials
            const { data } = await loginMutation({
                variables: { password, username },
            });

            // Extract the authentication tokens from the response
            const { token, refreshToken } = data.tokenAuth;
            // Store the tokens in local storage for future use
            // localStorage.setItem("authToken", token);
            // localStorage.setItem("refreshToken", refreshToken);

            setAuthToken(token);
            setRefreshToken(refreshToken);


            // Set login success state, clear form inputs, and update authToken in parent component
            setLoginSuccess(true);
            setUsername("");
            setPassword("");
            // Update the authToken state in the parent component (App)
            // updateAuthToken(token);

            // Navigate to the home page after successful login
            // navigate("/")

            router.push("/home")

        
        } catch (error) {
            // Handle GraphQL errors that might occur during login
            console.error("GraphQL Error:", error.message);
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
    };

    return (
        <div>
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
                    <h1 className={styles.title}>Members Only</h1>
                    <div className={styles.rightContentContainer}>
                        {/* Form */}
                        <div className={styles.formContainer}>
                            <form className={styles.form} onSubmit={handleFormSubmit}>
                                {/* Username Input */}
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={styles.input}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />

                                {/* Password Input */}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-400 hover:bg-blue-600 mt-14"
                                >
                                    Log In
                                </button>
                            </form>
                            {loginSuccess && (
                                <p className={styles["login-success"]}>Login successful!</p>
                            )}
                            <div className={styles.line}></div>
                            <p className={styles.socialText}>or</p>
                            <p className={styles.socialText}>Log in using social media</p>
                            <div className={styles["auth-options"]}>
                                {/* Facebook Icon */}
                                <FaFacebook className={styles["social-icon"]} />

                                {/* Google Icon */}
                                <FaGoogle className={styles["social-icon"]} />

                                {/* GitHub Icon */}
                                <FaGithub className={styles["social-icon"]} />
                                {/* Add social media icons here */}
                                {/* Add social media icons here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
