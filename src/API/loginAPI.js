 
 
 
 export const userLogin = async (credentials) => {
    const api = `${import.meta.env.VITE_API_URL}api/auth/login`; // API URL from environment variable';
    try {
        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
            credentials: 'include' 
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data; 

    } catch (error) {


        
        console.error('Login Error:', error.message);
        throw error; 
    }
};
