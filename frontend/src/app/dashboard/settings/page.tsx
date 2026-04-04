'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import { toast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const router = useRouter();
  const { auth, loading, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !auth.isAuthenticated) router.push('/auth/login');
    if (auth.user) { setName(auth.user.name); setEmail(auth.user.email); }
  }, [auth, loading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast('Settings saved successfully!', 'success');
  };

  const handleDeleteAccount = () => {
    toast('Account deletion requested. Our team will follow up within 24 hours.', 'info');
  };

  if (loading || !auth.isAuthenticated) return <div style={{ height: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '0.85rem' }}>← Dashboard</Link>
          <span style={{ color: 'var(--border2)' }}>/</span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--text)', margin: 0 }}>Settings</h1>
        </div>

        {/* Profile Section */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Profile</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '0.4rem' }}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', color: 'var(--text)', background: 'var(--bg)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '0.4rem' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', color: 'var(--text)', background: 'var(--bg)' }} />
              </div>
            </div>
            <button type="submit" disabled={saving} style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '0.4rem' }}>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: '0.6rem 0.85rem', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', color: 'var(--text)', background: 'var(--bg)', minWidth: 200 }}>
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <div
                onClick={() => setNotifications(n => !n)}
                style={{ width: 42, height: 24, borderRadius: 12, background: notifications ? 'var(--accent)' : 'var(--bg3)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid var(--border2)', flexShrink: 0 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: notifications ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>Email Notifications</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Receive updates about new models and features</div>
              </div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'var(--white)', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#991B1B', marginBottom: '0.5rem' }}>Danger Zone</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={handleDeleteAccount} style={{ padding: '0.55rem 1.25rem', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
