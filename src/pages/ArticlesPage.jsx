import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import RightSidebar from "../components/RightSidebar.jsx";
import { getRecentArticles } from "../api/api";
import { useToast } from "../hooks/useToast.jsx";
import ScrambloLoader from "../components/ScrambloLoader";

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await getRecentArticles();
      setArticles(res?.data?.content || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load articles", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-12">

      <div className="w-full lg:w-[65%]">
        <div className="w-full max-w-full lg:max-w-[650px]">

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Recent Articles
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
            Discover recent articles from writers on any topic
          </p>

          {loading ? (
            <div className="w-full flex justify-center py-12 sm:py-16">
              <ScrambloLoader size="lg" />
            </div>
          ) : articles.length === 0 ? (
            <p className="text-gray-400 text-sm sm:text-base">
              No articles available.
            </p>
          ) : (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}

        </div>
      </div>

      <div className="hidden lg:block lg:w-[35%]">
        <RightSidebar />
      </div>

      {ToastComponent}
    </div>
  );
}

export default ArticlesPage;