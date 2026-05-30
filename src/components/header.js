'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './auth/AuthContext';

export default function Header() {
    const router = useRouter();
    const { isLoggedIn, imageUser } = useAuth();
    const [isSearchFocused, setSearchFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTerm.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
        }
    };

    return (
        <header className="header-container">
            <div className="header-brand">
                <Link href={isLoggedIn ? '/home' : '/'} className="logo-link">
                    HyperPlus <span className="logo-highlight">FT</span>
                </Link>
            </div>

            <div className="header-actions">
                <div className={`search-wrapper ${isSearchFocused ? 'active' : ''}`}>
                    <form onSubmit={handleSearch}>
                        <button type="submit" className="search-icon-btn">
                            search
                        </button>

                        <input
                            type="text"
                            name="query"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </form>
                </div>

                {isLoggedIn ? (
                    <Link href="/settings">
                        <img
                        src={imageUser}
                        alt="Perfil"
                        draggable={false}
                        className="user-avatar"
                        onClick={() => router.push('/settings')}
                        style={{
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                        />
                    </Link>
                    
                ) : (
                    <button
                        className="btn-login"
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}