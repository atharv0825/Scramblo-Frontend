import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    console.log("🔥 URL:", window.location.href);
    console.log("🔥 TOKEN FROM URL:", token);

    const isNewUser = searchParams.get('newUser') === 'true';

    if (token) {
      login(token);
      navigate(isNewUser ? '/setup-profile' : '/dashboard');
    } else {
      console.error("No JWT token found");
      navigate('/auth');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <p className="text-gray-500 animate-pulse font-medium tracking-wide">
        Securely verifying credentials...
      </p>
    </div>
  );
}

export default OAuthCallback;
