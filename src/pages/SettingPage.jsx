import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getPreferences, updatePreferences } from "../api/api";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPrefs = async () => {
      try {
        const res = await getPreferences();
        if (isMounted) {
          setPrefs(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch preferences", err);
        if (isMounted) setError("Failed to load preferences");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPrefs();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (key) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev?.[key],
    }));
  };

  const handleSave = async () => {
    if (!prefs) return;

    try {
      setSaving(true);
      await updatePreferences(prefs);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update preferences", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <div className="max-w-xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* EDIT PROFILE */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4 flex justify-between items-center">
          <span className="font-medium">Edit Profile</span>
          <button
            onClick={() => navigate("/edit-profile")}
            className="text-green-600 font-medium"
          >
            Edit
          </button>
        </div>

        {/* NOTIFICATION */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4 flex justify-between items-center">
          <span className="font-medium">Notification Preferences</span>
          <button
            onClick={() => setShowModal(true)}
            className="text-green-600 font-medium"
          >
            Manage
          </button>
        </div>

        {/* LOGOUT */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex justify-between items-center">
          <span className="font-medium text-red-600">Logout</span>
          <button
            onClick={handleLogout}
            className="text-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && prefs && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)} // ✅ close on outside click
        >
          <div
            className="bg-white dark:bg-gray-900 w-[90%] max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()} // ✅ prevent closing inside
          >
            <h2 className="text-lg font-semibold mb-4">
              Notification Preferences
            </h2>

            {[
              { key: "newPost", label: "New Post" },
              { key: "comments", label: "Comments" },
              { key: "likes", label: "Likes" },
              { key: "summaryReady", label: "Summary Ready" },
              { key: "emailEnabled", label: "Email Notifications" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex justify-between items-center mb-3"
              >
                <span>{item.label}</span>

                <button
                  onClick={() => handleToggle(item.key)}
                  className={`w-12 h-6 rounded-full transition ${
                    prefs?.[item.key] ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transform transition ${
                      prefs?.[item.key]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;