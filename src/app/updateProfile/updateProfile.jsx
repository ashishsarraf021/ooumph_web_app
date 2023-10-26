import React, { useState } from "react"
import { useMutation, gql } from "@apollo/client"
import VerifyOtpPage from "../otp/OTPVerification" // Import your VerifyOtpPage component
import Nav from "../../components/nav/nav"
import SideNav from "../../components/sideNav/sideNav"

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile(
    $email: String!
    $phone: String!
    $bio: String
    $college: String
    $dob: String
    $designation: String
    $address: String
    $username: String
  ) {
    updateUserProfile(
      email: $email
      phoneNumber: $phone
      bio: $bio
      college: $college
      dob: $dob
      designation: $designation
      address: $address
      username: $username
    ) {
      user {
        id
      }
    }
  }
`

const SEND_OTP_MUTATION = gql`
  mutation SendOtp($email: Boolean!, $phone: Boolean!) {
    sendOtp(email: $email, phone: $phone) {
      success
    }
  }
`

const UpdateProfile = () => {
  const authToken = "asdadasdasasdas"

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpemail, setOtpemail] = useState("");
  const [otpphone, setOtpphone] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [dob, setDob] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [emailAndPhoneUpdated, setEmailAndPhoneUpdated] = useState(false);
  const [showOtpFields, setShowOtpFields] = useState(false); // Initially hide OTP fields

  const [updateUserProfile] = useMutation(UPDATE_PROFILE_MUTATION)
  const [sendOtp] = useMutation(SEND_OTP_MUTATION)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!emailAndPhoneUpdated && showOtpFields) {
        // Verify OTP after the "Send OTP" button is clicked
        try {
          const { data } = await verifyOtp({
            variables: { emailOtp: otp, phoneOtp: otp },
            context: {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          });

          if (data.verifyOtp.success) {
            // OTP verification successful, update email and phone number
            setEmailAndPhoneUpdated(true);
          } else {
            console.error("OTP verification failed");
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
        }
      } else {
        // Update other profile fields
        const { data: updateData } = await updateUserProfile({
          variables: {
            email,
            phone,
            bio,
            college,
            dob,
            designation,
            address,
            username,
          },
          context: {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });

        if (updateData.updateUserProfile.user) {
          console.log("Profile updated successfully");
        } else {
          console.error("Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleSendOtp = async () => {
    try {
      const { data } = await sendOtp({
        variables: { email: true, phone: true },
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      })

      if (data.sendOtp.success) {
        console.log("OTP Sent successfully");
        setShowOtpFields(true); // Show OTP fields after sending OTP
        console.log("OTP Sent successfully")
      } else {
        console.error("Failed to send OTP")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div>
      <Nav />
      <div className="grid grid-cols-2 wrapper mt-28">
        {/* Left Part - Email and Phone Verification */}
        <div className="col-span-1 sticky top-28 p-4 left-0 h-screen overflow-y-auto">
          <h2 className="my-4 mb-8">Verify Email and Phone</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {!emailAndPhoneUpdated && !showOtpFields ? (
              <button
                className="rounded-lg mt-11 bg-blue-500 hover:bg-sky-700"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            ) : null}
            {showOtpFields ? (
              <div>
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="Enter OTP received on mail"
                  value={otpemail}
                  onChange={(e) => setOtpemail(e.target.value)}
                  required
                />
                 <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="Enter OTP received on phone"
                  value={otpphone}
                  onChange={(e) => setOtpphone(e.target.value)}
                  required
                />
                <button
                  className="rounded-lg mt-11 bg-blue-500 hover:bg-sky-700"
                  type="submit"
                >
                  Verify OTP
                </button>
              </div>
            ) : null}
          </form>
        </div>

        {/* Right Part - Update Profile Fields */}
        <div className="col-span-1">
          <div className="wrapper">
            <div className="max-w-xl my-11">
              <h2 className="my-4 mb-8">Update Profile</h2>
              <form onSubmit={handleFormSubmit}>
                {/* Add fields for bio, college, DOB, designation, address, and username */}
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="Designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  className="my-3 py-3 px-5 w-full rounded-lg shadow-md"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  className="rounded-lg mt-11 bg-blue-500 hover:bg-sky-700"
                  type="submit"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
