import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from './AnimatedBackground';

function Hero() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleStartWriting = () => {
    if (isLoggedIn) {
      navigate('/write');
    } else {
      navigate('/auth');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black"
    >
      {/* 🔥 Animated Blob Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>


      {/* Overlay (for readability) */}
      <div className="absolute inset-0 z-10 bg-white/40 dark:bg-black/40"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Words. Voice. <span className="text-orange-500">Growth.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Discover ideas, insights, and voices from writers across every domain
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
          >
            <Button onClick={handleStartWriting} size="lg" color="primary" variant="solid" className="w-full sm:w-auto">
              Start Writing
            </Button>
            <Button onClick={() => navigate('/dashboard')} size="lg" color="secondary" variant="outline" className="w-full sm:w-auto">
              Explore Articles
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default Hero;