import { useState } from 'react';
import {
  Heart, MessageCircle, Film, Bell, UserPlus, Check,
  CheckCheck, type LucideIcon,
} from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { GlassCard, Avatar, PageHeader, NeonButton } from '@/components/ui';
import { notifications as initialNotifs, type NotificationItem } from '@/data';

const iconMap: Record<NotificationItem['type'], LucideIcon> = {
  like: Heart,
  comment: MessageCircle,
  render: Film,
  system: Bell,
  follow: UserPlus,
};

const colorMap: Record<NotificationItem['type'], string> = {
  like: 'text-flame bg-flame/10',
  comment: 'text-teal bg-teal/10',
  render: 'text-violet bg-violet/10',
  system: 'text-white/50 bg-white/5',
  follow: 'text-teal bg-teal/10',
};

export function NotificationsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<NotificationItem[]>(initialNotifs);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setItems(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto">
      <PageHeader
        title={t('notificationsTitle')}
        subtitle={unread > 0 ? `${unread} unread` : undefined}
        action={
          unread > 0 && (
            <NeonButton variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck size={16} /> {t('markAllRead')}
            </NeonButton>
          )
        }
      />

      {items.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Bell size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/40">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((notif) => {
            const Icon = iconMap[notif.type];
            return (
              <GlassCard
                key={notif.id}
                className={`p-4 flex items-start gap-3 transition-smooth cursor-pointer hover:border-white/10 ${
                  !notif.read ? 'border-teal/20 bg-teal/[0.02]' : ''
                }`}
                onClick={() => markRead(notif.id)}
              >
                {/* Icon or avatar */}
                {notif.avatar ? (
                  <Avatar src={notif.avatar} size="md" />
                ) : (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[notif.type]}`}>
                    <Icon size={18} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{notif.title}</span>
                    {!notif.read && <span className="w-2 h-2 bg-teal rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">{notif.message}</p>
                  <span className="text-xs text-white/30 mt-1">{notif.time}</span>
                </div>

                {notif.type === 'like' && <Heart size={14} className="text-flame fill-flame mt-1" />}
                {notif.type === 'comment' && <MessageCircle size={14} className="text-teal mt-1" />}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
