import React, { useState } from "react";
import { Save } from "lucide-react";

const AssignmentForm = ({ onSubmit, creating }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        max_marks: "",
        min_words: "",
        dead_line: "",
        required_keywords: "",
    });
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, file, () => {
            // Reset callback
            setFormData({
                title: "",
                description: "",
                max_marks: "",
                min_words: "",
                dead_line: "",
                required_keywords: "",
            });
            setFile(null);
        });
    }

    return (
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 animate-fade-in-down">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Create New Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Data Mining"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Deadline</label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.dead_line}
                            onChange={e => setFormData({ ...formData, dead_line: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed instructions..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Max Marks</label>
                        <input
                            type="number"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.max_marks}
                            onChange={e => setFormData({ ...formData, max_marks: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Min Words</label>
                        <input
                            type="number"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.min_words}
                            onChange={e => setFormData({ ...formData, min_words: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Attachment (PDF/Doc)</label>
                        <input
                            type="file"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                            onChange={e => setFile(e.target.files[0])}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Required Keywords <span className="text-gray-400 font-normal">(comma separated)</span></label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.required_keywords}
                        onChange={e => setFormData({ ...formData, required_keywords: e.target.value })}
                        placeholder="e.g. React, Components, Props"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {creating ? "Creating..." : <> <Save className="w-5 h-5" /> Save Assignment </>}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AssignmentForm;
