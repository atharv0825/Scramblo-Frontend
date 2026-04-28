import { useEffect, useState } from "react";
import { getComments } from "../api/api";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import ScrambloLoader from "./ScrambloLoader";

function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const res = await getComments(articleId);
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div className="mt-8 sm:mt-10 md:mt-12">

      {/* HEADER */}
      <div
        className="
          flex flex-col sm:flex-row
          sm:items-center sm:justify-between
          gap-1 sm:gap-0
          mb-4 sm:mb-6
        "
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Responses ({comments.length})
        </h2>

        <span className="text-xs sm:text-sm text-gray-400">
          Join the discussion
        </span>
      </div>

      {/* INPUT */}
      <CommentInput
        articleId={articleId}
        onCommentAdded={handleNewComment}
      />

      {/* LIST */}
      <div className="mt-6 sm:mt-8">

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-4 sm:py-6">
            <ScrambloLoader size="sm" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && comments.length === 0 && (
          <p className="text-gray-500 text-xs sm:text-sm mt-4">
            No responses yet. Be the first to comment.
          </p>
        )}

        {/* COMMENTS */}
        {!loading &&
          comments.map((comment, index) => (
            <div key={comment.id}>

              <CommentItem comment={comment} />

              {/* DIVIDER */}
              {index !== comments.length - 1 && (
                <div className="border-b border-gray-200 mt-3 sm:mt-4"></div>
              )}

            </div>
          ))}
      </div>
    </div>
  );
}

export default CommentSection;