export interface FeedVideo {
  id: string;
  title: string;
  director: string;
  thumbnail: string;
  duration: string;
  genre: string;
  aiModel: string;
  renderTime: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  caption: string;
  description: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface Draft {
  id: string;
  name: string;
  updatedAt: string;
  progress: number;
  scenes: number;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  type: 'main' | 'supporting';
  voiceType?: 'recorded' | 'uploaded' | 'none';
  voiceName?: string;
}

export interface DialogueBlock {
  id: string;
  characterId: string;
  text: string;
  audioType: 'recorded' | 'uploaded' | 'none';
  audioName?: string;
}

export interface Scene {
  id: string;
  background: string;
  bgm: string;
  bgmType?: 'recorded' | 'uploaded' | 'none';
  bgmName?: string;
  dialogues: DialogueBlock[];
}

export interface AssetVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  status: 'rendered' | 'processing' | 'draft';
  createdAt: string;
  size: string;
  resolution: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  joinedDate: string;
  tasksCount: number;
  assetsCount: number;
  status: 'active' | 'suspended';
  avatar: string;
}

export interface FlaggedContent {
  id: string;
  title: string;
  type: string;
  flaggedBy: string;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'render' | 'system' | 'follow';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

export const feedVideos: FeedVideo[] = [
  {
    id: 'v1',
    title: 'Neon Tokyo: Last Rain',
    director: '@aether_films',
    thumbnail: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1600',
    duration: '4:32',
    genre: 'Cyberpunk Drama',
    aiModel: 'Klink-V4 Cinema',
    renderTime: '18 min',
    likes: 12400,
    comments: 892,
    shares: 1240,
    liked: false,
    caption: 'A lone wanderer navigates the rain-soaked streets of neo-Tokyo, searching for a memory that was never real.',
    description: 'Generated entirely with Klink AI. 8 scenes, 3 characters, 4K cinematic render.',
  },
  {
    id: 'v2',
    title: 'The Lighthouse Keeper',
    director: '@oceanbound',
    thumbnail: 'https://images.pexels.com/photos/1438151/pexels-photo-1438151.jpeg?auto=compress&cs=tinysrgb&w=1600',
    duration: '6:15',
    genre: 'Atmospheric Short',
    aiModel: 'Klink-V4 Cinema',
    renderTime: '32 min',
    likes: 8200,
    comments: 540,
    shares: 670,
    liked: true,
    caption: 'The keeper tends the light one final time before the storm takes everything.',
    description: 'Single-location atmospheric piece. 4 scenes, 1 character.',
  },
  {
    id: 'v3',
    title: 'Desert Mirage',
    director: '@dust_studio',
    thumbnail: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1600',
    duration: '3:48',
    genre: 'Surreal Adventure',
    aiModel: 'Klink-V3 Pro',
    renderTime: '15 min',
    likes: 21000,
    comments: 1500,
    shares: 3200,
    liked: false,
    caption: 'A traveler discovers a city that exists only in the heat of the afternoon.',
    description: 'Surreal adventure short. 6 scenes, 2 characters.',
  },
  {
    id: 'v4',
    title: 'Midnight Protocol',
    director: '@cipher_x',
    thumbnail: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1600',
    duration: '5:20',
    genre: 'Tech Thriller',
    aiModel: 'Klink-V4 Cinema',
    renderTime: '24 min',
    likes: 15600,
    comments: 1100,
    shares: 2100,
    liked: false,
    caption: 'A hacker uncovers a conspiracy buried in the city\'s power grid.',
    description: 'Tech thriller. 10 scenes, 4 characters.',
  },
];

export const sampleComments: Comment[] = [
  { id: 'c1', author: '@cinema_lover', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', text: 'The lighting in scene 3 is absolutely unreal. How did you prompt that?', time: '2h', likes: 42 },
  { id: 'c2', author: '@filmforge', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', text: 'This is the future of filmmaking. Incredible work.', time: '5h', likes: 128 },
  { id: 'c3', author: '@nightowl', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200', text: 'The soundtrack gives me chills every single time.', time: '8h', likes: 67 },
];

export const sampleDrafts: Draft[] = [
  { id: 'd1', name: 'Echoes of Mars', updatedAt: '2 hours ago', progress: 65, scenes: 6 },
  { id: 'd2', name: 'The Last Signal', updatedAt: '1 day ago', progress: 30, scenes: 3 },
  { id: 'd3', name: 'Underwater Cathedral', updatedAt: '3 days ago', progress: 90, scenes: 8 },
];

export const bgmTracks = [
  { id: 'b1', title: 'Cinematic Tension', artist: 'Klink Audio' },
  { id: 'b2', title: 'Ethereal Drift', artist: 'Klink Audio' },
  { id: 'b3', title: 'Urban Pulse', artist: 'Klink Audio' },
  { id: 'b4', title: 'Orchestral Rise', artist: 'Klink Audio' },
  { id: 'b5', title: 'Dark Ambient', artist: 'Klink Audio' },
  { id: 'b6', title: 'Neon Dreams', artist: 'Klink Audio' },
];

export const assetVideos: AssetVideo[] = [
  { id: 'a1', title: 'Neon Tokyo: Last Rain', thumbnail: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', duration: '4:32', status: 'rendered', createdAt: 'Sep 18, 2026', size: '1.2 GB', resolution: '4K' },
  { id: 'a2', title: 'The Lighthouse Keeper', thumbnail: 'https://images.pexels.com/photos/1438151/pexels-photo-1438151.jpeg?auto=compress&cs=tinysrgb&w=800', duration: '6:15', status: 'rendered', createdAt: 'Sep 15, 2026', size: '2.1 GB', resolution: '4K' },
  { id: 'a3', title: 'Desert Mirage', thumbnail: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800', duration: '3:48', status: 'processing', createdAt: 'Sep 19, 2026', size: '—', resolution: '4K' },
  { id: 'a4', title: 'Midnight Protocol', thumbnail: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', duration: '5:20', status: 'rendered', createdAt: 'Sep 12, 2026', size: '1.8 GB', resolution: '4K' },
  { id: 'a5', title: 'Echoes of Mars', thumbnail: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-73910.jpeg?auto=compress&cs=tinysrgb&w=800', duration: '7:00', status: 'draft', createdAt: 'Sep 19, 2026', size: '—', resolution: '2K' },
  { id: 'a6', title: 'Underwater Cathedral', thumbnail: 'https://images.pexels.com/photos/3047711/pexels-photo-3047711.jpeg?auto=compress&cs=tinysrgb&w=800', duration: '5:45', status: 'rendered', createdAt: 'Sep 10, 2026', size: '1.5 GB', resolution: '4K' },
];

export const adminUsers: AdminUser[] = [
  { id: 'u1', username: 'aether_films', email: 'aether@klink.ai', joinedDate: 'Jan 12, 2026', tasksCount: 42, assetsCount: 18, status: 'active', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'u2', username: 'oceanbound', email: 'ocean@klink.ai', joinedDate: 'Feb 3, 2026', tasksCount: 28, assetsCount: 12, status: 'active', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'u3', username: 'dust_studio', email: 'dust@klink.ai', joinedDate: 'Mar 18, 2026', tasksCount: 67, assetsCount: 31, status: 'active', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'u4', username: 'cipher_x', email: 'cipher@klink.ai', joinedDate: 'Apr 7, 2026', tasksCount: 15, assetsCount: 8, status: 'suspended', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'u5', username: 'nightowl', email: 'night@klink.ai', joinedDate: 'May 22, 2026', tasksCount: 53, assetsCount: 24, status: 'active', avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'u6', username: 'filmforge', email: 'forge@klink.ai', joinedDate: 'Jun 14, 2026', tasksCount: 19, assetsCount: 7, status: 'suspended', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

export const flaggedContent: FlaggedContent[] = [
  { id: 'f1', title: 'Untitled Project #4471', type: 'Video', flaggedBy: '@community_mod', reason: 'Violence / Gore', date: '2h ago', status: 'pending' },
  { id: 'f2', title: 'Scene 3 — Midnight Protocol', type: 'Scene', flaggedBy: '@auto_filter', reason: 'NSFW content detected', date: '5h ago', status: 'pending' },
  { id: 'f3', title: 'Character: Rogue AI', type: 'Character', flaggedBy: '@admin', reason: 'Copyright infringement', date: '1d ago', status: 'approved' },
  { id: 'f4', title: 'Untitled Project #4398', type: 'Video', flaggedBy: '@community_mod', reason: 'Spam / Repetitive', date: '2d ago', status: 'rejected' },
];

export const notifications: NotificationItem[] = [
  { id: 'n1', type: 'render', title: 'Render Complete', message: '"Neon Tokyo: Last Rain" is ready to download.', time: '5 min ago', read: false },
  { id: 'n2', type: 'like', title: 'New Like', message: '@filmforge liked your video "Desert Mirage".', time: '1h ago', read: false, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'n3', type: 'comment', title: 'New Comment', message: '@cinema_lover commented on "The Lighthouse Keeper".', time: '3h ago', read: false, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'n4', type: 'follow', title: 'New Follower', message: '@nightowl started following you.', time: '6h ago', read: true, avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'n5', type: 'system', title: 'Credits Added', message: '500 credits have been added to your account.', time: '1d ago', read: true },
  { id: 'n6', type: 'render', title: 'Render Started', message: '"Echoes of Mars" has started rendering.', time: '2d ago', read: true },
];

export const durationOptions = [
  '1 min', '2 min', '3 min', '5 min', '10 min', '15 min', '30 min',
];
