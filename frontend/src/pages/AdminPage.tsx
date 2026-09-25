import { useState } from 'react';
import {
  Users, Server, ShieldAlert, Search, Edit, Trash2, Check, X,
  Cpu, HardDrive, Activity, Wifi, AlertTriangle, FileText,
} from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { GlassCard, StatusBadge, Avatar, PageHeader, NeonButton } from '@/components/ui';
import { adminUsers, flaggedContent, type AdminUser, type FlaggedContent } from '@/data';

type AdminTab = 'users' | 'resources' | 'moderation';

export function AdminPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<AdminTab>('users');

  const tabs: { key: AdminTab; label: string; icon: typeof Users }[] = [
    { key: 'users', label: t('userManagement'), icon: Users },
    { key: 'resources', label: t('resources'), icon: Server },
    { key: 'moderation', label: t('contentModeration'), icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title={t('adminCenter')}
        subtitle="System administration & moderation"
      />

      {/* Tab navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-smooth whitespace-nowrap ${
              tab === tabItem.key
                ? 'bg-gradient-to-r from-violet/20 to-violet/5 text-violet border border-violet/30'
                : 'glass text-white/50 hover:text-white border border-transparent'
            }`}
          >
            <tabItem.icon size={16} />
            {tabItem.label}
          </button>
        ))}
      </div>

      {tab === 'users' && <UsersTab />}
      {tab === 'resources' && <ResourcesTab />}
      {tab === 'moderation' && <ModerationTab />}
    </div>
  );
}

function UsersTab() {
  const { t } = useI18n();
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <GlassCard className="overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 bg-ink-800/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 outline-none focus-ring"
          />
        </div>
        <div className="text-xs text-white/40">
          {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">{t('username')}</th>
              <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3 hidden md:table-cell">{t('email')}</th>
              <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">{t('joinedDate')}</th>
              <th className="text-center text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">{t('tasksCount')}</th>
              <th className="text-center text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3 hidden md:table-cell">{t('assetsCount')}</th>
              <th className="text-center text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">{t('status')}</th>
              <th className="text-right text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-smooth group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-white">{user.username}</div>
                      <div className="text-xs text-white/30 md:hidden">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-white/60">{user.email}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm text-white/50">{user.joinedDate}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm text-white/70 font-mono">{user.tasksCount}</span>
                </td>
                <td className="px-5 py-4 text-center hidden md:table-cell">
                  <span className="text-sm text-white/70 font-mono">{user.assetsCount}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <button onClick={() => toggleStatus(user.id)}>
                    <StatusBadge status={user.status} />
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditing(editing === user.id ? null : user.id)}
                      className="p-2 rounded-lg text-white/40 hover:text-teal hover:bg-teal/5 transition-smooth"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-smooth"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-sm text-white/40">No users found.</div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <GlassCard className="relative w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-white mb-4">Edit User</h3>
            {(() => {
              const user = users.find((u) => u.id === editing);
              if (!user) return null;
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} size="lg" />
                    <div>
                      <div className="font-medium text-white">{user.username}</div>
                      <div className="text-sm text-white/40">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Tasks</label>
                      <div className="text-lg text-white font-mono">{user.tasksCount}</div>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Assets</label>
                      <div className="text-lg text-white font-mono">{user.assetsCount}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-ink-800/60 rounded-xl">
                    <span className="text-sm text-white/60">Account Status</span>
                    <button onClick={() => toggleStatus(user.id)}>
                      <StatusBadge status={user.status} />
                    </button>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <NeonButton variant="teal" size="md" className="flex-1" onClick={() => setEditing(null)}>
                      <Check size={16} /> Save
                    </NeonButton>
                    <NeonButton variant="ghost" size="md" onClick={() => setEditing(null)}>
                      Cancel
                    </NeonButton>
                  </div>
                </div>
              );
            })()}
          </GlassCard>
        </div>
      )}
    </GlassCard>
  );
}

function ResourcesTab() {
  const { t } = useI18n();

  const resources = [
    { label: t('cpuUsage'), icon: Cpu, value: 67, max: 100, unit: '%', color: 'teal' },
    { label: t('gpuUsage'), icon: Activity, value: 84, max: 100, unit: '%', color: 'flame' },
    { label: t('storage'), icon: HardDrive, value: 2.4, max: 4, unit: 'TB', color: 'violet' },
    { label: t('bandwidth'), icon: Wifi, value: 580, max: 1000, unit: 'Mbps', color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    teal: 'from-teal to-teal-glow',
    flame: 'from-flame to-flame-glow',
    violet: 'from-violet to-violet-glow',
  };

  return (
    <div className="space-y-6">
      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((r) => (
          <GlassCard key={r.label} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <r.icon size={18} className="text-white/60" />
              </div>
              <span className="text-xs text-white/30 font-mono">{r.value}{r.unit} / {r.max}{r.unit}</span>
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">{r.label}</div>
            <div className="text-2xl font-bold text-white mb-3">{r.value}{r.unit}</div>
            <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colorMap[r.color]} rounded-full transition-smooth`}
                style={{ width: `${(r.value / r.max) * 100}%` }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Activity chart placeholder */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-white">Render Queue Activity</h3>
            <p className="text-xs text-white/40">Last 24 hours</p>
          </div>
          <Activity size={18} className="text-teal" />
        </div>
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: 24 }, (_, i) => {
            const height = 30 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-teal/20 to-teal/60 rounded-t-sm transition-smooth hover:from-teal/40 hover:to-teal"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/30 font-mono">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </GlassCard>

      {/* Server nodes */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-white mb-4">Render Nodes</h3>
        <div className="space-y-3">
          {['Node-A1', 'Node-A2', 'Node-B1', 'Node-B2'].map((node, i) => (
            <div key={node} className="flex items-center justify-between p-3 bg-ink-800/40 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-teal animate-pulse' : 'bg-flame'}`} />
                <span className="text-sm text-white font-mono">{node}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>GPU {60 + i * 8}%</span>
                <span>RAM {40 + i * 12}%</span>
                <StatusBadge status={i < 3 ? 'active' : 'processing'} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function ModerationTab() {
  const { t } = useI18n();
  const [items, setItems] = useState<FlaggedContent[]>(flaggedContent);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
    ));
  };

  const pending = items.filter((i) => i.status === 'pending');

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-flame" />
            <span className="text-xs text-white/40 uppercase tracking-wider">Pending</span>
          </div>
          <div className="text-2xl font-bold text-white">{pending.length}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Check size={14} className="text-teal" />
            <span className="text-xs text-white/40 uppercase tracking-wider">Approved</span>
          </div>
          <div className="text-2xl font-bold text-white">{items.filter((i) => i.status === 'approved').length}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <X size={14} className="text-red-400" />
            <span className="text-xs text-white/40 uppercase tracking-wider">Rejected</span>
          </div>
          <div className="text-2xl font-bold text-white">{items.filter((i) => i.status === 'rejected').length}</div>
        </GlassCard>
      </div>

      {/* Flagged items */}
      <div className="space-y-3">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-flame/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-flame" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
                    <span className="text-[10px] text-white/30 px-1.5 py-0.5 bg-white/5 rounded">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{t('flaggedBy')} {item.flaggedBy}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-lg text-xs text-red-400">
                    <AlertTriangle size={11} />
                    {item.reason}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} />
                {item.status === 'pending' && (
                  <>
                    <NeonButton variant="teal" size="sm" onClick={() => handleAction(item.id, 'approve')}>
                      <Check size={14} /> {t('approve')}
                    </NeonButton>
                    <NeonButton variant="ghost" size="sm" onClick={() => handleAction(item.id, 'reject')}>
                      <X size={14} /> {t('reject')}
                    </NeonButton>
                  </>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
