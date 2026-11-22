const COUNTRY_CODE = "ke"
const MIN_GAP_MS = 1100

const cache = new Map()
let lastRequestTime = 0

export async function searchLocation(query) {
    const key = query.trim().toLowerCase()

    if (!key) {
        return []
    }

    if (cache.has(key)) {
        return cache.get(key)
    }

    const wait = MIN_GAP_MS - (Date.now() - lastRequestTime)
    if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait))
    }
    lastRequestTime = Date.now()

    const params = new URLSearchParams({
        q: query.trim(),
        format: "jsonv2",
        countrycodes: COUNTRY_CODE,
        limit: "5",
    })

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`)

    if (!response.ok) {
        throw new Error(`Nominatim request failed: ${response.status}`)
    }

    const data = await response.json()

    const results = data.map((item) => ({
        id: item.place_id,
        name: item.display_name,
        lat: Number(item.lat),
        lon: Number(item.lon),
    }))

    cache.set(key, results)
    return results
}