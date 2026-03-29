 
 
 
 export const userLogin = async (credentials) => {
    const api = 'http://localhost:5000/api/auth/login';
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
