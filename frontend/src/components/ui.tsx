import { type ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function GlassCard({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function NeonButton({
  children,
  onClick,
  variant = 'teal',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'teal' | 'flame' | 'violet' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    teal: 'bg-gradient-to-r from-teal to-teal-glow text-ink-950 font-semibold hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:brightness-110',
    flame: 'bg-gradient-to-r from-flame to-flame-glow text-ink-950 font-semibold hover:shadow-[0_0_30px_rgba(255,122,69,0.4)] hover:brightness-110',
    violet: 'bg-gradient-to-r from-violet to-violet-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:brightness-110',
    ghost: 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
    outline: 'border border-white/15 text-white/80 hover:border-teal/50 hover:text-teal hover:bg-teal/5',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`transition-smooth inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: 'rendered' | 'processing' | 'draft' | 'active' | 'suspended' | 'pending' | 'approved' | 'rejected' }) {
  const styles: Record<string, string> = {
    rendered: 'bg-teal/15 text-teal border-teal/30',
    processing: 'bg-flame/15 text-flame border-flame/30',
    draft: 'bg-white/10 text-white/60 border-white/20',
    active: 'bg-teal/15 text-teal border-teal/30',
    suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
    pending: 'bg-flame/15 text-flame border-flame/30',
    approved: 'bg-teal/15 text-teal border-teal/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'rendered' || status === 'active' || status === 'approved' ? 'bg-teal' : status === 'processing' || status === 'pending' ? 'bg-flame' : status === 'rejected' || status === 'suspended' ? 'bg-red-400' : 'bg-white/40'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  className = '',
  required = false,
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} ${type === 'password' ? 'pr-11' : 'pr-4'} py-3 bg-ink-800/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 transition-smooth focus-ring`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-smooth"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-ink-800/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 transition-smooth focus-ring resize-none"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  className = '',
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
  className?: string;
}) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-ink-800/60 border border-white/10 rounded-xl text-sm text-white transition-smooth focus-ring appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23ffffff60' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
        }}
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-850 text-white">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Avatar({ src, size = 'md', ring = false }: { src: string; size?: 'sm' | 'md' | 'lg' | 'xl'; ring?: boolean }) {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0 ${ring ? 'ring-2 ring-teal/40 ring-offset-2 ring-offset-ink-950' : ''}`}>
      <img src={src} alt="avatar" className="w-full h-full object-cover" />
    </div>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { text: 'text-lg', icon: 20 },
    md: { text: 'text-xl', icon: 24 },
    lg: { text: 'text-3xl', icon: 32 },
  };
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative" style={{ width: sizes[size].icon, height: sizes[size].icon }}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ff7a45" />
            </linearGradient>
          </defs>
          <path d="M6 4 L6 28 L10 28 L10 12 L22 28 L26 28 L26 4 L22 4 L22 20 L10 4 Z" fill="url(#logo-grad)" />
        </svg>
      </div>
      <span className={`font-bold ${sizes[size].text} tracking-tight text-white`}>
        Klink<span className="text-gradient-teal">AI</span>
      </span>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
