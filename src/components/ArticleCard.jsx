import { FaBookmark, FaRegBookmark, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useToast } from "../hooks/useToast.jsx";
import { toggleBookmark } from "../api/api";
import { useAuth } from "../context/AuthContext";

function ArticleCard({ article }) {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const { user } = useAuth();

  if (!article) return null;

  const bookmarked = user?.bookmarks?.includes(article.id);

  const handleNavigate = () => {
    navigate(`/article/${article.id}`);
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();

    try {
      const res = await toggleBookmark(article.id);
      const state = res.data?.bookmarked;

      showToast(
        state ? "Saved to bookmarks" : "Removed from bookmarks",
        state ? "success" : "info"
      );
    } catch {
      showToast("Bookmark failed", "error");
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/article/${article.id}`
      );

      showToast("Link copied to clipboard", "info");
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  return (
    <div className="flex flex-col border-b pb-6 mb-6 cursor-pointer">
      <div onClick={handleNavigate} className="w-full h-40 mb-4">
        <img
          src={article?.coverImage || "https://via.placeholder.com/600x300"}
          alt="cover"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium text-black">
            {article?.author?.name || "Unknown"}
          </span>
          <span>•</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>

        <h2
          onClick={handleNavigate}
          className="text-xl font-bold hover:underline"
        >
          {article?.title || "Untitled"}
        </h2>

        {article?.subtitle && (
          <p className="text-gray-600 line-clamp-2">
            {article.subtitle}
          </p>
        )}

        <span className="text-sm text-gray-500">
          {article?.readingTime || 1} min read
        </span>

        <div className="flex items-center justify-between mt-3 text-gray-500 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition hover:scale-105
              ${bookmarked
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            <FaShareAlt
              onClick={handleShare}
              className="cursor-pointer hover:text-black"
            />
          </div>
        </div>
      </div>

      {ToastComponent}
    </div>
  );
}

export default ArticleCard;