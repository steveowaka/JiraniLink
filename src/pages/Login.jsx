import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

function Login() {

    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const successMessage = location.state?.message
    


    async function handleLogin(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch (error) {
            console.error("Firebase login error:", error.code);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                setError("Incorrect email or password. Please try again.")
            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address.")

            } else if (error.code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again later.")

            } else if (error.code === "auth/network-request-failed") {
                setError("Network error. Please check your internet connection.")

            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }


    async function handleGoogleLogin() {
        setError("")
        setLoading(true)

        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            navigate("/")
        } catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                setError("Google sign-in was cancelled.");
            } else if (error.code === "auth/network-request-failed") {
                setError("Network error. Please check your internet connection.");
            } else {
                setError("Unable to sign in with Google. Please try again.");
            }
        } finally {
            setLoading(false)
        }

    }




    return (
        <main className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-10 bg-white">
            <section className="w-full max-w-[680px] border-2 border-gray-300 rounded-2xl p-6 sm:p-8">

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Log In</h1>

                <p className="text-center text-lg text-gray-600 mb-6">Log in to add providers, write reviews and save favourites</p>


                {successMessage && (
                    <p
                        role="status"
                        className="mb-5 rounded-xl border-2 border-green-700 bg-green-50 px-4 py-3 text-green-800"
                    >
                        {successMessage}
                    </p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700"
                    >
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-2">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full h-[58px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"

                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-semibold text-gray-800 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full h-[58px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"
                        />
                    </div>

                    <button 
                    type="submit"
                        disabled={loading} 
                        className="w-full h-[68px] bg-green-700 text-white text-lg font-semibold rounded-xl hover:bg-green-800 disabled:opacity-60 transition">{loading ? "Logging in..." : "Log In"}</button>
                   </form>

                    <p className="text-center text-lg text-gray-600 my-5">or</p>
                   
                    <button  
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-[68px] border-2 border-green-700 text-green-700 text-lg font-semibold rounded-xl hover:bg-green-50 disabled:opacity-60 transition">Continue with Google</button>
                   
                    <p className="text-center text-lg text-gray-600 mt-6">Don't have an account?{" "}
                         <Link to="/signup" className="hover:text-green-700">Sign Up</Link> 
                    </p>

                
            </section>
        </main>
    )
}

export default Login;