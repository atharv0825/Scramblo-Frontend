import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ArticleCard from "../components/ArticleCard";
import { getFollowingFeed, getHybridFeed } from "../api/api";
import AdvertisementCard from "../components/AdvertisementCard";
import { useToast } from "../hooks/useToast.jsx";
import ScrambloLoader from "../components/ScrambloLoader";
import { ads } from "../config/adsConfig";
import RotatingAd from "../components/RotatingAd.jsx";

function Dashboard() {

  

  const [activeTab, setActiveTab] = useState("forYou");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      let res;

      if (activeTab === "forYou") {
        res = await getHybridFeed(0, 10);
      } else {
        res = await getFollowingFeed(0, 10);
      }

      setArticles(res.data.content || []);

    } catch (err) {
      console.error("Error fetching articles", err);
      showToast("Failed to load feed", "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <div className="flex justify-center gap-8 px-4 py-6">

        {/* LEFT FEED */}
        <div className="w-full lg:w-[60%]">

          {/* TABS */}
          <div className="flex justify-center gap-8 mb-2 sticky top-16 bg-white z-10">

            <button
              onClick={() => setActiveTab("forYou")}
              className={`py-1 text-sm font-medium ${activeTab === "forYou"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
                }`}
            >
              For You
            </button>

            <button
              onClick={() => setActiveTab("following")}
              className={`py-3 text-sm font-medium ${activeTab === "following"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
                }`}
            >
              Following
            </button>

          </div>

          {/* ARTICLES */}
          <div className="px-2">

            {loading ? (
              <div className="flex justify-center py-10">
                <ScrambloLoader size="md" />
              </div>
            ) : articles.length === 0 ? (
              <p className="text-gray-500 mt-4">No articles found</p>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block w-[25%] sticky top-24 h-fit">

          <RotatingAd ads={ads} />

        </div>

      </div>

      {/* ✅ Toast */}
      {ToastComponent}
    </div>
  );
}

export default Dashboard;