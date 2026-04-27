'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCookie } from './auth/Cookies.js'; 
import menu from './menu.js';

export default function Header() {
    const router = useRouter();
    const [isSearchFocused, setSearchFocused] = useState(false);
    const [imageUser, setImageUser] = useState('/img/default.jpg');
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadUserData() {
            const token = await getCookie('token');
            if (token) {
                setIsLoggedIn(true);
                await fetchUserImage(token);
            }
        }
        loadUserData();
    }, []);

    async function fetchUserImage(token) {
        try {
            const resImage = await fetch(`${menu.Server_api}/user/image`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (resImage.ok) {
                const blob = await resImage.blob();
                const url = URL.createObjectURL(blob);
                setImageUser(url);
            }
        } catch (err) {
            console.error("Erro ao pegar imagem de perfil:", err);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="header-container">
            <div className="header-brand">
                <Link href={isLoggedIn? ('/home'): ('/')} className="logo-link"> 
                    HyperPlus <span className="logo-highlight">FT</span>
                </Link>
            </div>
            
            <div className="header-actions">
                <div className={`search-wrapper ${isSearchFocused ? 'active' : ''}`}>
                    <form onSubmit={handleSearch}>
                        <button type="submit" className="search-icon-btn">
                            {/*<span className="search-icon">search</span>*/}search
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
                    <img 
                        src={imageUser} 
                        alt="Perfil"
                        className="user-avatar" 
                        onClick={() => router.push('/settings')}
                        style={{ cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <button 
                        className="btn-login" 
                        onClick={() => router.push("/login")}
                    > 
                        Login 
                    </button>
                )}
            </div>
        </header>
    );
}