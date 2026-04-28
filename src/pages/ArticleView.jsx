import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById, toggleLike, toggleBookmark } from "../api/api";
import { FaHeart, FaBookmark, FaComment, FaEye } from "react-icons/fa";
import CommentSection from "../components/CommentSection";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AISummary from "../components/AISummary";
import { useToast } from "../hooks/useToast.jsx";
import ScrambloLoader from "../components/ScrambloLoader";
import RotatingAd from "../components/RotatingAd.jsx";
import { ads } from "../config/adsConfig";

function ArticleView() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const res = await getArticleById(id);
            setArticle(res.data);
        } catch (err) {
            showToast("Failed to load article", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);

        try {
            const res = await toggleLike(id);
            const likedFromServer = res.data.liked;

            setArticle((prev) => ({
                ...prev,
                liked: likedFromServer,
                clapCount: likedFromServer
                    ? prev.clapCount + 1
                    : Math.max(0, prev.clapCount - 1),
            }));
        } catch {
            showToast("Failed to update like", "error");
        } finally {
            setLikeLoading(false);
        }
    };

    const handleBookmark = async () => {
        try {
            const res = await toggleBookmark(id);
            const bookmarkedFromServer = res.data.bookmarked;

            setArticle((prev) => ({
                ...prev,
                bookmarked: bookmarkedFromServer,
            }));

            showToast(
                bookmarkedFromServer
                    ? "Saved to bookmarks"
                    : "Removed from bookmarks",
                bookmarkedFromServer ? "success" : "info"
            );
        } catch {
            showToast("Bookmark action failed", "error");
        }
    };

    if (loading) return <ScrambloLoader size="lg" fullScreen />;
    if (!article) return <div className="text-center mt-10">Article not found</div>;

    return (
        <div className="flex flex-col">
            <Navbar />

            <div
                className="
                    flex flex-col lg:flex-row
                    justify-center
                    gap-6 md:gap-8
                    px-4 sm:px-6 md:px-8
                    py-6 md:py-10
                "
            >

                {/* ARTICLE */}
                <div className="w-full lg:w-[65%]">

                    <AISummary article={article} />

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                        {article.title}
                    </h1>

                    {/* Subtitle */}
                    {article.subtitle && (
                        <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-4">
                            {article.subtitle}
                        </p>
                    )}

                    {/* Author + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                        {/* AUTHOR */}
                        <div
                            onClick={() => navigate(`/profile/${article.author.id}`)}
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                <img
                                    src={
                                        article.author?.profileImage ||
                                        `https://ui-avatars.com/api/?name=${article.author?.name}`
                                    }
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <p className="font-medium text-sm sm:text-base">
                                    {article.author?.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {formatDate(article.createdAt)} • {article.readingTime} min read
                                </p>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm">
                                <FaEye />
                                <span>{article.viewCount || 0}</span>
                            </div>

                            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm">
                                <FaComment />
                                <span>{article.commentCount || 0}</span>
                            </div>

                            <button
                                onClick={handleLike}
                                disabled={likeLoading}
                                className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition
                                ${article.liked
                                        ? "bg-red-100 text-red-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                <FaHeart className={article.liked ? "text-red-500" : ""} />
                                <span>{article.clapCount}</span>
                            </button>

                            <button
                                onClick={handleBookmark}
                                className={`p-2 rounded-full
                                ${article.bookmarked
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                <FaBookmark />
                            </button>
                        </div>

                    </div>

                    {/* Cover */}
                    {article.coverImage && (
                        <img
                            src={article.coverImage}
                            alt="cover"
                            className="
                                w-full
                                h-[220px] sm:h-[300px] md:h-[400px]
                                object-cover
                                rounded-lg
                                mb-6 md:mb-8
                            "
                        />
                    )}

                    {/* Content */}
                    <div
                        className="prose max-w-none text-sm sm:text-base"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <CommentSection articleId={id} />
                </div>

                {/* SIDEBAR */}
                <div className="hidden lg:block w-[30%] sticky top-24 h-fit">
                    <RotatingAd ads={ads} />
                </div>
            </div>

            {ToastComponent}
        </div>
    );
}

export default ArticleView;