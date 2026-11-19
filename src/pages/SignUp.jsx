import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth'
import { auth } from '../firebase'

function SignUp() {

    const navigate = useNavigate()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSignUp(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const userCridential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            await updateProfile(userCridential.user, {
                displayName: fullName
            })

            await signOut(auth)

            navigate('/login', {
                state: {
                    message: 'Account created successfully. Please log in'
                }
            })
        } catch (error) {
            if (error.code === "auth/email-already-in-us") {
                setError("Email already in use. Please use another email.")

            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address")
                
            } else if (error.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.')
            }

            else if (error.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection.')
            }

            else {
                setError('Something went wrong. Please try again.')
            }
        }

        finally {
            setLoading(false)
        }
    }

    async function handleGoogleSignUp() {
        setError("")
        setLoading(true)

        try {
            const provider = new GoogleAuthProvider()

            await signInWithPopup(auth, provider)

            navigate('/')

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-10 bg-white">

            <section className="w-full max-w-[680px] border-2 border-gray-300 rounded-2xl p-6 sm:p-8">

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Sign Up</h1>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">Full name</label>
                        <input type="text"
                            value={fullName}
                            required
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full h-[68px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700" />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">Email address</label>
                        <input type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-[68px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"
                        />

                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">password</label>
                        <input type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full h-[68px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="w-full h-[68px] bg-green-700 text-white text-lg font-semibold rounded-xl hover:bg-green-800 disabled:opacity-60 transition"
                    >{loading ? 'Creating Account...' : 'Create Account'}</button>
                </form>

                <p className="text-center text-lg text-gray-600">or</p>

                <button type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full h-[68px] border-2 border-green-700 text-green-700 text-lg font-semibold rounded-xl hover:bg-green-50 disabled:opacity-60 transition">Continue with Google</button>

                <p className="text-center text-lg text-gray-600 mt-7">Already have an account? {""}
                    <Link to="/login" className="hover:text-green-700">
                        Log In
                    </Link>
                </p>

            </section>

        </main>


    )
}

export default SignUp;