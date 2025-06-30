import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../lib/auth';
import { supabase } from '../lib/supabase';

const parseHashParams = (hash: string) => {
  // Remove leading # if present
  const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(cleaned);
  return Object.fromEntries(params.entries());
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, initialized, loading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying magic link...');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');
  const [sessionSet, setSessionSet] = useState(false);

  useEffect(() => {
    // Supabase returns tokens in the hash fragment for magic link and signup
    const hashParams = parseHashParams(location.hash);
    const type = hashParams.type;
    const access_token = hashParams.access_token;
    const refresh_token = hashParams.refresh_token;

    if (access_token && (type === 'magiclink' || type === 'signup') && !sessionSet) {
      // Set the session using the tokens
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ data, error }) => {
        if (error) {
          setStatus('error');
          setMessage('Invalid or expired link.');
        } else {
          setStatus('success');
          setMessage(type === 'signup' ? 'Email confirmed! Redirecting...' : 'Magic link verified! Redirecting...');
          setSessionSet(true);
          // Don't redirect immediately - let the auth state update and then redirect based on onboarding status
        }
      });
    } else if (!access_token || (type !== 'magiclink' && type !== 'signup')) {
      setStatus('error');
      setMessage('Invalid or expired link.');
    }
  }, [location, sessionSet]);

  // Handle redirect after auth state is updated
  useEffect(() => {
    if (status === 'success' && sessionSet && initialized && !loading && user) {
      console.log('AuthCallback - Redirecting user based on onboarding status:', {
        hasProfile: !!profile,
        onboardingComplete: profile?.onboarding_completed
      });
      
      const isOnboardingComplete = profile?.onboarding_completed || false;
      const redirectTo = isOnboardingComplete ? "/dashboard" : "/onboarding";
      
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1200);
    }
  }, [status, sessionSet, initialized, loading, user, profile, navigate]);

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess('');
    setResendError('');
    try {
      const result = await AuthService.resendConfirmationEmail(email);
      if (result.success) {
        setResendSuccess('Confirmation email resent! Check your inbox.');
      } else {
        setResendError(result.error || 'Failed to resend confirmation email.');
      }
    } catch (err) {
      setResendError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#23143e] to-[#0e062a]">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/10 w-full max-w-md">
        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-semibold text-[#BA9BE6] mb-4 text-center">Verifying magic link...</h1>
            <p className="text-center text-[#F5EFE8]">Please wait while we verify your email and log you in.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-semibold text-[#10B981] mb-4 text-center">Success!</h1>
            <p className="text-center text-[#F5EFE8]">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-semibold text-[#EF4444] mb-4 text-center">Link Invalid or Expired</h1>
            <p className="text-center text-[#F5EFE8] mb-6">{message}</p>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email to resend confirmation"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border transition-all duration-200 backdrop-blur-sm mb-2 px-4 py-3"
                style={{
                  background: 'rgba(14, 6, 42, 0.6)',
                  borderColor: 'rgba(186, 155, 230, 0.3)',
                  color: '#F5EFE8',
                }}
              />
              <button
                onClick={handleResend}
                disabled={resendLoading || !email}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)',
                  color: '#F5EFE8',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                }}
              >
                {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
              </button>
              {resendSuccess && <p className="text-green-400 text-center mt-2">{resendSuccess}</p>}
              {resendError && <p className="text-red-400 text-center mt-2">{resendError}</p>}
            </div>
            <button
              onClick={() => navigate('/auth', { replace: true })}
              className="w-full py-2 rounded-xl text-[#BA9BE6] font-medium mt-2 hover:text-[#C8B4EA] transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 