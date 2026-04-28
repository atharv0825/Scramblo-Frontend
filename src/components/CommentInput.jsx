import { useState } from "react";
import { createComment } from "../api/api";
import { useToast } from "../hooks/useToast.jsx";
import { useAuth } from "../context/AuthContext";

function CommentInput({ articleId, onCommentAdded }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);

    const { user } = useAuth();
    const { showToast, ToastComponent } = useToast();

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setLoading(true);

        try {
            const res = await createComment({
                content,
                articleId,
            });

            setContent("");
            setFocused(false);
            onCommentAdded(res.data);

            showToast("Comment posted successfully", "success");

        } catch {
            showToast("Failed to post comment", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                bg-white rounded-xl sm:rounded-2xl
                shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                p-3 sm:p-4 md:p-5
                transition-all duration-300
            "
        >

            <div className="flex gap-3 sm:gap-4 items-start">

                {/* AVATAR */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                        src={
                            user?.profileImage ||
                            "https://ui-avatars.com/api/?name=" + user?.name
                        }
                        alt="profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INPUT AREA */}
                <div className="flex-1 min-w-0">

                    <div
                        className={`
                            rounded-lg sm:rounded-xl
                            p-2.5 sm:p-3
                            transition bg-white
                            ${focused
                                ? "shadow-md ring-1 ring-gray-200"
                                : "shadow-sm"
                            }
                        `}
                    >
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={() => setFocused(true)}
                            placeholder="Share your thoughts..."
                            rows={3}
                            className="
                                w-full resize-none
                                text-sm sm:text-base
                                outline-none bg-transparent
                            "
                        />
                    </div>

                    {(focused || content) && (
                        <div
                            className="
                                flex flex-col sm:flex-row
                                gap-2 sm:gap-3
                                justify-between items-start sm:items-center
                                mt-3
                            "
                        >

                            {/* INFO TEXT */}
                            <div className="text-xs text-gray-400">
                                Be respectful. Keep it constructive.
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 w-full sm:w-auto justify-end">

                                <button
                                    onClick={() => {
                                        setContent("");
                                        setFocused(false);
                                    }}
                                    className="
                                        px-3 py-1.5
                                        text-xs sm:text-sm
                                        rounded-full
                                        bg-gray-100 hover:bg-gray-200
                                        transition
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !content.trim()}
                                    className={`
                                        px-4 py-1.5
                                        text-xs sm:text-sm
                                        rounded-full font-medium
                                        transition
                                        ${content.trim()
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }
                                    `}
                                >
                                    {loading ? "Posting..." : "Post"}
                                </button>

                            </div>
                        </div>
                    )}

                </div>
            </div>

            {ToastComponent}
        </div>
    );
}

export default CommentInput;