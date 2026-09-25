import { useState, useRef, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Shield, Check } from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { NeonButton, Input, Logo } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import type { PageKey } from '@/components/Sidebar';

type AuthMode = 'signin' | 'signup' | 'otp' | 'forgot' | 'forgot-otp';

export function AuthPage({ onAuth }: { onAuth: () => void }) {
  const { t, lang, toggleLang } = useI18n();
  const [mode, setMode] = useState<AuthMode>('signin');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state: any) => state.setAuth);

  // Sign in
  const [signInId, setSignInId] = useState('');
  const [signInPass, setSignInPass] = useState('');

  // Sign up
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUser, setSignUpUser] = useState('');
  const [signUpPass, setSignUpPass] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  // Forgot
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState(['', '', '', '', '', '']);
  const [forgotNewPass, setForgotNewPass] = useState('');

  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (mode === 'otp' || mode === 'forgot-otp') {
      otpRefs.current[0]?.focus();
    }
  }, [mode]);

  const handleOtpChange = (idx: number, val: string, setter: any) => {
    const digit = val.slice(-1);
    if (val && !/^\d$/.test(digit)) return;
    setter((prev: string[]) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < 5) {
      setTimeout(() => otpRefs.current[idx + 1]?.focus(), 10);
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent, currentDigit: string) => {
    if (e.key === 'Backspace' && !currentDigit && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent, setter: any) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length > 0) {
      const arr = ['', '', '', '', '', ''];
      for (let i = 0; i < digits.length; i++) arr[i] = digits[i];
      setter(arr);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.signin({ email: signInId, password: signInPass });
      // Lưu token vào memory trước để axios tự động đính kèm vào request tiếp theo
      useAuthStore.getState().setToken(data.access_token);
      
      const user = await authService.getProfile();
      setAuth(data.access_token, user);
      onAuth();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPass !== signUpConfirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.signup({ email: signUpEmail, username: signUpUser, password: signUpPass });
      setMode('otp');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.verifyOtp({ email: signUpEmail, otp: otpCode });
      setSignInId(signUpEmail);
      setSignInPass('');
      setMode('signin');
      setError('Account verified successfully. Please sign in.');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.resendOtp({ email: signUpEmail });
      setError('OTP resent successfully.');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const bgImages = [
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1438151/pexels-photo-1438151.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];
  const bgImage = bgImages[0];

  return (
    <div className="min-h-screen flex aurora-bg noise relative overflow-hidden">
      {/* Left cinematic panel */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

        {/* Floating HUD elements */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <Logo size="lg" />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs text-teal">
              <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse" />
              Klink-V4 Cinema Engine Online
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight max-w-md">
              Direct your imagination into <span className="text-gradient-cinema">cinematic reality</span>
            </h2>
            <p className="text-white/50 text-lg max-w-md leading-relaxed">
              Cast AI characters, script scenes, and render full-length films — all from a single prompt.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Stat value="2.4M+" label="Films Generated" />
              <div className="w-px h-10 bg-white/10" />
              <Stat value="180+" label="Countries" />
              <div className="w-px h-10 bg-white/10" />
              <Stat value="4K" label="Cinema Quality" />
            </div>
          </div>

          <div className="text-xs text-white/30">
            © 2026 Klink AI Studios. All renders are AI-generated.
          </div>
        </div>

        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-teal/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-violet/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        {/* Language Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={toggleLang}
            className="px-3 py-1.5 glass rounded-full text-xs font-bold text-white hover:bg-white/10 transition-smooth uppercase tracking-wider"
          >
            {lang === 'en' ? 'EN / VI' : 'VI / EN'}
          </button>
        </div>
        
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          {/* Mode header */}
          <div className="mb-8">
            {mode === 'signin' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{t('welcomeBack')}</h1>
                <p className="text-white/40 text-sm">{t('signInSubtitle')}</p>
              </>
            )}
            {mode === 'signup' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{t('signUpTitle')}</h1>
                <p className="text-white/40 text-sm">{t('signUpSubtitle')}</p>
              </>
            )}
            {mode === 'otp' && (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal/10 rounded-full text-xs text-teal mb-4">
                  <Shield size={14} /> OTP Verification
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{t('otpTitle')}</h1>
                <p className="text-white/40 text-sm">{t('otpSubtitle')}</p>
              </>
            )}
            {mode === 'forgot' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{t('forgotTitle')}</h1>
                <p className="text-white/40 text-sm">{t('forgotSubtitle')}</p>
              </>
            )}
            {mode === 'forgot-otp' && (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-flame/10 rounded-full text-xs text-flame mb-4">
                  <Shield size={14} /> Reset Verification
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{t('forgotTitle')}</h1>
                <p className="text-white/40 text-sm">{t('newOtpSubtitle')}</p>
              </>
            )}
          </div>

          {error && (
            <div className={`mb-6 p-3 rounded-xl text-sm text-center ${error.includes('successfully') ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-flame/10 text-flame border border-flame/20'}`}>
              {error}
            </div>
          )}

          {/* Forms */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                label={t('emailOrUsername')}
                value={signInId}
                onChange={setSignInId}
                placeholder="you@klink.ai"
                icon={<Mail size={16} />}
                required
              />
              <Input
                label={t('password')}
                type="password"
                value={signInPass}
                onChange={setSignInPass}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-teal hover:text-teal-glow transition-smooth"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <NeonButton type="submit" variant="teal" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : <>{t('signIn')} <ArrowRight size={18} /></>}
              </NeonButton>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={onAuth}
                className="w-full flex items-center justify-center gap-3 py-3.5 glass rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/10 transition-smooth"
              >
                <GoogleIcon />
                {t('signInWithGoogle')}
              </button>

              <p className="text-center text-sm text-white/40 pt-2">
                {t('noAccount')}{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-teal hover:text-teal-glow font-medium transition-smooth">
                  {t('createAccount')}
                </button>
              </p>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                value={signUpEmail}
                onChange={setSignUpEmail}
                placeholder="you@klink.ai"
                icon={<Mail size={16} />}
                required
              />
              <Input
                label={t('username')}
                value={signUpUser}
                onChange={setSignUpUser}
                placeholder="@yourname"
                icon={<User size={16} />}
                required
              />
              <Input
                label={t('password')}
                type="password"
                value={signUpPass}
                onChange={setSignUpPass}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                required
              />
              <Input
                label={t('confirmPassword')}
                type="password"
                value={signUpConfirm}
                onChange={setSignUpConfirm}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                required
              />
              <NeonButton type="submit" variant="teal" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : <>{t('next')} <ArrowRight size={18} /></>}
              </NeonButton>
              <p className="text-center text-sm text-white/40 pt-2">
                {t('haveAccount')}{' '}
                <button type="button" onClick={() => setMode('signin')} className="text-teal hover:text-teal-glow font-medium transition-smooth">
                  {t('signIn')}
                </button>
              </p>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div
                className="flex gap-3 justify-between"
                onPaste={(e) => handleOtpPaste(e, setOtp)}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={digit}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleOtpChange(idx, e.target.value, setOtp)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e, digit)}
                    className="w-12 h-14 text-center text-xl font-bold bg-ink-800/60 border border-white/10 rounded-xl text-white transition-smooth focus-ring"
                  />
                ))}
              </div>
              <div className="text-center text-sm text-white/40">
                <button type="button" onClick={handleResendOtp} disabled={loading} className="hover:text-white transition-smooth">
                  {t('resendCode')}
                </button>
              </div>
              <NeonButton type="submit" variant="teal" size="lg" className="w-full" disabled={loading}>
                <Check size={18} /> {loading ? 'Verifying...' : t('verify')}
              </NeonButton>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="w-full flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-smooth"
              >
                <ArrowLeft size={16} /> {t('back')}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={(e) => { e.preventDefault(); setMode('forgot-otp'); }} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                value={forgotEmail}
                onChange={setForgotEmail}
                placeholder="you@klink.ai"
                icon={<Mail size={16} />}
                required
              />
              <NeonButton type="submit" variant="flame" size="lg" className="w-full">
                {t('sendOtp')} <ArrowRight size={18} />
              </NeonButton>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-smooth"
              >
                <ArrowLeft size={16} /> {t('returnToSignIn')}
              </button>
            </form>
          )}

          {mode === 'forgot-otp' && (
            <form onSubmit={(e) => { e.preventDefault(); setMode('signin'); }} className="space-y-6">
              <div
                className="flex gap-3 justify-between"
                onPaste={(e) => handleOtpPaste(e, setForgotOtp)}
              >
                {forgotOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={digit}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleOtpChange(idx, e.target.value, setForgotOtp)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e, digit)}
                    className="w-12 h-14 text-center text-xl font-bold bg-ink-800/60 border border-white/10 rounded-xl text-white transition-smooth focus-ring"
                  />
                ))}
              </div>
              <Input
                label={t('newPassword')}
                type="password"
                value={forgotNewPass}
                onChange={setForgotNewPass}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                required
              />
              <NeonButton type="submit" variant="flame" size="lg" className="w-full">
                <Check size={18} /> {t('resetPassword')}
              </NeonButton>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-smooth"
              >
                <ArrowLeft size={16} /> {t('returnToSignIn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.84a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.588.102-1.16.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}
