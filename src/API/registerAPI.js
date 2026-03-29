


export const registerUser = async (userData) => {
    const api = 'http://localhost:5000/api/auth/register';
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