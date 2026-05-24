import React from "react";
import Navbar from "../../components/layout/Navbar";

const PlaceholderPage = ({ title }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            <Navbar />
            <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
                <p className="text-slate-400 text-lg">This page is under construction and will be built soon.</p>
            </main>
        </div>
    );
};

export default PlaceholderPage;
