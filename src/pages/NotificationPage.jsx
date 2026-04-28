import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "../api/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async (n) => {
    try {
      if (!n.read) {
        await markNotificationAsRead(n.id);
      }

      // update UI instantly
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, read: true } : item
        )
      );

      // 🔥 FULL NAVIGATION LOGIC
      if (n.type === "FOLLOW" && n.actorId) {
        navigate(`/profile/${n.actorId}`);
      }
      else if (n.articleId) {
        navigate(`/article/${n.articleId}`);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-6 px-4">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">
          Notifications
        </h1>

        {/* EMPTY STATE */}
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No notifications yet
          </div>
        ) : (

          <div className="flex flex-col gap-2">

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-150
                  hover:bg-gray-50
                  ${!n.read ? "bg-gray-50" : ""}
                `}
              >

                {/* 🔵 UNREAD DOT */}
                {!n.read && (
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                )}

                {/* CONTENT */}
                <div className="flex-1">

                  <p className={`text-sm leading-snug ${!n.read
                      ? "font-medium text-gray-900"
                      : "text-gray-600"
                    }`}>
                    {n.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default NotificationPage;