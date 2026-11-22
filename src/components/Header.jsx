import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

function Header() {

    const { user, loading } = useAuth()
    const navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false)

    function closeMenu() {
        setMenuOpen(false)
    }

    async function handleLogout() {
        closeMenu()

        try {
            await signOut(auth)
            navigate("/"), { state: { message: "You have been logged out." } }
        } catch (error) {
            console.error("Logout error:", error.code)
        }
    }

    const firstName = user?.displayName?.split(" ")[0] || "there"
    return (
        <header className="relative w-full h-20 px-[5%] flex items-center justify-between bg-white border-b border-gray-200">

            <div>
                <Link to="/" className="text-2xl font-bold text-green-700">JiraniLink</Link>
            </div>

            <nav className="hidden lg:flex items-center gap-10">
                <Link to="/" className="text-gray-700 font-medium hover:text-green-700 transition">Home</Link>
                <Link to="/providers" className="text-gray-700 font-medium hover:text-green-700 transition">Providers</Link>
                {user && (
                    <Link to="/addprovider" className="text-gray-700 font-medium hover:text-green-700 transition">Add Provider</Link>
                )}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
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

            <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="lg:hidden h-11 w-11 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-700 hover:bg-gray-50"
            >
                <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            </button>

            {menuOpen && (
                <div
                    id="mobile-menu"
                    className="absolute top-20 left-0 z-50 w-full flex flex-col gap-4 bg-white border-b border-gray-200 shadow-md px-[5%] py-5 lg:hidden"
                >
                    {user && <p className="text-gray-700 font-medium">Hi, {firstName}</p>}

                    <Link to="/" onClick={closeMenu} className="text-lg text-gray-700 font-medium hover:text-green-700 transition">Home</Link>
                    <Link to="/providers" onClick={closeMenu} className="text-lg text-gray-700 font-medium hover:text-green-700 transition">Providers</Link>
                    {user && (
                        <Link to="/addprovider" onClick={closeMenu} className="text-lg text-gray-700 font-medium hover:text-green-700 transition">Add Provider</Link>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        {loading ? null : user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold text-center hover:bg-green-50 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold text-center hover:bg-green-50 transition">Login</Link>
                                <Link to="/signup" onClick={closeMenu} className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold text-center hover:bg-green-800 transition">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}

        </header>
    )
}

export default Header;