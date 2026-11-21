import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { CATEGORIES } from "../constants/categories"
import FormField from "../components/FormField"
import { log } from "firebase/crashlytics"

const inputClass = "w-full h-[58px] border-2 border-gray-400 rounded-xl px-4 text-lg outline-none focus:border-green-700"
const textareaClass = "w-full min-h-[120px] border-2 border-gray-400 rounded-xl px-4 py-3 text-lg outline-none focus:border-green-700"

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


    function handleChange(e) {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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

            <section className="w-full max-w-[680px] border-2 border-gray-300 rounded-2xl p-6 sm:p-8">

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
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            aria-invalid={!!errors.location}
                            aria-describedby={errors.location ? "location-error" : undefined}
                            className={inputClass}
                        />
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