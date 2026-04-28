import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import TrendingSection from '../components/TrendingSection'; // ✅ FIX
import ArticlesPage from './ArticlesPage';

function Home({ isDark }) {
  return (
    <div className="relative flex flex-col">
      <Navbar isDark={isDark} />
      <Hero />
      <TrendingSection /> 
      <ArticlesPage/>
    </div>
  );
}

export default Home;