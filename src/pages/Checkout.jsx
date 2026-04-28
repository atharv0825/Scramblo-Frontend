import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { getPresignedUrl, createArticle } from "../api/api";
import { useToast } from "../hooks/useToast.jsx";


function Checkout() {
    const location = useLocation();

    const { title: initialTitle, content } = location.state || {};

    const [title, setTitle] = useState(initialTitle || "");
    const [contentState, setContentState] = useState(content || "");
    const [subtitle, setSubtitle] = useState("");
    const [tag, setTag] = useState("");
    const navigate = useNavigate();
    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const uploadToS3 = async (file) => {
        try {
            // STEP 1: get presigned URL
            const res = await getPresignedUrl(file.name, file.type, "articles");

            const { uploadUrl, fileUrl } = res.data;


            // STEP 2: upload to S3
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            });

            if (!uploadRes.ok) {
                throw new Error("S3 upload failed");
            }
            // STEP 3: return public URL
            return fileUrl;

        } catch (error) {
            console.error("S3 Upload Error:", error);
            showToast("Image upload failed", "error");
            throw error;
        }
    };

    const handlePublish = async () => {
        try {
            if (loading) return;
            setLoading(true);

            let imageUrl = "";

            if (coverImage) {
                imageUrl = await uploadToS3(coverImage);
            }

            const payload = {
                title,
                subtitle,
                content: contentState,
                coverImage: imageUrl,
                tags: tag ? [tag] : [],
                status: "PUBLISHED",
            };

            const res = await createArticle(payload);

            showToast("Article published successfully 🚀", "success");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            console.error("ERROR:", err.response?.data || err.message);


            showToast("Failed to publish article", "error");

        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
                <button
                    onClick={() =>
                        navigate('/write', {
                            state: {
                                title,
                                content: contentState
                            }
                        })
                    }
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                >
                    ← Back to editor
                </button>
            </div>

            <div
                className="
    max-w-5xl mx-auto
    px-4 sm:px-6
    py-6 sm:py-8 md:py-10
    grid grid-cols-1 md:grid-cols-3
    gap-6 sm:gap-8 md:gap-10
  "
            >
                {/* LEFT SIDE */}
                <div className="md:col-span-2">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6">Article Preview</h2>

                    {/* Cover Image */}
                    <div className="mt-2 relative">
                        <input
                            type="file"
                            accept="image/*"
                            id="coverInput"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setCoverImage(file);
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />

                        <div
                            onClick={() => !preview && document.getElementById("coverInput").click()}
                            className="
  border border-gray-300 dark:border-gray-700
  h-40 sm:h-52 md:h-64
  flex items-center justify-center
  text-gray-500 cursor-pointer
  hover:bg-gray-100 dark:hover:bg-gray-900
  transition overflow-hidden relative
"
                        >
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="cover"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* ❌ DELETE BUTTON */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // 🚨 prevent opening file picker
                                            setCoverImage(null);
                                            setPreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded hover:bg-black"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                "Click to add a Cover Image"
                            )}
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className="mt-6">
                        <label className="block text-sm mb-2">Preview Subtitle</label>
                        <input
                            type="text"
                            placeholder="Enter article preview"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="
  w-full
  border-b border-gray-300 dark:border-gray-700
  bg-transparent outline-none
  py-2.5 sm:py-3
  text-sm sm:text-base
"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Please enter preview subtitle, this will be visible alongside the article title and cover image
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="mt-6">
                        <label className="block text-sm mb-2">Tags</label>
                        <p className="text-xs text-gray-500 mb-2">
                            Select categories that best describe your article
                        </p>

                        <input
                            type="text"
                            placeholder="Enter category"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="
  w-full
  border-b border-gray-300 dark:border-gray-700
  bg-transparent outline-none
  py-2.5 sm:py-3
  text-sm sm:text-base
"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6">Options</h2>

                    {/* Buttons */}
                    <div className="flex border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
                        <button className="flex-1 py-2 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            Save as draft
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="flex-1 py-2 bg-black text-white hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish"}
                        </button>
                    </div>

                    {/* Links */}
                    <div className="mt-6 space-y-4 text-sm">
                        <div>
                            <p className="underline cursor-pointer hover:opacity-80">
                                View live preview
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Click to generate a live preview of your article
                            </p>
                        </div>

                        <div>
                            <p className="underline cursor-pointer hover:opacity-80">
                                Share preview link
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Share preview link with someone for review, code will be required to view preview
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            {ToastComponent}
        </div>
    );
}

export default Checkout;