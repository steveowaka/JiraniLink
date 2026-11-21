

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { CATEGORIES } from "../constants/categories"

function Providers() {
    const [providers, setProviders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [searchTerm, setSearchTerm] = useState("")
    const [category, setCategory] = useState("All")

    useEffect(() => {
        async function fetchProviders() {
            try {
                const providersQuery = query(
                    collection(db, "providers"),
                    orderBy("createdAt", "desc")
                )
                const snapshot = await getDocs(providersQuery)

                const list = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))

                setProviders(list)
            } catch (err) {
                console.error("Fetch providers error:", err.code)
                setError("Could not load providers. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchProviders()
    }, [])

    const filteredProviders = providers.filter((provider) => {
        const term = searchTerm.trim().toLowerCase()

        const matchesSearch =
            !term ||
            provider.name.toLowerCase().includes(term) ||
            provider.location?.toLowerCase().includes(term)

        const matchesCategory = category === "All" || provider.category === category

        return matchesSearch && matchesCategory
    })

    return (
        <main className="min-h-[calc(100vh-80px)] bg-white px-4 py-10">
            <section className="w-full max-w-4xl mx-auto">

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Providers</h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">Search by name or location</label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Search by name or location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-[58px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="categoryFilter" className="sr-only">Filter by category</label>
                        <select
                            id="categoryFilter"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full sm:w-56 h-[58px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"
                        >
                            <option value="All">All categories</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && (
                    <p role="status" className="text-lg text-gray-600">Loading providers...</p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700"
                    >
                        {error}
                    </p>
                )}

                {!loading && !error && providers.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-600 mb-4">No providers yet.</p>
                        <Link
                            to="/addprovider"
                            className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
                        >
                            Add the first one
                        </Link>
                    </div>
                )}

                {!loading && !error && providers.length > 0 && filteredProviders.length === 0 && (
                    <p className="text-lg text-gray-600">No providers match your search.</p>
                )}

                {filteredProviders.length > 0 && (
                    <>
                        <p className="mb-4 text-gray-600">
                            Showing {filteredProviders.length} of {providers.length}
                        </p>

                        <ul className="space-y-4">
                            {filteredProviders.map((provider) => (
                                <li
                                    key={provider.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-2 border-gray-300 rounded-2xl p-5"
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{provider.name}</h2>
                                        <p className="mt-1 text-gray-600">{provider.location}</p>
                                        <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                                            {provider.category}
                                        </span>
                                    </div>

                                    <Link
                                        to={`/providers/${provider.id}`}
                                        className="px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold text-center hover:bg-orange-50 transition"
                                    >
                                        View
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

            </section>
        </main>
    )
}

export default Providers;