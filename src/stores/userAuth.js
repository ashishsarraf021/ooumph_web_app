import { create } from 'zustand';


// Use localStorage here

// Handle the case where localStorage is not available

const useAuthStore = create((set) => ({
    authToken: null,
    refreshToken: null,

    setAuthToken: (token) => {
        set({ authToken: token });
        // Save the authToken to local storage
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('authToken', token);
        }
    },

    setRefreshToken: (token) => {
        set({ refreshToken: token });
        // Save the refreshToken to local storage
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('refreshToken', token);
        }
    },

    removeTokens: () => {
        set({ authToken: null, refreshToken: null });
        // Remove the tokens from local storage
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
        }
    },
}));

// Check for and set initial values from local storage during store creation
let storedAuthToken = null;
let storedRefreshToken = null;

if (typeof window !== 'undefined' && window.localStorage) {
    storedAuthToken = localStorage.getItem('authToken');
    storedRefreshToken = localStorage.getItem('refreshToken');
}

if (storedAuthToken) {
    useAuthStore.setState({ authToken: storedAuthToken });
}

if (storedRefreshToken) {
    useAuthStore.setState({ refreshToken: storedRefreshToken });
}


export default useAuthStore;
