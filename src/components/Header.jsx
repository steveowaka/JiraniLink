import {Link} from "react-router-dom"


function Header(){
    return(
        <header className="w-full h-20 px-[5%] flex items-center justify-between bg-white border-b border-gray-200">

            <div>
                <Link to="/" className="text-2xl font-bold text-green-700">JiraniLink</Link>
            </div>

            <nav className="flex items-center gap-10">
                <Link to="/" className="text-gray-700 font-medium hover:text-green-700 transition">Home</Link>
                <Link to="/Providers" className="text-gray-700 font-medium hover:text-green-700 transition">Providers</Link>
            </nav>

            <div className="flex items-center gap-4">
                <Link to="/Login" className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">Login</Link>
                <Link to="/Sign Up" className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition">Sign Up</Link>
            </div>

        </header>
    )
}

export default Header;