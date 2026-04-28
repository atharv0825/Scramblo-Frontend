import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfileDropdown({ onClose }) {
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate("/auth");
    onClose();
  };

  const handleNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
    onClose();
  };

  if (!user) return null;

  return (
    <div
      ref={dropdownRef}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-2 z-50 border border-gray-200 dark:border-gray-700"
    >
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-sm">{user?.name || "User"}</p>
        <p className="text-xs text-gray-500 truncate">
          {user?.email || ""}
        </p>
      </div>

      <div className="py-2 text-sm">
        <button
          type="button"
          onClick={() => user?.id && handleNavigate(`/profile/${user.id}`)}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Profile
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/dashboard")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Feed
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/write")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Write
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/settings")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Settings
        </button>

        <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

        <button
          type="button"
          onClick={handleLogout}
          className="block w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;