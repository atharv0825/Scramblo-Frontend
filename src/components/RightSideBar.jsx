import React from "react";
import { useNavigate } from "react-router-dom";

function RightSidebar() {
  const topics = ["Tech", "Science", "Health", "Travel", "Food"];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 sticky top-20 self-start">

      {/* Topics */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Recommended topics</h3>

        <div className="grid grid-cols-3 gap-2">
          {topics.map((topic, index) => (
            <button
              key={index}
              onClick={() => navigate(`/search?q=${topic}`)} 
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-2 py-1 rounded-full text-xs text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {topic}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3 cursor-pointer hover:underline">
          Explore more topics
        </p>
      </div>

      {/* Advertisement */}
      <div className="bg-gradient-to-r from-pink-500 to-blue-600 p-6 rounded-xl text-white text-center">
        <h2 className="text-lg font-bold">scramblo.</h2>
        <p className="text-xs mt-1 opacity-80">Grow your voice</p>
      </div>

      {/* CTA */}
      <div>
        <h3 className="font-semibold text-sm">
          Spread the Word, Amplify Your Voice!
        </h3>

        <p className="text-xs text-gray-600 mt-2">
          Help us grow and empower more writers by sharing Scramblo.
        </p>

        <button className="mt-3 bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-full text-sm w-fit">
          Share Scramblo
        </button>
      </div>

    </div>
  );
}

export default RightSidebar;