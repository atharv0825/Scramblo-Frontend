import { formatDate } from "../utils/formatDate";

function CommentItem({ comment }) {
    return (
        <div
            className="
                flex gap-2 sm:gap-3
                py-3 sm:py-4
            "
        >

            {/* AVATAR */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={
                        comment.profileImage ||
                        "https://ui-avatars.com/api/?name=" + comment.username
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">

                {/* NAME + TIME */}
                <div
                    className="
                        flex items-center flex-wrap
                        gap-1 sm:gap-2
                        text-xs sm:text-sm
                    "
                >
                    <p className="font-medium truncate max-w-[120px] sm:max-w-none">
                        {comment.username}
                    </p>

                    <span className="text-gray-400">•</span>

                    <span className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>

                {/* COMMENT TEXT */}
                <p
                    className="
                        text-gray-800
                        text-xs sm:text-sm
                        mt-1
                        leading-relaxed
                        break-words
                    "
                >
                    {comment.content}
                </p>

            </div>
        </div>
    );
}

export default CommentItem;