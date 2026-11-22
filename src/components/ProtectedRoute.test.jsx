import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ProtectedRoute from "./ProtectedRoute"

vi.mock("../context/AuthContext", () => ({ useAuth: vi.fn() }))

function LoginProbe() {
    const location = useLocation()
    return (
        <div>
            <p>Login page</p>
            <p>{location.state?.message}</p>
        </div>
    )
}

function renderProtected() {
    render(
        <MemoryRouter initialEntries={["/secret"]}>
            <Routes>
                <Route path="/login" element={<LoginProbe />} />
                <Route
                    path="/secret"
                    element={
                        <ProtectedRoute>
                            <p>Secret content</p>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe("ProtectedRoute", () => {
    it("shows a loading message while Firebase checks the session", () => {
        useAuth.mockReturnValue({ user: null, loading: true })
        renderProtected()

        expect(screen.getByText("Loading...")).toBeInTheDocument()
        expect(screen.queryByText("Secret content")).not.toBeInTheDocument()
    })

    it("redirects to the login page when nobody is logged in", () => {
        useAuth.mockReturnValue({ user: null, loading: false })
        renderProtected()

        expect(screen.getByText("Login page")).toBeInTheDocument()
        expect(screen.getByText("Please log in to continue.")).toBeInTheDocument()
    })

    it("shows the page when a user is logged in", () => {
        useAuth.mockReturnValue({ user: { uid: "u1" }, loading: false })
        renderProtected()

        expect(screen.getByText("Secret content")).toBeInTheDocument()
    })
})