function FormField({ label, name, error, children }) {
    return (
        <div>
            <label htmlFor={name} className="block text-lg font-semibold text-gray-800 mb-2">
                {label}
            </label>
            {children}
            {error && (
                <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormField