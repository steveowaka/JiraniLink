import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


function ProtectedRoute({children}){
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading...</p>
            </main>
        )
    }

     if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location, message: "Please log in to continue." }}
            />
        )
    }

    return children

}

export default ProtectedRoute;