import './login.scss'
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../Hooks/AuthContext'
import { useNavigate } from 'react-router-dom'
export default function LoginForm({ isForm, setIsForm }) {
    const [showSignup, setShowSignup] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { login, register } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            let result
            if (showSignup) {
                result = await register({ name, email, password })
                console.log(result)
            } else {
                result = await login({ email, password })
            }

            if (result && result.success) {
                setIsForm(false)
                resetStates()
                console.log("Success:", result)
                if(result.user.role==="admin"){
                    navigate('/admin')
                }
                
            } else {
                setError(result?.message || 'Login failed. Please try again.')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
            console.log("Submit Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const resetStates = () => {
        setEmail('')
        setPassword('')
        setError('')
    }
    const toggleSignup = (e) => {
        e.preventDefault()
        setShowSignup(!showSignup)
        resetStates()
    }

    const toggleForm = () => {
        setIsForm(false)
        resetStates()
    }

    return (
        <>
            {isForm && (
                <section className='loginForm'>
                    <form onSubmit={handleSubmit}>
                        <span onClick={toggleForm} style={{ cursor: "pointer" }}>
                            <X size={20} />
                        </span>

                        <h1 style={{ color: showSignup ? "green" : "var(--primary-color)" }}>
                            {showSignup ? "Create Admin Account" : "Admin Login"}
                        </h1>

                        {error && <div className="error-message">{error}</div>}

                        {showSignup && (
                            <div className="inputSection">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter your username"
                                />
                            </div>
                        )}

                        <div className="inputSection">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="inputSection">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className='inputSection'>
                            <button type='submit' disabled={loading}>
                                {loading ? (
                                    <Loader2 size={20} className="loading-spinner" />
                                ) : showSignup ? (
                                    <UserPlus size={20} />
                                ) : (
                                    <LogIn size={20} />
                                )}
                                {loading ? "Processing..." : showSignup ? "Create Account" : "Login"}
                            </button>
                        </div>

                        <div className='inputSection'>
                            <span>
                                {showSignup ? "Already have an account? " : "Don't have an account? "}
                                <a href="" onClick={toggleSignup}>
                                    {showSignup ? "Login" : "Create account"}
                                </a>
                            </span>
                        </div>
                    </form>
                </section>
            )}
        </>
    )
}