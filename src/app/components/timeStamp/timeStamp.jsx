import React from "react"

function formatDate(timestamp) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }

  const formattedDate = new Date(timestamp).toLocaleDateString(
    undefined,
    options
  )
  return formattedDate
}

function TimeStamp({ timestamp }) {
  return (
    <div>
      <p className="text-gray-500 text-xl">
        {formatDate(timestamp)} {/* Use the "timestamp" prop here */}
      </p>
    </div>
  )
}

export default TimeStamp
