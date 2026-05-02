import React from 'react'

function page() {
  return (
    <div>
       <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Public Profile Link</h1>

      {/* Input Section */}
      <div className="w-full max-w-2xl">
        <p className="text-red-500 mb-2">
          Send Anonymous Message to @hc
        </p>

        <textarea
          placeholder="Type your message..."
          className="w-full border border-gray-400 rounded-lg p-4 h-28 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <p className="text-red-500 text-sm mt-1">
          Content must be at least 10 characters.
        </p>

        {/* Button */}
        <div className="flex justify-center mt-4">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
            Send it
          </button>
        </div>
      </div>

      {/* Suggest Messages */}
      <div className="w-full max-w-2xl mt-10">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md mb-4">
          Suggest Messages
        </button>

        <p className="mb-3 text-gray-700">
          Click on any message below to select it.
        </p>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="border p-3 rounded-md cursor-pointer hover:bg-gray-100">
            What's your favorite movie?
          </div>

          <div className="border p-3 rounded-md cursor-pointer hover:bg-gray-100">
            Do you have any pets?
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default page

