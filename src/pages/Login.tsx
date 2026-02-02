import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Floating blob component
const FloatingBlob: React.FC<{ 
  className: string; 
  delay?: string;
}> = ({ className, delay = '0s' }) => (
  <div 
    className={`absolute rounded-full filter blur-3xl animate-pulse-glow ${className}`}
    style={{ animationDelay: delay }}
  />
);

// Floating particle component
const Particle: React.FC<{
  className: string;
  delay?: string;
}> = ({ className, delay = '0s' }) => (
  <div 
    className={`absolute w-1 h-1 bg-white/30 rounded-full animate-float ${className}`}
    style={{ animationDelay: delay }}
  />
);

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/', { replace: true });
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      
      {/* Floating Blobs */}
      <FloatingBlob 
        className="w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 -top-48 -left-48" 
        delay="0s"
      />
      <FloatingBlob 
        className="w-80 h-80 bg-gradient-to-br from-pink-500/30 to-rose-500/30 top-1/4 -right-40" 
        delay="1s"
      />
      <FloatingBlob 
        className="w-72 h-72 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 -bottom-36 left-1/4" 
        delay="2s"
      />
      <FloatingBlob 
        className="w-64 h-64 bg-gradient-to-br from-violet-500/30 to-purple-500/30 bottom-1/4 right-1/4" 
        delay="1.5s"
      />

      {/* Floating Particles */}
      <Particle className="top-20 left-20" delay="0s" />
      <Particle className="top-40 right-32" delay="0.5s" />
      <Particle className="bottom-32 left-40" delay="1s" />
      <Particle className="top-1/3 left-1/3" delay="1.5s" />
      <Particle className="bottom-1/4 right-20" delay="2s" />
      <Particle className="top-1/2 right-1/3" delay="0.3s" />
      <Particle className="bottom-1/3 left-1/4" delay="0.8s" />
      <Particle className="top-1/4 right-1/4" delay="1.3s" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8 text-center border-b border-white/10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CoC Analytics</h1>
            <p className="text-white/70">Clash of Clans Dashboard</p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-12 pr-12 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm">
                Demo credentials: <span className="text-white/70 font-mono">bill / bill</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          Clash of Clans Analytics Dashboard
        </p>
      </div>
    </div>
  );
};

export default Login;
