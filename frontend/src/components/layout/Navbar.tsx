'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LANGUAGES } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, logout } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [userOpen, setUserOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function selectLang(lang: typeof LANGUAGES[0]) {
    setCurrentLang(lang);
    setLangOpen(false);
    document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang.code;
  }

  const navLinks = [
    { href: '/chat', label: 'Chat Hub' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/discover', label: 'Discover New' },
    { href: '/agents', label: 'Agents' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2.5rem',
      background: 'rgba(244,242,238,0.92)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      {/* Logo */}
      <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', textDecoration: 'none' }}>
        <div style={{ width: 26, height: 26, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 14 14" width={14} height={14} fill="white"><path d="M7 1 L13 7 L7 13 L1 7 Z"/></svg>
        </div>
        NexusAI
      </Link>

      {/* Nav Links */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', listStyle: 'none' }}>
        {navLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} style={{
              fontSize: '0.85rem',
              color: isActive(link.href) ? 'var(--accent)' : 'var(--text2)',
              textDecoration: 'none',
              fontWeight: isActive(link.href) ? 600 : 400,
              transition: 'color 0.2s',
            }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Language Selector */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.45rem 0.8rem', background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {currentLang.code.toUpperCase()}
            <svg viewBox="0 0 10 6" width={10} height={6} fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M1 1l4 4 4-4"/></svg>
          </button>

          {langOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', minWidth: 195, zIndex: 500, overflow: 'hidden', animation: 'fadeUp 0.18s ease' }}>
              <div style={{ padding: '0.6rem 1rem 0.4rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>Language</div>
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => selectLang(lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '0.55rem 1rem', background: currentLang.code === lang.code ? 'var(--accent-lt)' : 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: currentLang.code === lang.code ? 'var(--accent)' : 'var(--text2)', textAlign: 'left', transition: 'background 0.12s', fontWeight: currentLang.code === lang.code ? 600 : 400 }}>
                  <span>{lang.flag}</span> {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {auth.isAuthenticated ? (
          <div ref={userRef} style={{ position: 'relative' }}>
            <button onClick={() => setUserOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.45rem 1rem', background: 'var(--accent-lt)', border: '1px solid var(--accent-border)', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                {auth.user?.name?.charAt(0).toUpperCase()}
              </div>
              {auth.user?.name?.split(' ')[0]}
            </button>
            {userOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', minWidth: 180, zIndex: 500, overflow: 'hidden' }}>
                <Link href="/dashboard" onClick={() => setUserOpen(false)} style={{ display: 'block', padding: '0.6rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', textDecoration: 'none' }}>Dashboard</Link>
                <Link href="/dashboard/history" onClick={() => setUserOpen(false)} style={{ display: 'block', padding: '0.6rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', textDecoration: 'none' }}>Chat History</Link>
                <Link href="/dashboard/settings" onClick={() => setUserOpen(false)} style={{ display: 'block', padding: '0.6rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', textDecoration: 'none' }}>Settings</Link>
                <div style={{ borderTop: '1px solid var(--border)' }}/>
                <button onClick={() => { logout(); setUserOpen(false); router.push('/'); }} style={{ display: 'block', width: '100%', padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/auth/login" style={{ fontFamily: 'inherit', border: '1px solid var(--border2)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, borderRadius: '2rem', padding: '0.55rem 1.25rem', background: 'none', color: 'var(--text)', textDecoration: 'none', transition: 'all 0.2s' }}>
              Sign in
            </Link>
            <Link href="/auth/signup" style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, borderRadius: '2rem', padding: '0.55rem 1.25rem', background: 'var(--accent)', color: 'white', textDecoration: 'none', transition: 'all 0.2s' }}>
              Get Started →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
