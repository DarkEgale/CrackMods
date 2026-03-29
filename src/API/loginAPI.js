export const userLogin = async (credentials) => {
    // সরাসরি আপনার রেন্ডার সার্ভারের লগইন ইউআরএল
    const BASE_URL = "https://crackmods.onrender.com/";
    const api = `${BASE_URL}api/auth/login`; 

    try {
        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
            // এটি সেশন কুকি আদান-প্রদানের জন্য জরুরি
            credentials: 'include' 
        });

        const data = await res.json();

        if (!res.ok) {
            // যদি সার্ভার থেকে কোনো এরর মেসেজ আসে
            throw new Error(data.message || "Login failed");
        }

        return data; 

    } catch (error) {
        console.error('Login Error:', error.message);
        throw error; 
    }
};