import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Editor from "../components/Editor";
import { useToast } from "../hooks/useToast.jsx"; // ✅ added

function CreatePost() {
  const location = useLocation();
  const prevData = location.state || {};

  const [title, setTitle] = useState(prevData.title || "");
  const [content, setContent] = useState(prevData.content || "");

  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast(); // ✅ added

  const handleNext = () => {
    // ✅ VALIDATION
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }

    // TipTap content check (important)
    const isEmptyContent =
      !content || content === "<p></p>" || content.trim() === "";

    if (isEmptyContent) {
      showToast("Content cannot be empty", "error");
      return;
    }

    // ✅ NAVIGATE ONLY IF VALID
    navigate("/checkout", {
      state: {
        title,
        content,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      <Navbar />

      {/* HEADER */}
      <div
        className="
      sticky top-0 z-40
      flex items-center justify-between
      max-w-2xl mx-auto
      px-4 sm:px-6
      py-2 sm:py-3
      bg-gray-50/90 dark:bg-[#0a0a0a]/90
      backdrop-blur
    "
      >
        <h1 className="text-sm sm:text-base md:text-lg font-semibold">
          Create Post
        </h1>

        <button
          onClick={handleNext}
          className="
        bg-black text-white
        px-4 sm:px-5
        py-2 sm:py-2.5
        text-sm sm:text-base
        rounded-md
        active:scale-95 transition
      "
        >
          Next
        </button>
      </div>

      {/* CONTENT */}
      <div
        className="
      flex justify-center
      mt-4 sm:mt-6 md:mt-8
      px-4 sm:px-6
    "
      >
        <div className="w-full max-w-2xl mx-auto">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="
          w-full
          text-xl sm:text-2xl md:text-3xl
          font-serif
          outline-none
          bg-transparent
          mb-3 sm:mb-4
        "
          />

          <Editor content={content} onChange={setContent} />

        </div>
      </div>

      {ToastComponent}
    </div>
  );
}

export default CreatePost;