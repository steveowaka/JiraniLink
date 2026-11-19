
function Header(){
    return(
        <header className="w-full h-20 px-[5%] flex items-center justify-between bg-white border-b border-gray-200">

            <div>
                <a href="/" className="text-2xl font-bold text-green-700">JiraniLink</a>
            </div>

            <nav className="flex items-center gap-10">
                <a href="/" className="text-gray-700 font-medium hover:text-green-700 transition">Home</a>
                <a href="/Providers" className="text-gray-700 font-medium hover:text-green-700 transition">Providers</a>
            </nav>

            <div className="flex items-center gap-4">
                <a href="/Login" className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">Login</a>
                <a href="/Sign Up" className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition">Sign Up</a>
            </div>

        </header>
    )
}

export default Header;