import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft, AlertTriangle } from "lucide-react";
import BASE_API from "../BaseApi";

const JoinClass = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");

    const handleJoin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");

        if (!code.trim()) {
            setError("Please enter a class code.");
            return;
        }

        try {
            setJoining(true);
            const res = await fetch(`${BASE_API}api/classclassrooms/join/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ code: code.trim() }),
            });

            if (res.ok) {
                navigate("/student");
            } else {
                const data = await res.json();
                setError(
                    data.code?.[0] || data.detail || data.error || "Failed to join class."
                );
            }
        } catch {
            setError("Network error occurred. Please check your connection.");
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Join a Class</h1>
                    <p className="text-gray-500 mt-2">Enter the unique code provided by your teacher.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleJoin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Code</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-center tracking-widest text-lg font-mono placeholder:font-sans placeholder:tracking-normal"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={joining}
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {joining ? "Joining..." : "Join Class"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinClass;
