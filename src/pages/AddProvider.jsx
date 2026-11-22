import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { CATEGORIES } from "../constants/categories"
import FormField from "../components/FormField"
import { searchLocation } from "../services/geocode"

const inputClass = "w-full h-[44px] border-2 border-gray-400 rounded-lg px-3 text-based outline-none focus:border-green-700"
const textareaClass = "w-full min-h-[80px] border-2 border-gray-400 rounded-lg px-3 py-2 text-based outline-none focus:border-green-700"

const emptyForm = {
    name: "",
    category: "",
    location: "",
    phone: "",
    description: "",
    hireAgain: "",
    reviewText: "",
}

function AddProvider() {

    const { user } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState(emptyForm)
    const [errors, setErrors] = useState({})
    const [submitError, setSubmitError] = useState("")
    const [loading, setLoading] = useState(false)

    const [coordinates, setCoordinates] = useState(null)
    const [locationResults, setLocationResults] = useState([])
    const [searchingLocation, setSearchingLocation] = useState(false)
    const [locationMessage, setLocationMessage] = useState("")

    function handleChange(e) {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (name === "location") {
            setCoordinates(null)
            setLocationResults([])
            setLocationMessage("")
        }
    }

    async function handleLocationSearch() {
        const term = formData.location.trim()

        if (!term) {
            setErrors((prev) => ({ ...prev, location: "Type a place to search for." }))
            return
        }

        setErrors((prev) => ({ ...prev, location: "" }))
        setSearchingLocation(true)
        setLocationMessage("")
        setLocationResults([])

        try {
            const results = await searchLocation(term)

            if (results.length === 0) {
                setLocationMessage("No places found. Try a nearby area or a landmark.")
            }
            setLocationResults(results)
        } catch (error) {
            console.error("Location search error:", error)
            setLocationMessage("Could not search places right now. You can still type your location and save.")
        } finally {
            setSearchingLocation(false)
        }
    }

    function handleSelectLocation(place) {
        const shortName = place.name.split(", ").slice(0, 3).join(", ")

        setFormData((prev) => ({ ...prev, location: shortName }))
        setCoordinates({ lat: place.lat, lon: place.lon })
        setLocationResults([])
        setLocationMessage("")
    }

    function validate() {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Please enter the provider's name."
        }
        if (!formData.category) {
            newErrors.category = "Please choose a category."
        }
        if (!formData.location.trim()) {
            newErrors.location = "Please enter a location."
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Please enter a phone number."
        } else if (!/^[0-9+\s-]{9,15}$/.test(formData.phone.trim())) {
            newErrors.phone = "Enter a valid phone number, e.g. 0712 345 678."
        }
        if (!formData.description.trim()) {
            newErrors.description = "Please describe the service."
        }
        if (!formData.hireAgain) {
            newErrors.hireAgain = "Please choose Yes or No."
        }
        if (!formData.reviewText.trim()) {
            newErrors.reviewText = "Please write a short review."
        }

        return newErrors
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitError("")

        const newErrors = validate()
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        setLoading(true)

        try {
            const authorName = user.displayName || "Anonymous"

            await addDoc(collection(db, "providers"), {
                name: formData.name.trim(),
                category: formData.category,
                location: formData.location.trim(),
                phone: formData.phone.trim(),
                description: formData.description.trim(),
                createdBy: user.uid,
                createdByName: authorName,
                createdAt: serverTimestamp(),
                reviews: [
                    {
                        authorName,
                        hireAgain: formData.hireAgain === "yes",
                        text: formData.reviewText.trim(),
                    },
                ],
            })

            navigate("/providers")
        } catch (error) {
            console.error("Add provider error:", error.code)
            if (error.code === "permission-denied") {
                setSubmitError("You don't have permission to add a provider. Please log in again.")
            } else if (error.code === "unavailable") {
                setSubmitError("Network error. Please check your internet connection.")
            } else {
                setSubmitError("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }

    }

    return (
        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-white">

            <section className="w-full max-w-[680px] border-2 border-gray-300 rounded-2xl p-5 sm:p-6">

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Add a Provider</h1>

                {submitError && (
                    <p
                        role="alert"
                        className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700"
                    >
                        {submitError}
                    </p>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    <FormField label="Provider name" name="name" error={errors.name}>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Category" name="category" error={errors.category}>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            aria-invalid={!!errors.category}
                            aria-describedby={errors.category ? "category-error" : undefined}
                            className={inputClass}
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Location" name="location" error={errors.location}>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleLocationSearch()
                                    }
                                }}
                                aria-invalid={!!errors.location}
                                aria-describedby={errors.location ? "location-error" : undefined}
                                className={`${inputClass} min-w-0 flex-1`}
                            />
                            <button
                                type="button"
                                onClick={handleLocationSearch}
                                disabled={searchingLocation}
                                className="h-[58px] px-6 border-2 border-green-700 text-green-700 rounded-xl font-semibold hover:bg-green-50 disabled:opacity-60 transition"
                            >
                                {searchingLocation ? "Searching..." : "Search place"}
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Optional: search to pin the exact place on the map.
                        </p>

                        {locationMessage && (
                            <p role="status" className="mt-2 text-sm text-gray-700">{locationMessage}</p>
                        )}

                        {locationResults.length > 0 && (
                            <ul className="mt-3 border-2 border-gray-300 rounded-xl divide-y divide-gray-200">
                                {locationResults.map((place) => (
                                    <li key={place.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectLocation(place)}
                                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50"
                                        >
                                            {place.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {coordinates && (
                            <p role="status" className="mt-2 text-sm font-semibold text-green-700">
                                ✓ Place pinned on the map
                            </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">Place search by © OpenStreetMap contributors</p>
                    </FormField>

                    <FormField label="Phone number" name="phone" error={errors.phone}>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? "phone-error" : undefined}
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Description" name="description" error={errors.description}>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? "description-error" : undefined}
                            className={textareaClass}
                        />
                    </FormField>

                    <fieldset>
                        <legend className="block text-lg font-semibold text-gray-800 mb-2">
                            Would you hire them again?
                        </legend>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-2 text-lg text-gray-700">
                                <input
                                    type="radio"
                                    name="hireAgain"
                                    value="yes"
                                    checked={formData.hireAgain === "yes"}
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-green-700"
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2 text-lg text-gray-700">
                                <input
                                    type="radio"
                                    name="hireAgain"
                                    value="no"
                                    checked={formData.hireAgain === "no"}
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-green-700"
                                />
                                No
                            </label>
                        </div>
                        {errors.hireAgain && (
                            <p className="mt-1 text-sm text-red-600">{errors.hireAgain}</p>
                        )}
                    </fieldset>

                    <FormField label="Your review" name="reviewText" error={errors.reviewText}>
                        <textarea
                            id="reviewText"
                            name="reviewText"
                            value={formData.reviewText}
                            onChange={handleChange}
                            aria-invalid={!!errors.reviewText}
                            aria-describedby={errors.reviewText ? "reviewText-error" : undefined}
                            className={textareaClass}
                        />
                    </FormField>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[68px] bg-green-700 text-white text-lg font-semibold rounded-xl hover:bg-green-800 disabled:opacity-60 transition"
                    >
                        {loading ? "Saving..." : "Add Provider"}
                    </button>


                </form>
            </section>
        </main>
    )
}





export default AddProvider;