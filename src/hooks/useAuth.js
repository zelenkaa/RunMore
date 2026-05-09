import { useState, useEffect } from 'react';

export default function useAuth() {
    const [debug, setDebug] = useState(null);
    const [clientPrincipal, setClientPrincipal] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLogin = async () => {

            const res = await fetch('/.auth/me');
            try {
                const data = await res.json();
                setDebug(false);
                setClientPrincipal(data.clientPrincipal);
            } catch {
                setDebug(true);
                setClientPrincipal({ "userId": "add85db9ad7fa2ea87a10483759a17aa", "userRoles": ["anonymous", "authenticated"], "claims": [], "identityProvider": "aad", "userDetails": "azelenka@interiorrunningassociation.com" });
            }
        };

        checkLogin();
    }, []);

    useEffect(() => {
        if (clientPrincipal === null) return;

        const fetchUserId = async () => {
            const res = await fetch(debug ? '/test_data/login.json' : '/api/login');
            const data = await res.json();
            setUser(data);
        };
        fetchUserId();
    }, [clientPrincipal]);


    const deauthorize = async () => {
        const res = await fetch('/api/deauthorize', { method: 'POST' });
        const data = await res.json();
        setUser(data);
    };


    return { debug, clientPrincipal, user, deauthorize };

}