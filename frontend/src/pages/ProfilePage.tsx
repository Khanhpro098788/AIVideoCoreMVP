import { useState } from 'react';
import { Film, Heart, Clapperboard, Edit, Check, Camera, Star } from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { GlassCard, Avatar, PageHeader, NeonButton, Input, Textarea } from '@/components/ui';
import { feedVideos } from '@/data';

export function ProfilePage() {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Aether Films');
  const [bio, setBio] = useState('Cinematic AI filmmaker. Crafting stories from prompts, one render at a time.');
  const avatar = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';

  const stats = [
    { label: t('totalProjects'), value: '42', icon: Clapperboard, color: 'text-teal' },
    { label: t('totalRenders'), value: '18', icon: Film, color: 'text-violet' },
    { label: t('totalLikes'), value: '24.5k', icon: Heart, color: 'text-flame' },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader title={t('profileTitle')} />

      {/* Profile header card */}
      <GlassCard className="overflow-hidden mb-6">
        {/* Banner */}
        <div className="relative h-40 md:h-48 overflow-hidden">
          <img
            src={feedVideos[0].thumbnail}
            alt="banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
        </div>

        {/* Profile info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-ink-900">
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-teal text-ink-950 flex items-center justify-center">
                  <Camera size={14} />
                </button>
              )}
            </div>
            <NeonButton
              variant={editing ? 'teal' : 'outline'}
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? <><Check size={14} /> {t('saveChanges')}</> : <><Edit size={14} /> {t('editProfile')}</>}
            </NeonButton>
          </div>

          {editing ? (
            <div className="space-y-4">
              <Input label="Name" value={name} onChange={setName} placeholder="Your name" />
              <Textarea label={t('bio')} value={bio} onChange={setBio} placeholder="Tell us about yourself..." rows={3} />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white">{name}</h2>
              <div className="text-sm text-white/40 mb-3">@aether_films · {t('memberSince')} Jan 2026</div>
              <p className="text-sm text-white/60 leading-relaxed max-w-lg">{bio}</p>
            </>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <stat.icon size={16} className={stat.color} />
                </div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Recent works */}
      <div className="mb-4 flex items-center gap-2">
        <Star size={16} className="text-teal" />
        <span className="text-sm text-white/50 uppercase tracking-wider">Recent Works</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {feedVideos.map((video) => (
          <GlassCard key={video.id} className="overflow-hidden group cursor-pointer hover:border-teal/20 transition-smooth">
            <div className="relative aspect-video overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-xs font-medium text-white truncate">{video.title}</div>
                <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                  <span className="flex items-center gap-0.5"><Heart size={9} /> {video.likes > 1000 ? `${(video.likes / 1000).toFixed(1)}k` : video.likes}</span>
                  <span>·</span>
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
