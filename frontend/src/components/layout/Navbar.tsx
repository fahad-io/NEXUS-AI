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
    <nav
      style={{
        padding: '0.5rem 1.5rem',
        background: 'linear-gradient(180deg, rgba(242,249,252,0.92), rgba(242,249,252,0.74))',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(71, 99, 119, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'var(--surface)',
          border: '1px solid rgba(71, 99, 119, 0.14)',
          borderRadius: '999px',
          padding: '0.35rem 0.45rem 0.35rem 0.9rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.28rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            color: 'var(--text)',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: 'var(--gradient)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(22,122,139,0.24)',
              border: '1px solid rgba(255,255,255,0.45)',
            }}
          >
            <svg viewBox="0 0 14 14" width={13} height={13} fill="white">
              <path d="M7 1 L13 7 L7 13 L1 7 Z" />
            </svg>
          </div>
          NexusAI
        </Link>

        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            listStyle: 'none',
            padding: '0.12rem',
            background: 'rgba(250, 254, 255, 0.82)',
            borderRadius: '999px',
            border: '1px solid rgba(71, 99, 119, 0.08)',
          }}
        >
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  display: 'block',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  color: isActive(link.href) ? 'var(--accent2)' : 'var(--text2)',
                  textDecoration: 'none',
                  fontWeight: isActive(link.href) ? 700 : 600,
                  background: isActive(link.href) ? 'var(--white)' : 'transparent',
                  boxShadow: isActive(link.href) ? '0 8px 18px rgba(25,71,110,0.08)' : 'none',
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '0.44rem 0.78rem',
                background: 'rgba(250, 254, 255, 0.85)',
                border: '1px solid rgba(71, 99, 119, 0.14)',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text2)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {currentLang.code.toUpperCase()}
              <svg viewBox="0 0 10 6" width={10} height={6} fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>

            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--surface-strong)',
                  border: '1px solid rgba(71, 99, 119, 0.14)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 195,
                  zIndex: 500,
                  overflow: 'hidden',
                  animation: 'fadeUp 0.18s ease',
                }}
              >
                <div
                  style={{
                    padding: '0.65rem 1rem 0.45rem',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.09em',
                    color: 'var(--text3)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  Language
                </div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => selectLang(lang)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '0.58rem 1rem',
                      background: currentLang.code === lang.code ? 'var(--accent-lt)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.82rem',
                      color: currentLang.code === lang.code ? 'var(--accent2)' : 'var(--text2)',
                      textAlign: 'left',
                      fontWeight: currentLang.code === lang.code ? 700 : 500,
                    }}
                  >
                    <span>{lang.flag}</span> {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {auth.isAuthenticated ? (
            <div ref={userRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '0.44rem 0.92rem',
                  background: 'var(--accent-lt)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--accent2)',
                  boxShadow: '0 10px 20px rgba(22,122,139,0.12)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                  }}
                >
                  {auth.user?.name?.charAt(0).toUpperCase()}
                </div>
                {auth.user?.name?.split(' ')[0]}
              </button>
              {userOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--surface-strong)',
                    border: '1px solid rgba(71, 99, 119, 0.14)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: 180,
                    zIndex: 500,
                    overflow: 'hidden',
                  }}
                >
                  <Link href="/dashboard" onClick={() => setUserOpen(false)} style={{ display: 'block', padding: '0.68rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', textDecoration: 'none' }}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/history" onClick={() => setUserOpen(false)} style={{ display: 'block', padding: '0.68rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', textDecoration: 'none' }}>
                    Chat History
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setUserOpen(false)} style={{ display: 'block', padding: '0.68rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', textDecoration: 'none' }}>
                    Settings
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border)' }} />
                  <button
                    onClick={() => {
                      logout();
                      setUserOpen(false);
                      router.push('/');
                    }}
                    style={{ display: 'block', width: '100%', padding: '0.68rem 1rem', fontSize: '0.82rem', color: '#b44766', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                style={{
                  fontFamily: 'inherit',
                  border: '1px solid rgba(71, 99, 119, 0.14)',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  borderRadius: '999px',
                  padding: '0.55rem 1.1rem',
                  background: 'rgba(250, 254, 255, 0.82)',
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                style={{
                  fontFamily: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '0.55rem 1.2rem',
                  background: 'var(--gradient)',
                  color: 'white',
                  textDecoration: 'none',
                  boxShadow: '0 12px 24px rgba(22,122,139,0.2)',
                }}
              >
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
