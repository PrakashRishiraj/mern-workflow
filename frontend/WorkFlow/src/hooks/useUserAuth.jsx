import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext); // Fixed: loadig -> loading
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for loading to complete
        if (loading) return;
        
        // If user exists, everything is fine
        if (user) return;

        // If not loading and no user, redirect to login
        if (!user) {
            clearUser(); // Clean up any stale data
            navigate("/login", { replace: true }); // Use replace to prevent back button issues
        }
    }, [user, loading, clearUser, navigate]); // Fixed: loadig -> loading

    return { user, loading }; // Return these for components to use
};