import { useState } from 'react';
import { I18nProvider } from '@/i18nContext';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { AuthPage } from '@/pages/AuthPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { CreatePage } from '@/pages/CreatePage';
import { AssetsPage } from '@/pages/AssetsPage';
import { AdminPage } from '@/pages/AdminPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  const [page, setPage] = useState<PageKey>('auth');
  const [authed, setAuthed] = useState(false);
  const [credits] = useState(720);

  const handleAuth = () => {
    setAuthed(true);
    setPage('explore');
  };

  const showSidebar = authed && page !== 'auth';

  return (
    <I18nProvider>
      <div className="min-h-screen bg-ink-950">
        {page === 'auth' || !authed ? (
          <AuthPage onAuth={handleAuth} />
        ) : (
          <div className="flex">
            {showSidebar && (
              <Sidebar
                current={page}
                onNavigate={setPage}
                credits={credits}
                unreadNotifs={3}
              />
            )}
            <main className={`flex-1 ${showSidebar ? 'lg:ml-[260px]' : ''} min-h-screen`}>
              <div className="pt-16 lg:pt-0">
                {page === 'explore' && <ExplorePage />}
                {page === 'create' && <CreatePage />}
                {page === 'assets' && <AssetsPage />}
                {page === 'admin' && <AdminPage />}
                {page === 'notifications' && <NotificationsPage />}
                {page === 'profile' && <ProfilePage />}
              </div>
            </main>
          </div>
        )}
      </div>
    </I18nProvider>
  );
}

export default App;
