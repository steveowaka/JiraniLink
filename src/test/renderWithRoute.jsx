import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

const futureFlags = { v7_startTransition: true, v7_relativeSplatPath: true }

export function renderWithRouter(ui, { route = "/", state } = {}) {
    const entry = state ? { pathname: route, state } : route

    return render(
        <MemoryRouter initialEntries={[entry]} future={futureFlags}>
            {ui}
        </MemoryRouter>
    )
}