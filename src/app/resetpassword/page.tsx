// @ts-nocheck
'use client'

import React, { useState } from "react"
import { useMutation, gql } from "@apollo/client"
import { useRouter } from "next/navigation"
import useAuthStore from '../../stores/userAuth';
import { enqueueSnackbar } from 'notistack'

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
      success
    }
  }
`

const ChangePasswordPage = () => {
  const {authToken} = useAuthStore()
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [changePasswordMutation] = useMutation(CHANGE_PASSWORD_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`, // Pass the authToken in the headers
      },
    },
  })

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await changePasswordMutation({
        variables: {
          oldPassword,
          newPassword,
        },
      })

      // Handle the response, e.g., show success message or handle errors
      

      // Reset form fields
      setOldPassword("")
      setNewPassword("")

      // Redirect to the login page
      router.push("/login")
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

  return (
    <div className="wrapper">
      <div className="w-2/5 my-8 mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-semibold text-gray-800 my-4 mb-6">
          Change Password
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-4">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="px-4 py-2 my-2 border border-gray-300 rounded-full shadow-md"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="px-4 py-2 my-2 border border-gray-300 rounded-full shadow-md"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-16"
            type="submit"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordPage
