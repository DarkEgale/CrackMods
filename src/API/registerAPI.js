


export const registerUser = async (userData) => {
    const api = `${import.meta.env.VITE_API_URL}api/auth/register`; // API URL from environment variable
    try {
        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include' 
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Registration failed");
        }

        return data;

    } catch (error) {
        console.error("Register Error:", error.message);
        throw error;
    }
};