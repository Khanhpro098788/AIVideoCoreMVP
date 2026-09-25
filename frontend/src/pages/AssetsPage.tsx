import { useState } from 'react';
import { Download, Play, Search, Filter, Clock, HardDrive, Monitor, MoreHorizontal } from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { GlassCard, StatusBadge, PageHeader, NeonButton } from '@/components/ui';
import { assetVideos, type AssetVideo } from '@/data';

export function AssetsPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'rendered' | 'processing' | 'draft'>('all');
  const [search, setSearch] = useState('');

  const filtered = assetVideos.filter((v) => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: assetVideos.length,
    rendered: assetVideos.filter((v) => v.status === 'rendered').length,
    processing: assetVideos.filter((v) => v.status === 'processing').length,
    draft: assetVideos.filter((v) => v.status === 'draft').length,
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={t('assetsLibrary')}
        subtitle={`${assetVideos.length} videos · ${counts.rendered} rendered`}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search')}
                className="pl-10 pr-4 py-2.5 bg-ink-800/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 outline-none focus-ring w-48"
              />
            </div>
          </div>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(['all', 'rendered', 'processing', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-smooth whitespace-nowrap ${
              filter === f
                ? 'bg-teal/15 text-teal border border-teal/30'
                : 'glass text-white/50 hover:text-white border border-transparent'
            }`}
          >
            {f === 'all' ? t('allVideos') : t(f)}
            <span className="text-xs text-white/30">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Filter size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/40">{t('noAssets')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((video) => (
            <AssetCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetCard({ video }: { video: AssetVideo }) {
  const { t } = useI18n();

  return (
    <GlassCard className="overflow-hidden group hover:border-teal/20 transition-smooth">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={video.status} />
        </div>

        {/* Duration */}
        <div className="absolute top-3 right-3 px-2 py-1 glass rounded-lg text-xs text-white font-mono">
          {video.duration}
        </div>

        {/* Play overlay */}
        {video.status === 'rendered' && (
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110">
            <Play size={18} className="ml-0.5" fill="currentColor" />
          </button>
        )}

        {/* Processing overlay */}
        {video.status === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-2 border-flame/30 border-t-flame rounded-full animate-spin" />
              <span className="text-xs text-white/60 font-mono">Rendering...</span>
            </div>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-3 text-[11px] text-white/50 font-mono">
            <span className="flex items-center gap-1"><Monitor size={11} /> {video.resolution}</span>
            {video.size !== '—' && <span className="flex items-center gap-1"><HardDrive size={11} /> {video.size}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-teal transition-smooth">{video.title}</h3>
            <div className="flex items-center gap-1 text-xs text-white/30 mt-1">
              <Clock size={10} /> {video.createdAt}
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-smooth">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <NeonButton
          variant={video.status === 'rendered' ? 'teal' : 'outline'}
          size="sm"
          className="w-full"
          disabled={video.status !== 'rendered'}
        >
          <Download size={14} /> {t('download')}
        </NeonButton>
      </div>
    </GlassCard>
  );
}
