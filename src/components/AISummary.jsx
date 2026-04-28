import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { generateGradient } from "../utils/gradient.js";
import { useToast } from "../hooks/useToast.jsx"; 

function AISummary({ article }) {
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [summary, setSummary] = useState("");
    const [gradient, setGradient] = useState("");

    const { showToast, ToastComponent } = useToast(); // ✅ added

    useEffect(() => {
        if (!article) return;

        setLoading(true);
        setShow(false);

        setGradient(generateGradient());

        const timer = setTimeout(() => {
            try {
                const generatedSummary =
                    article.subtitle ||
                    "This article highlights key insights and important takeaways.";

                setSummary(generatedSummary);
                setLoading(false);
                setShow(true);

                // ✅ SUCCESS TOAST
                showToast("AI Summary generated", "success");

            } catch (error) {
                setLoading(false);

                // ❌ ERROR TOAST (future-proof)
                showToast("Failed to generate summary", "error");
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [article]);

    return (
        <div className="mb-8">

            {/* 🔄 LOADING */}
            {loading && (
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white/60 backdrop-blur-md shadow-sm">

                    <div
                        className="relative w-12 h-12 flex items-center justify-center rounded-full animate-spin-slow"
                        style={{ background: gradient }}
                    >
                        <div className="absolute w-9 h-9 bg-white rounded-full flex items-center justify-center">
                            <BsStars className="text-purple-600 animate-pulse" />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Generating AI Summary...
                        </p>
                        <p className="text-xs text-gray-400">
                            Analyzing content and extracting insights
                        </p>
                    </div>
                </div>
            )}

            {/* ✅ RESULT */}
            {!loading && show && (
                <div className="relative p-5 rounded-xl bg-white/70 backdrop-blur-lg shadow-md animate-fadeIn">

                    <div
                        className="absolute top-0 left-0 w-full h-[3px] rounded-t-xl"
                        style={{ background: gradient }}
                    />

                    <div className="flex items-center gap-2 mb-2">
                        <BsStars className="text-purple-600" />
                        <p className="text-sm font-semibold text-gray-800">
                            AI Summary
                        </p>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                        <span className="font-semibold text-blue-600">
                            {summary.split(" ")[0]}
                        </span>{" "}
                        {summary.split(" ").slice(1).join(" ")}
                    </p>
                </div>
            )}

            {/* ✅ Toast Render */}
            {ToastComponent}
        </div>
    );
}

export default AISummary;