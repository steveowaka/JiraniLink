import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

function ProviderDetails() {
    const { providerId } = useParams()

    const [provider, setProvider] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchProvider() {
            setLoading(true)
            setNotFound(false)
            setError("")

            try {
                const snapshot = await getDoc(doc(db, "providers", providerId))

                if (snapshot.exists()) {
                    setProvider({ id: snapshot.id, ...snapshot.data() })
                } else {
                    setProvider(null)
                    setNotFound(true)
                }
            } catch (err) {
                console.error("Fetch provider error:", err.code)
                setError("Could not load this provider. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchProvider()
    }, [providerId])

    const reviews = provider?.reviews || []
    const hireAgainCount = reviews.filter((review) => review.hireAgain).length

    const addedOn = provider?.createdAt?.toDate
        ? provider.createdAt.toDate().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : null

    return (
        <main className="min-h-[calc(100vh-80px)] bg-white px-4 py-10">
            <section className="w-full max-w-3xl mx-auto">

                <Link to="/providers" className="inline-block mb-6 text-green-700 font-semibold">
                    &larr; Back to providers
                </Link>

                {loading && (
                    <p role="status" className="text-lg text-gray-600">Loading provider...</p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700"
                    >
                        {error}
                    </p>
                )}

                {notFound && (
                    <div className="text-center py-10">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Provider not found</h1>
                        <p className="text-lg text-gray-600">
                            This provider may have been removed, or the link is incorrect.
                        </p>
                    </div>
                )}

                {provider && (
                    <article>
                        <div className="border-2 border-gray-300 rounded-2xl p-6 sm:p-8">

                            <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                                {provider.category}
                            </span>

                            <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-800">
                                {provider.name}
                            </h1>

                            <dl className="mt-6 space-y-3 text-lg">
                                <div className="flex gap-2">
                                    <dt className="font-semibold text-gray-800">Location:</dt>
                                    <dd className="text-gray-600">{provider.location}</dd>
                                </div>
                                <div className="flex gap-2">
                                    <dt className="font-semibold text-gray-800">Phone:</dt>
                                    <dd>
                                        <a
                                            href={`tel:${provider.phone.replace(/\s+/g, "")}`}
                                            className="text-green-700 font-medium hover:underline"
                                        >
                                            {provider.phone}
                                        </a>
                                    </dd>
                                </div>
                            </dl>

                            {provider.coordinates && (
                                <div className="flex gap-2">
                                    <dt className="font-semibold text-gray-800">Map:</dt>
                                    <dd>
                                        <a
                                            href={`https://www.openstreetmap.org/?mlat=${provider.coordinates.lat}&mlon=${provider.coordinates.lon}#map=16/${provider.coordinates.lat}/${provider.coordinates.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-700 font-medium hover:underline"
                                        >
                                            View on OpenStreetMap
                                        </a>
                                    </dd>
                                </div>
                            )}

                            <p className="mt-6 text-lg text-gray-700">{provider.description}</p>

                            {addedOn && (
                                <p className="mt-6 text-sm text-gray-500">
                                    Added by {provider.createdByName} on {addedOn}
                                </p>
                            )}
                        </div>

                        <div className="mt-8 rounded-2xl bg-[#ECFDF3] border-2 border-green-700 p-6">
                            <h2 className="text-xl font-bold text-gray-800">Review summary</h2>
                            {reviews.length === 0 ? (
                                <p className="mt-2 text-lg text-gray-700">No reviews yet.</p>
                            ) : (
                                <p className="mt-2 text-lg text-gray-700">
                                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}.{" "}
                                    {hireAgainCount} of {reviews.length}{" "}
                                    {reviews.length === 1 ? "person" : "people"} would hire again.
                                </p>
                            )}
                        </div>

                        {reviews.length > 0 && (
                            <ul className="mt-6 space-y-4">
                                {reviews.map((review, index) => (
                                    <li key={index} className="border-2 border-gray-300 rounded-2xl p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="font-semibold text-gray-800">{review.authorName}</p>
                                            <span
                                                className={
                                                    review.hireAgain
                                                        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800"
                                                        : "rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700"
                                                }
                                            >
                                                {review.hireAgain ? "Would hire again" : "Would not hire again"}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-gray-700">{review.text}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                )}

            </section>
        </main>
    )
}

export default ProviderDetails;