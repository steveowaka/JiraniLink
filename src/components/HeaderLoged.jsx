import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useAuth } from "../context/AuthContext"

function Header() {

    const { user, loading } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        try {
            await signOut(auth)
            navigate("/")
        } catch (error) {
            console.log("Logout error:", error.code)
        }
    }

    const firstName = user?.displayName?.split(" ")[0] || "there"
    return (
        <header className="w-full h-20 px-[5%] flex items-center justify-between bg-white border-b border-gray-200">

            <div>
                <Link to="/" className="text-2xl font-bold text-green-700">JiraniLink</Link>
            </div>

            <nav className="flex items-center gap-10">
                <Link to="/" className="text-gray-700 font-medium hover:text-green-700 transition">Home</Link>
                <Link to="/providers" className="text-gray-700 font-medium hover:text-green-700 transition">Providers</Link>
                {user && (
                    <Link to="/addprovider" className="text-gray-700 font-medium hover:text-green-700 transition">Add Provider</Link>
                )}
            </nav>

            <div className="flex items-center gap-4">
                {loading ? null : user ? (
                    <>
                        <span className="hidden md:block text-gray-700 font-medium">Hi, {firstName}</span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">Login</Link>
                        <Link to="/signup" className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition">Sign Up</Link>
                    </>
                )}
            </div>

        </header>
    )
}

export default Header;