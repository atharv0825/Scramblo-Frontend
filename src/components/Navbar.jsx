import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { useEffect, useState } from "react";
import { getUnreadCount } from "../api/api";
import ProfileDropdown from "./ProfileDropdown";
import { FaBell, FaRegBell, FaSearch } from "react-icons/fa";
import NotificationDropdown from './NotificationDropdown';

function Navbar({ isDark = false }) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false); // ✅ mobile search toggle

  useEffect(() => {
    if (isLoggedIn) fetchUnread();
    else setUnreadCount(0);
  }, [isLoggedIn]);

  const fetchUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data);
    } catch (err) {
      console.error("Error fetching unread count", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer"
          >
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}>
              Scramblo.
            </h1>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden sm:block flex-1 max-w-md px-4">
            <div className="relative">
              <img
                src={assets.iconSearch}
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    navigate(`/search?q=${search}`);
                  }
                }}
                placeholder="Search Scramblo"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* 🔍 MOBILE SEARCH BUTTON */}
            <button
              onClick={() => setShowSearch(prev => !prev)}
              className="sm:hidden p-2 rounded-full bg-gray-100"
            >
              <FaSearch />
            </button>

            {isLoggedIn ? (
              <>
                {/* 🔔 Notifications */}
                <div className="relative">
                  <div
                    onClick={() => setShowNotifications(prev => !prev)}
                    className="cursor-pointer"
                  >
                    {unreadCount > 0 ? (
                      <FaBell className="text-lg sm:text-xl text-black" />
                    ) : (
                      <FaRegBell className="text-lg sm:text-xl text-gray-600" />
                    )}

                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>

                  {showNotifications && (
                    <NotificationDropdown onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                <div className="hidden lg:block">
                  <Button
                    onClick={() => navigate('/write')}
                    variant="outline"
                    size="sm"
                  >
                    Create Post
                  </Button>
                </div>
                {/* 👤 Profile */}
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(prev => !prev)}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src={
                        user?.profileImage ||
                        `https://ui-avatars.com/api/?name=${user?.name || "User"}`
                      }
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {showDropdown && (
                    <ProfileDropdown
                      user={user}
                      onClose={() => setShowDropdown(false)}
                    />
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} size="sm">
                Get Started
              </Button>
            )}

          </div>
        </div>

        {/* 📱 MOBILE SEARCH INPUT */}
        {showSearch && (
          <div className="sm:hidden pb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  navigate(`/search?q=${search}`);
                  setShowSearch(false);
                }
              }}
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm rounded-full bg-gray-100 focus:outline-none"
            />
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;