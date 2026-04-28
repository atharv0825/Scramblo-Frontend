import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import {
    getDefaultImages,
    updateProfile,
    setInterests,
} from "../api/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast.jsx";


const INTERESTS = [
    { name: "Politics", emoji: "🏛️" },
    { name: "Business", emoji: "💼" },
    { name: "Technology", emoji: "💻" },
    { name: "Sports", emoji: "🏏" },
    { name: "Entertainment", emoji: "🎬" },
    { name: "Health", emoji: "🩺" },
    { name: "Science", emoji: "🔬" },
    { name: "Education", emoji: "🎓" },
    { name: "World News", emoji: "🌍" },
    { name: "India News", emoji: "🇮🇳" },
];;

function SetupProfile() {
    const [step, setStep] = useState(1);

    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const [avatars, setAvatars] = useState([]);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    // =========================
    // HANDLERS
    // =========================
    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        setPreview(avatar);
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await getDefaultImages();
                setAvatars(res.data);

                if (res.data.length > 0) {
                    setSelectedAvatar(res.data[0].url);
                    setPreview(res.data[0].url);
                }

            } catch (err) {
                console.error("Error fetching images", err);
            }
        };

        fetchImages();
    }, []);


    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            if (!name.trim()) {
                showToast("Name is required", "error");
                return;
            }

            if (!selectedAvatar) {
                showToast("Please select a profile image", "error");
                return;
            }

            if (selectedTags.length === 0) {
                showToast("Select at least one interest", "error");
                return;
            }

            const payload = {
                name,
                bio,
                profileImage: selectedAvatar,
                interests: selectedTags
            };

            await updateProfile(payload);

            // ✅ SUCCESS TOAST
            showToast("Profile setup completed", "success");

            // ✅ Delay navigation (important)
            setTimeout(() => {
                navigate("/dashboard");
            }, 800);

        } catch (error) {
            console.error("Update failed", error);


            showToast("Something went wrong!", "error");
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    {step === 1 ? "Set up your profile" : ""}
                </h1>

                <Card size="lg" radius="3xl" color="light" className="mt-10">

                    {/* TITLE */}
                    <p className="text-gray-500 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg">
                        {step === 1
                            ? "Pick a profile photo"
                            : "Selected Photo"}
                    </p>

                    <div
                        className="
    grid grid-cols-1 md:grid-cols-2
    gap-6 sm:gap-8 md:gap-10
    items-center
  "
                    >

                        {/* LEFT - IMAGE ALWAYS */}
                        <div className="flex flex-col items-center">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-300">
                                <img
                                    src={preview || "/avatars/icon1.png"}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />
                            </div>

                            {step === 1 && (
                                <label className="mt-6 cursor-pointer px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm shadow-md hover:scale-105 transition">
                                    Browse Image
                                    <input type="file" hidden />
                                </label>
                            )}
                        </div>

                        {/* RIGHT SIDE CONTENT */}
                        <div>

                            {/* STEP 1 - AVATARS */}
                            {step === 1 && (
                                <>
                                    <p className="mb-4 font-medium text-lg">Choose an avatar</p>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-5">
                                        {avatars.map((img) => (
                                            <img
                                                key={img.id}
                                                src={img.url}
                                                onClick={() => handleAvatarSelect(img.url)}
                                                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full cursor-pointer border-2 transition-all duration-200 ${selectedAvatar === img.url
                                                    ? "border-blue-500 scale-110 shadow-md"
                                                    : "border-gray-300 hover:scale-105"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* STEP 2 - NAME */}
                            {step === 2 && (
                                <div>
                                    <p className="mb-4 text-lg font-medium">What is your name ?</p>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="
  w-full
  p-3 sm:p-4
  text-sm sm:text-base md:text-lg
  rounded-xl
  border border-purple-500
  dark:bg-gray-900
  focus:outline-none focus:ring-2 focus:ring-purple-500
"                                    />
                                </div>
                            )}

                            {/* STEP 3 - BIO */}
                            {step === 3 && (
                                <div>
                                    <p className="mb-4 text-lg font-medium">Tell us about yourself</p>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Write something about yourself..."
                                        className="
  w-full
  p-3 sm:p-4
  text-sm sm:text-base md:text-lg
  rounded-xl
  border border-purple-500
  dark:bg-gray-900
  focus:outline-none focus:ring-2 focus:ring-purple-500
"                                    />
                                </div>
                            )}

                            {/* STEP 4 - INTERESTS */}
                            {step === 4 && (
                                <div>
                                    <p className="mb-6 text-lg font-medium">What are you interested in ?</p>

                                    <div className="flex flex-wrap gap-3">
                                        {INTERESTS.map((item) => {
                                            const selected = selectedTags.includes(item.name);

                                            return (
                                                <div
                                                    key={item.name}
                                                    onClick={() => toggleTag(item.name)}
                                                    className={`flex items-center gap-2
  px-3 sm:px-4
  py-1.5 sm:py-2
  text-xs sm:text-sm
  rounded-full
  cursor-pointer transition
                          ${selected
                                                            ? "border border-purple-600 text-purple-700 bg-purple-100/40"
                                                            : "border border-gray-300 hover:scale-105"
                                                        }`}
                                                >
                                                    <span>{item.emoji}</span>
                                                    <span>{item.name}</span>

                                                    <span className="ml-1 text-sm">
                                                        {selected ? "✕" : "+"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row sm:justify-end gap-3 w-full">

                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="w-full sm:w-auto px-5 py-2 text-sm border rounded-full text-center
            hover:bg-gray-100 active:scale-95 transition"
                            >
                                ← Previous
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (step === 4) {
                                    handleSubmit();
                                } else {
                                    setStep(step + 1);
                                }
                            }}
                            disabled={
                                submitting ||
                                (step === 1 && !selectedAvatar) ||
                                (step === 2 && !name)
                            }
                            className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 text-sm sm:text-base rounded-full transition
        ${submitting
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800 active:scale-95"
                                }`}
                        >
                            {submitting ? "Submitting..." : step === 4 ? "Submit" : "Next →"}
                        </button>

                    </div>

                </Card>
            </div>
        </div>
    );
}

export default SetupProfile;