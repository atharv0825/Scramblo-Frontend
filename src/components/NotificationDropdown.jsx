import { useEffect, useState, useRef } from "react";
import { getNotifications, markNotificationAsRead } from "../api/api";
import { useNavigate } from "react-router-dom";

function NotificationDropdown({ onClose }) {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const dropdownRef = useRef();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };

        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    const handleClick = async (n) => {
        try {
            if (!n.read) {
                await markNotificationAsRead(n.id);
            }

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === n.id ? { ...item, read: true } : item
                )
            );

            if (n.type === "FOLLOW" && n.actorId) {
                navigate(`/profile/${n.actorId}`);
            } else if (n.articleId) {
                navigate(`/article/${n.articleId}`);
            }

            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            ref={dropdownRef}
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="
  absolute right-0 mt-2
  w-[85vw] sm:w-[300px] md:w-80
  max-w-xs
  bg-white
  rounded-xl sm:rounded-2xl
  shadow-xl
  overflow-hidden
  z-50
"
        >

            {/* HEADER */}
            <div className="px-4 py-3 text-sm font-semibold text-gray-800 border-b">
                Notifications
            </div>

            {/* LIST */}
            {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">
                    No notifications yet
                </p>
            ) : (
                <div className="max-h-72 sm:max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => handleClick(n)}
                            className={`
                                px-4 py-3 cursor-pointer
                                flex items-start gap-2
                                hover:bg-gray-50 transition
                                ${!n.read ? "bg-gray-50" : ""}
                            `}
                        >
                            {!n.read && (
                                <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                            )}

                            <p className={`
                                text-xs sm:text-sm leading-snug break-words
                                ${!n.read ? "font-medium text-gray-900" : "text-gray-600"}
                            `}>
                                {n.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* FOOTER */}
            <div
                onClick={() => {
                    navigate("/notifications");
                    onClose();
                }}
                className="px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
                View all notifications
            </div>
        </div>
    );
}

export default NotificationDropdown;