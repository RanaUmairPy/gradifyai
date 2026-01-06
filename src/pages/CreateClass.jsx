import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeft, AlertTriangle } from "lucide-react";
import BASE_API from "../BaseApi";

const CreateClass = () => {
    const navigate = useNavigate();
    const [className, setClassName] = useState("");
    const [classCode, setClassCode] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");

        if (!className.trim() || !classCode.trim()) {
            setError("Please fill in both class name and class code.");
            return;
        }

        try {
            setCreating(true);
            const res = await fetch(`${BASE_API}api/classclassrooms/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: className.trim(),
                    code: classCode.trim(),
                }),
            });

            if (res.ok) {
                navigate("/teacher");
            } else {
                const data = await res.json();
                setError(
                    data.name?.[0] || data.code?.[0] || data.detail || "Unexpected error."
                );
            }
        } catch (err) {
            console.error(err);
            setError("Network error occurred. Try again.");
        } finally {
            setCreating(false);
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
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlusCircle className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
                    <p className="text-gray-500 mt-2">Set up a new classroom for your students.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Advanced Physics"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Code</label>
                        <input
                            type="text"
                            placeholder="e.g. PHY-101"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {creating ? "Creating..." : "Create Class"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateClass;
