import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // সাধারণ রিয়্যাক্ট প্লাগইন ব্যবহার করুন, জটিল কনফিগ আপাতত বাদ দিন
  ],
  server: {
    // লিনাক্স/কালি ইউজারদের জন্য নিচের watch অংশটি খুবই জরুরি
    watch: {
      usePolling: true, // এটি ফাইল চেঞ্জ ডিটেক্ট করতে সাহায্য করবে
    },
    // প্রক্সি আপনার লাগবে কারণ আপনি ব্যাকএন্ড থেকে ডাটা নিচ্ছেন
    proxy: {
      '/api': {
        target: 'https://crackmods.onrender.com', // আপনার রেন্ডার ব্যাকএন্ড লিঙ্ক
        changeOrigin: true,
        secure: false
      }
    }
  }
})