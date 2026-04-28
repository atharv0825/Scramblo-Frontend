import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date";

function TrendingCard({ article, index }) {
  const navigate = useNavigate();

  if (!article || !article.author) return null;

  return (
    <div
      onClick={() => navigate(`/article/${article.id}`)}
      className="
        flex gap-3 sm:gap-4 items-start
        cursor-pointer transition hover:opacity-80
      "
    >
      {/* INDEX */}
      <div
        className={`
          text-3xl sm:text-4xl md:text-5xl font-bold
          ${index === 0 ? "text-yellow-400" : "text-gray-600"}
        `}
      >
        #{index + 1}
      </div>

      {/* CONTENT */}
      <div className="flex-1">

        {/* AUTHOR */}
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <img
            src={article.author.profileImage || "https://via.placeholder.com/40"}
            alt="author"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
          />
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {article.author.name}
          </p>
        </div>

        {/* TITLE */}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-snug line-clamp-2 hover:underline">
          {article.title}
        </h3>

        {/* SUBTITLE */}
        {article.subtitle && (
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mt-1">
            {article.subtitle}
          </p>
        )}

        {/* META */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
          {formatDate(article.createdAt)} • {article.readingTime || 5} min read
        </p>
      </div>
    </div>
  );
}

export default TrendingCard;