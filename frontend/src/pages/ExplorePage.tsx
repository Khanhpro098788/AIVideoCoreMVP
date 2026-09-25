import { useState } from 'react';
import {
  Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX,
  Bookmark, MoreHorizontal, Send, Film, Clock, Cpu, Tag, Sparkles, X,
} from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { Avatar } from '@/components/ui';
import { feedVideos, sampleComments, type FeedVideo, type Comment } from '@/data';

export function ExplorePage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<'following' | 'forYou'>('forYou');
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [commentText, setCommentText] = useState('');

  const video = feedVideos[activeIndex];

  const toggleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const postComment = () => {
    if (!commentText.trim()) return;
    setComments([
      { id: `c${Date.now()}`, author: '@you', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', text: commentText, time: 'now', likes: 0 },
      ...comments,
    ]);
    setCommentText('');
  };

  return (
    <div className="min-h-screen">
      {/* Tab bar */}
      <div className="sticky top-0 z-30 glass-strong px-4 py-3 flex items-center justify-center gap-1">
        <div className="inline-flex bg-ink-800/60 rounded-xl p-1">
          <TabButton active={tab === 'following'} onClick={() => setTab('following')}>
            {t('following')}
          </TabButton>
          <TabButton active={tab === 'forYou'} onClick={() => setTab('forYou')}>
            {t('forYou')}
          </TabButton>
        </div>
      </div>

      {/* Cinematic feed */}
      <div className="relative max-w-[1100px] mx-auto px-4 py-6">
        {/* Ultra-wide cinematic player */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden hud-corners group">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover transition-smooth"
          />

          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/60" />

          {/* Top HUD bar */}
          <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 glass rounded-full text-[10px] text-teal font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse" />
                REC · AI RENDER
              </div>
              <div className="px-2.5 py-1 glass rounded-full text-[10px] text-white/60 font-mono">
                4K · 24FPS
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2 glass rounded-full text-white/70 hover:text-white transition-smooth"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button className="p-2 glass rounded-full text-white/70 hover:text-white transition-smooth">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Center play/pause */}
          <button
            onClick={() => setPlaying(!playing)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full glass-strong flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
          >
            {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          {/* Left HUD: Scene info */}
          <div className="absolute bottom-0 left-0 p-6 z-20 max-w-md space-y-3">
            <div className="flex items-center gap-2">
              <Avatar src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" size="sm" ring />
              <span className="text-sm text-white font-medium">{video.director}</span>
              <button className="px-3 py-1 text-xs font-medium bg-teal text-ink-950 rounded-full hover:brightness-110 transition-smooth">
                Follow
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white">{video.title}</h2>
            <p className="text-sm text-white/60 leading-relaxed">{video.caption}</p>

            {/* HUD data chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <HudChip icon={Film} label={t('genre')} value={video.genre} />
              <HudChip icon={Clock} label={t('duration')} value={video.duration} />
              <HudChip icon={Cpu} label={t('aiModel')} value={video.aiModel} />
              <HudChip icon={Tag} label={t('renderTime')} value={video.renderTime} />
            </div>
          </div>

          {/* Right floating interaction bar */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
            <InteractionButton
              icon={Heart}
              count={video.likes + (liked[video.id] ? 1 : 0)}
              active={liked[video.id]}
              onClick={() => toggleLike(video.id)}
              activeColor="text-flame"
            />
            <InteractionButton
              icon={MessageCircle}
              count={video.comments}
              onClick={() => setShowComments(true)}
              activeColor="text-teal"
            />
            <InteractionButton
              icon={Share2}
              count={video.shares}
              activeColor="text-violet"
            />
            <InteractionButton
              icon={Bookmark}
              count={undefined}
              activeColor="text-teal"
            />
          </div>

          {/* Bottom progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <div className="h-full w-[35%] bg-gradient-to-r from-teal to-teal-glow" />
          </div>
        </div>

        {/* Feed navigation dots */}
        <div className="flex justify-center gap-2 mt-4">
          {feedVideos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-smooth ${i === activeIndex ? 'w-8 bg-teal' : 'w-1.5 bg-white/20'}`}
            />
          ))}
        </div>

        {/* Description / details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-teal" />
              <span className="text-xs text-white/50 uppercase tracking-wider">{t('sceneInfo')}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{video.description}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-3">{t('director')}</div>
            <div className="flex items-center gap-3">
              <Avatar src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" size="md" />
              <div>
                <div className="text-sm text-white font-medium">{video.director}</div>
                <div className="text-xs text-white/40">12 films · 2.4k followers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-6">
          <div className="text-xs text-white/50 uppercase tracking-wider mb-3">Up Next</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {feedVideos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 w-44 aspect-video rounded-xl overflow-hidden relative transition-smooth ${i === activeIndex ? 'ring-2 ring-teal' : 'ring-1 ring-white/10 hover:ring-white/30'}`}
              >
                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-xs text-white font-medium truncate">{v.title}</div>
                  <div className="text-[10px] text-white/50">{v.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comments drawer */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            onClick={() => setShowComments(false)}
          />
          <div className="relative w-full max-w-md glass-strong h-full flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-teal" />
                <span className="font-medium text-white">{t('comments')} · {comments.length}</span>
              </div>
              <button onClick={() => setShowComments(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/50">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar src={c.avatar} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{c.author}</span>
                      <span className="text-xs text-white/30">{c.time}</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="flex items-center gap-1 text-xs text-white/40 hover:text-flame transition-smooth">
                        <Heart size={12} /> {c.likes}
                      </button>
                      <button className="text-xs text-white/40 hover:text-white transition-smooth">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 bg-ink-800/60 rounded-xl px-3 py-2 border border-white/10">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && postComment()}
                  placeholder={t('addComment')}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                />
                <button
                  onClick={postComment}
                  className="p-1.5 rounded-lg bg-teal/20 text-teal hover:bg-teal/30 transition-smooth"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 text-sm font-medium rounded-lg transition-smooth ${active ? 'bg-teal text-ink-950' : 'text-white/50 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

function HudChip({ icon: Icon, label, value }: { icon: typeof Film; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 glass rounded-lg text-[11px]">
      <Icon size={11} className="text-teal" />
      <span className="text-white/40">{label}:</span>
      <span className="text-white/80 font-mono">{value}</span>
    </div>
  );
}

function InteractionButton({
  icon: Icon,
  count,
  active,
  onClick,
  activeColor = 'text-teal',
}: {
  icon: typeof Heart;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
    >
      <div className={`w-12 h-12 glass-strong rounded-full flex items-center justify-center transition-smooth group-hover:scale-110 ${active ? activeColor : 'text-white/70'}`}>
        <Icon size={20} fill={active ? 'currentColor' : 'none'} />
      </div>
      {count !== undefined && (
        <span className="text-[10px] text-white/60 font-mono">{formatCount(count)}</span>
      )}
    </button>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
