import { FaRegBookmark, FaShareAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { deleteArticle } from "../api/api";
import { useAuth } from "../context/AuthContext";

function UserArticleCard({ article, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!article) return null;

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Delete this article?");
    if (!confirmDelete) return;

    try {
      await deleteArticle(article.id);
      onDelete?.(article.id);
    } catch {
      alert("Failed to delete article");
    }
  };

  const isOwner = user?.id === article?.author?.id;

  return (
    <div
      className="
        flex flex-col
        border-b
        pb-4 sm:pb-6
        mb-4 sm:mb-6
        cursor-pointer
        relative
      "
    >

      {/* DELETE BUTTON */}
      {isOwner && (
        <button
          onClick={handleDelete}
          className="
            absolute
            top-2 right-2
            p-1.5 sm:p-2
            rounded-full
            bg-white shadow
            hover:bg-red-100
          "
        >
          <FaTrash className="text-red-500 text-xs sm:text-sm" />
        </button>
      )}

      {/* COVER IMAGE */}
      <div
        onClick={() => navigate(`/article/${article.id}`)}
        className="
          w-full
          h-32 sm:h-40 md:h-44
          mb-3 sm:mb-4
        "
      >
        <img
          src={article?.coverImage || "https://via.placeholder.com/600x300"}
          alt="cover"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-1.5 sm:gap-2">

        {/* META */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span className="font-medium text-black">
            {user?.name || "You"}
          </span>
          <span>•</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>

        {/* TITLE */}
        <h2
          onClick={() => navigate(`/article/${article.id}`)}
          className="
            text-base sm:text-lg md:text-xl
            font-bold
            leading-snug
            hover:underline
            line-clamp-2
          "
        >
          {article?.title || "Untitled"}
        </h2>

        {/* SUBTITLE */}
        {article?.subtitle && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {article.subtitle}
          </p>
        )}

        {/* READING TIME */}
        <span className="text-xs sm:text-sm text-gray-500">
          {article?.readingTime || 1} min read
        </span>

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-2 sm:mt-3 text-gray-500">

          <div className="flex gap-5 sm:gap-6 text-sm sm:text-base">
            <FaRegBookmark className="cursor-pointer hover:text-black" />
            <FaShareAlt className="cursor-pointer hover:text-black" />
          </div>

        </div>

      </div>
    </div>
  );
}

export default UserArticleCard;