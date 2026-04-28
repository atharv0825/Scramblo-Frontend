import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArticleCard from "../components/ArticleCard";
import AdvertisementCard from "../components/AdvertisementCard";
import { searchArticles } from "../api/api";
import { useNavigate } from "react-router-dom";
import RotatingAd from "../components/RotatingAd.jsx";
import { ads } from "../config/adsConfig";

function SearchPage() {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    if (query) fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await searchArticles(query, 0, 10);
      setArticles(res.data.content || []);

    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <div className="flex justify-center gap-8 px-4 py-6">

        {/* LEFT */}
        <div className="w-full lg:w-[60%]">

          {/* 🔥 SEARCH TITLE */}
          <h2 className="text-lg font-semibold mb-4">
            Results for "{query}"
          </h2>

          {/* ARTICLES */}
          {loading ? (
            <p className="text-gray-500">Searching...</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-500">No results found</p>
          ) : (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block w-[25%] sticky top-24 h-fit">

          <RotatingAd ads={ads} />

        </div>

      </div>
    </div>
  );
}

export default SearchPage;