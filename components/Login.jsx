'use client'

import { useAuth } from "@/context/AuthContext"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Login() {
    const parmas = useSearchParams()
    const isReg = parmas.get('register')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistration, setIsRegistration] = useState(isReg)
    const [error, setError] = useState(null)
    const [authenticating, setAuthenticating] = useState(false)

    const { signup, login } = useAuth()

    async function handleAuthenticate() {
    console.log("Authenticate clicked", { email, password, isRegistration });
    
    if (!email) {
    setError("Email is required.");
    return;
    }
    if (!email.includes('@')) {
    setError("Email must be valid.");
    return;
    }
    if (!password) {
    setError("Password is required.");
    return;
    }
    if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
    }

    setError(null);

    setAuthenticating(true);
    try {
        if (isRegistration) {
            console.log("Signing up...");
            await signup(email, password);
        } else {
            console.log("Logging in...");
            await login(email, password);
        }
        console.log("Authentication successful");
    } catch (err) {
    console.error("Auth error:", err);

    let message = "Something went wrong!";
    const errorText = err.code || err.message || "";

    if (errorText.includes("invalid-email")) message = "Invalid email format.";
    else if (errorText.includes("user-not-found")) message = "No account found with this email.";
    else if (errorText.includes("wrong-password")) message = "Incorrect password.";
    else if (errorText.includes("email-already-in-use")) message = "Email already registered.";
    else if (errorText.includes("weak-password")) message = "Password should be at least 6 characters.";
    else if (errorText.includes("invalid-credential")) message = "Invalid login credentials.";

    setError(message);
    }finally {
        setAuthenticating(false);
    }
}


    return (
        <div className="login">
            <h2>{isRegistration ? 'Create an account' : 'Login'}</h2>
            {error && (
                <div className="">

                    <p>❌ {error}</p>
                </div>
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
            <button onClick={handleAuthenticate} disabled={authenticating}>{authenticating ? 'Submitting...' : 'Submit'}</button>
            <div className="full-line" />
            <div>
                <p>{isRegistration ? 'Already have an account?' : 'Don\'t have an account?'}</p>
                <button onClick={() => {
                    setIsRegistration(!isRegistration)
                }}>{isRegistration ? 'Log in' : 'Sign Up'}</button>
            </div>
        </div>
    )
}