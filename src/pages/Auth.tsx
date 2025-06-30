import React, { useState, useEffect } from 'react';
import { Mail, Phone, ChevronDown, Sparkles } from 'lucide-react';
import { AuthService } from '../lib/auth';

type AuthMethod = 'email' | 'phone';
type AuthAction = 'signin' | 'signup';

interface AuthProps {
  // Future props can be added here
}

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
];

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s',
          }}
        />
      ))}
    </div>
  );
};

// Breathing light effect
const BreathingLight = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div 
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
      style={{
        background: 'radial-gradient(circle, rgba(186, 155, 230, 0.3) 0%, transparent 70%)',
        animation: 'breathe 6s ease-in-out infinite',
      }}
    />
  </div>
);

export const Auth: React.FC<AuthProps> = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [authAction, setAuthAction] = useState<AuthAction>('signin');
  const [usePassword, setUsePassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  // Reset to password authentication when auth method or action changes
  useEffect(() => {
    setUsePassword(true);
  }, [authMethod, authAction]);

  const handleEmailAuth = async (useMagicLink: boolean = false) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (useMagicLink) {
        const result = await AuthService.sendMagicLink(email);
        if (result.success) {
          setSuccess('Magic link sent! Check your email and click the link to continue.');
        } else {
          setError(result.error || 'Failed to send magic link');
        }
      } else {
        const result = authAction === 'signin' 
          ? await AuthService.signInWithEmail(email, password)
          : await AuthService.signUpWithEmail(email, password);
          
        if (result.success) {
          setSuccess(authAction === 'signin' ? 'Welcome back! Redirecting!' : 'Account created! Please confirm your email.');
        } else {
          setError(result.error || 'Authentication failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
      const result = await AuthService.sendPhoneOTP(fullPhoneNumber);
      
      if (result.success) {
        setShowVerification(true);
        setSuccess('Verification code sent to your device');
      } else {
        // Check if it's an SMS configuration error
        if (result.error?.includes('unavailable') || result.error?.includes('not configured')) {
          setError(result.error);
          // Auto-switch to email after showing error
          setTimeout(() => {
            setAuthMethod('email');
            setError('');
          }, 3000);
        } else {
          setError(result.error || 'Failed to send verification code');
        }
      }
    } catch (error) {
      setError('Network error. Please try again or use email authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
      const result = await AuthService.verifyPhoneOTP(fullPhoneNumber, verificationCode);
      
      if (result.success) {
        setSuccess('Phone verified! Redirecting...');
        // Navigation will be handled by the useAuth hook and useEffect above
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode);

  if (showVerification && authMethod === 'phone') {
    return (
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 45%, #23143e 0%, #1c1433 40%, #130c3c 70%, #0e062a 100%)',
        }}
      >
        {/* Grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)
            `,
            backgroundSize: '2px 2px',
          }}
        />
        
        <FloatingParticles />
        <BreathingLight />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div 
            className="w-full max-w-md rounded-3xl border backdrop-blur-xl"
            style={{
              background: 'rgba(19, 12, 60, 0.8)',
              borderColor: 'rgba(186, 155, 230, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="p-10">
              <div className="text-center mb-10">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Phone className="w-10 h-10" style={{ color: '#F5EFE8' }} />
                </div>
                <h1 
                  className="text-3xl font-semibold mb-3"
                  style={{ 
                    color: '#F5EFE8',
                    letterSpacing: '0.025em',
                    lineHeight: '1.6',
                  }}
                >
                  Verify Your Connection
                </h1>
                <p 
                  className="text-lg leading-relaxed"
                  style={{ color: 'rgba(245, 239, 232, 0.8)' }}
                >
                  We sent a verification code to {selectedCountryCode}{phoneNumber}
                </p>
              </div>

              {error && (
                <div 
                  className="mb-8 p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
                </div>
              )}

              {success && (
                <div 
                  className="mb-8 p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <p className="text-sm" style={{ color: '#10B981' }}>{success}</p>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{ color: 'rgba(245, 239, 232, 0.9)' }}
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="w-full text-center text-xl tracking-widest rounded-xl border transition-all duration-200 backdrop-blur-sm"
                    style={{
                      background: 'rgba(14, 6, 42, 0.6)',
                      borderColor: 'rgba(186, 155, 230, 0.3)',
                      color: '#F5EFE8',
                      padding: '12px 16px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#846FDA';
                      e.target.style.boxShadow = '0 0 0 3px rgba(132, 111, 218, 0.1)';
                      e.target.style.background = 'rgba(14, 6, 42, 0.8)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(186, 155, 230, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'rgba(14, 6, 42, 0.6)';
                    }}
                  />
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)',
                    color: '#F5EFE8',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                    animation: 'breathe 3s ease-in-out infinite',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(110%)';
                    e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(100%)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Enter Your Sanctuary'}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setShowVerification(false)}
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: '#BA9BE6' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C8B4EA'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#BA9BE6'}
                  >
                    Back to phone number
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 45%, #23143e 0%, #1c1433 40%, #130c3c 70%, #0e062a 100%)',
      }}
    >
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)
          `,
          backgroundSize: '2px 2px',
        }}
      />
      
      <FloatingParticles />
      <BreathingLight />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div 
          className="w-full max-w-md rounded-3xl border backdrop-blur-xl"
          style={{
            background: 'rgba(19, 12, 60, 0.8)',
            borderColor: 'rgba(186, 155, 230, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-6">
                <Sparkles 
                  className="w-8 h-8 mr-2" 
                  style={{ color: '#BA9BE6' }}
                />
                <h1 
                  className="text-3xl font-semibold"
                  style={{ 
                    color: '#F5EFE8',
                    letterSpacing: '0.025em',
                  }}
                >
                  {authAction === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
                </h1>
              </div>
              <p 
                className="text-lg leading-relaxed"
                style={{ color: 'rgba(245, 239, 232, 0.8)' }}
              >
                {authAction === 'signin' 
                  ? 'Welcome back to your inner space' 
                  : 'Create your emotional sanctuary'
                }
              </p>
            </div>

            {error && (
              <div 
                className="mb-8 p-4 rounded-xl border"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
              >
                <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
              </div>
            )}

            {success && (
              <div 
                className="mb-8 p-4 rounded-xl border"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                }}
              >
                <p className="text-sm" style={{ color: '#10B981' }}>{success}</p>
              </div>
            )}

            {/* Auth Method Selection */}
            <div className="mb-10">
              <div 
                className="flex rounded-xl p-1 backdrop-blur-sm"
                style={{ background: 'rgba(14, 6, 42, 0.4)' }}
              >
                <button
                  onClick={() => {
                    setAuthMethod('email');
                    setUsePassword(true);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    authMethod === 'email'
                      ? 'shadow-sm'
                      : ''
                  }`}
                  style={{
                    background: authMethod === 'email' 
                      ? 'rgba(19, 12, 60, 0.8)' 
                      : 'transparent',
                    color: authMethod === 'email' 
                      ? '#F5EFE8' 
                      : 'rgba(245, 239, 232, 0.7)',
                    borderColor: authMethod === 'email' 
                      ? 'rgba(186, 155, 230, 0.3)' 
                      : 'transparent',
                    border: authMethod === 'email' ? '1px solid' : 'none',
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    authMethod === 'phone'
                      ? 'shadow-sm'
                      : ''
                  }`}
                  style={{
                    background: authMethod === 'phone' 
                      ? 'rgba(19, 12, 60, 0.8)' 
                      : 'transparent',
                    color: authMethod === 'phone' 
                      ? '#F5EFE8' 
                      : 'rgba(245, 239, 232, 0.7)',
                    borderColor: authMethod === 'phone' 
                      ? 'rgba(186, 155, 230, 0.3)' 
                      : 'transparent',
                    border: authMethod === 'phone' ? '1px solid' : 'none',
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Phone
                </button>
              </div>
            </div>

            {/* Email Authentication */}
            {authMethod === 'email' && (
              <div className="space-y-8">
                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{ color: 'rgba(245, 239, 232, 0.9)' }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                     className="w-full rounded-xl border transition-all duration-200 backdrop-blur-sm"
                    style={{
                      background: 'rgba(14, 6, 42, 0.6)',
                      borderColor: 'rgba(186, 155, 230, 0.3)',
                      color: '#F5EFE8',
                      padding: '12px 40px 12px 16px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#846FDA';
                      e.target.style.boxShadow = '0 0 0 3px rgba(132, 111, 218, 0.1)';
                      e.target.style.background = 'rgba(14, 6, 42, 0.8)';
                      e.target.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(186, 155, 230, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'rgba(14, 6, 42, 0.6)';
                    }}
                    />
                    <Mail 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: 'rgba(245, 239, 232, 0.5)' }}
                    />
                  </div>
                </div>

                {usePassword && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{ color: 'rgba(245, 239, 232, 0.9)' }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border transition-all duration-200 backdrop-blur-sm"
                    style={{
                      background: 'rgba(14, 6, 42, 0.6)',
                      borderColor: 'rgba(186, 155, 230, 0.3)',
                      color: '#F5EFE8',
                      padding: '12px 16px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#846FDA';
                      e.target.style.boxShadow = '0 0 0 3px rgba(132, 111, 218, 0.1)';
                      e.target.style.background = 'rgba(14, 6, 42, 0.8)';
                      e.target.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(186, 155, 230, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'rgba(14, 6, 42, 0.6)';
                    }}
                  />
                </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={() => handleEmailAuth(!usePassword)}
                    disabled={isLoading || !email || (usePassword && !password)}
                    className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)',
                      color: '#F5EFE8',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      animation: 'breathe 3s ease-in-out infinite',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(110%)';
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(100%)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    {isLoading 
                      ? (usePassword ? 'Opening your sanctuary...' : 'Sending magic link...') 
                      : (usePassword 
                          ? `${authAction === 'signin' ? 'Enter Your Space' : 'Create Your Sanctuary'}`
                          : 'Send Magic Link'
                        )
                    }
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setUsePassword(!usePassword)}
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: '#BA9BE6' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#C8B4EA'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#BA9BE6'}
                    >
                      {usePassword ? 'Or sign in with magic link' : 'Or sign in with password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Phone Authentication */}
            {authMethod === 'phone' && (
              <div className="space-y-8">
                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{ color: 'rgba(245, 239, 232, 0.9)' }}
                  >
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 backdrop-blur-sm"
                        style={{
                          background: 'rgba(14, 6, 42, 0.6)',
                          borderColor: 'rgba(186, 155, 230, 0.3)',
                          color: '#F5EFE8',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(14, 6, 42, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(14, 6, 42, 0.6)';
                        }}
                      >
                        <span className="text-base">{selectedCountry?.flag}</span>
                        <span className="text-sm font-medium">{selectedCountryCode}</span>
                        <ChevronDown className="w-4 h-4" style={{ color: 'rgba(245, 239, 232, 0.5)' }} />
                      </button>

                      {showCountryDropdown && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-48 rounded-xl border backdrop-blur-xl z-10 max-h-60 overflow-y-auto"
                          style={{
                            background: 'rgba(19, 12, 60, 0.9)',
                            borderColor: 'rgba(186, 155, 230, 0.3)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              onClick={() => {
                                setSelectedCountryCode(country.code);
                                setShowCountryDropdown(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                              style={{ color: '#F5EFE8' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(186, 155, 230, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <span className="text-base">{country.flag}</span>
                              <span className="text-sm font-medium">{country.code}</span>
                              <span className="text-sm" style={{ color: 'rgba(245, 239, 232, 0.7)' }}>{country.country}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 rounded-xl border transition-all duration-200 backdrop-blur-sm"
                      style={{
                        background: 'rgba(14, 6, 42, 0.6)',
                        borderColor: 'rgba(186, 155, 230, 0.3)',
                        color: '#F5EFE8',
                        padding: '12px 16px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#846FDA';
                        e.target.style.boxShadow = '0 0 0 3px rgba(132, 111, 218, 0.1)';
                        e.target.style.background = 'rgba(14, 6, 42, 0.8)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(186, 155, 230, 0.3)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(14, 6, 42, 0.6)';
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePhoneAuth}
                  disabled={isLoading || !phoneNumber}
                  className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)',
                    color: '#F5EFE8',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                    animation: 'breathe 3s ease-in-out infinite',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(110%)';
                    e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(100%)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <Phone className="w-4 h-4 mr-2 inline" />
                  {isLoading ? 'Connecting...' : 'Send Verification Code'}
                </button>
              </div>
            )}

            {/* Toggle between Sign In and Sign Up */}
            <div className="mt-10 text-center">
              <p className="text-sm" style={{ color: 'rgba(245, 239, 232, 0.7)' }}>
                {authAction === 'signin' ? "New to your inner journey?" : "Already have a sanctuary?"}
                <button
                  onClick={() => {
                    setAuthAction(authAction === 'signin' ? 'signup' : 'signin');
                    setUsePassword(true);
                  }}
                  className="ml-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: '#BA9BE6' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C8B4EA'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BA9BE6'}
                >
                  {authAction === 'signin' ? 'Begin your journey' : 'Return to your space'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        input::placeholder {
          color: rgba(245, 239, 232, 0.5) !important;
        }
      `}</style>
    </div>
  );
}

export default Auth;