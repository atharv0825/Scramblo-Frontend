import { useEffect, useState } from "react";
import { getTrendingArticles } from "../api/api";
import TrendingCard from "./TrendingCard";
import ScrambloLoader from "./ScrambloLoader";

function TrendingSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await getTrendingArticles(0, 5);
      setArticles(res.data.content || []);
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-black text-white
        px-4 sm:px-6 md:px-10 lg:px-16
        py-8 sm:py-10 md:py-12
      "
    >

      {/* HEADER */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          🔥 Trending on Scramblo
        </h2>

        <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
          Discover trending stories from writers
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="w-full flex justify-center py-12 sm:py-16">
          <ScrambloLoader size="lg" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No trending articles yet
        </p>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6 sm:gap-8 md:gap-10
          "
        >
          {articles.map((article, index) => (
            <TrendingCard
              key={article.id}
              article={article}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingSection;