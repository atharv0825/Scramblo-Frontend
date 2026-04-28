import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    updateProfile,
    getDefaultImages,
    getPresignedUrl,
    deleteProfileImage,
    deleteCoverImage
} from "../api/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function EditProfilePage() {

    const { user, refreshUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        bio: "",
        profileImage: "",
        joinedDate: "",
        interests: [],
        coverImage: "",
        linkedin: "",
        twitter: "",
        instagram: ""
    });

    const [newTag, setNewTag] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [defaultImages, setDefaultImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState("");
    const [profilePreview, setProfilePreview] = useState("");
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                bio: user.bio || "",
                profileImage: user.profileImage || "",
                joinedDate: user.createdAt || "",
                interests: user.tags || [],
                coverImage: user.coverImage || "",
                linkedin: user.linkedin || "",
                twitter: user.twitter || "",
                instagram: user.instagram || ""
            });
        }

        fetchDefaultImages();
    }, [user]);

    const fetchDefaultImages = async () => {
        try {
            const res = await getDefaultImages();
            setDefaultImages(res.data);
        } catch { }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addTag = () => {
        if (newTag.trim() && !form.interests.includes(newTag)) {
            setForm({
                ...form,
                interests: [...form.interests, newTag.trim()]
            });
            setNewTag("");
        }
    };

    const removeTag = (tag) => {
        setForm({
            ...form,
            interests: form.interests.filter(t => t !== tag)
        });
    };

    const handleFileUpload = async (file, type) => {
        if (!file.type.startsWith("image/")) {
            showToast("Only image files are allowed", "error");
            return;
        }

        try {
            // -------------------------
            // 1. VALIDATION
            // -------------------------
            if (!file.type.startsWith("image/")) {
                alert("Only image files are allowed");
                return;
            }

            // if (file.size > 5 * 1024 * 1024) {
            //     alert("File size should be less than 5MB");
            //     return;
            // }

            setUploading(true);

            // -------------------------
            // 2. PREVIEW (UI ONLY)
            // -------------------------
            const preview = URL.createObjectURL(file);

            if (type === "cover") {
                setPreviewImage(preview);
            } else {
                setProfilePreview(preview);
                setShowImageModal(false);
            }

            const isDefaultAvatar = (url) => {
                return url && url.includes("default-Avatar/");
            };

            if (type === "profile" && form.profileImage && !isDefaultAvatar(form.profileImage)) {
                await deleteProfileImage();
            }

            // -------------------------
            // 3. DELETE OLD IMAGE (S3 CLEANUP)
            // -------------------------
            if (type === "cover" && form.coverImage) {
                await deleteCoverImage();
            }

            if (type === "profile" && form.profileImage) {
                await deleteProfileImage();
            }

            // -------------------------
            // 4. GET PRESIGNED URL
            // -------------------------
            const res = await getPresignedUrl(
                file.name,
                file.type,
                type === "cover" ? "CoverImage" : "profile"
            );

            const { uploadUrl, fileUrl } = res.data;

            // -------------------------
            // 5. UPLOAD TO S3
            // -------------------------
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            });

            if (!uploadRes.ok) {
                throw new Error("S3 upload failed");
            }

            // -------------------------
            // 6. SAVE FINAL URL (IMPORTANT)
            // -------------------------
            if (type === "cover") {
                setForm(prev => ({ ...prev, coverImage: fileUrl }));
                setPreviewImage("");
            } else {
                setForm(prev => ({ ...prev, profileImage: fileUrl }));
                setProfilePreview("");
            }

        } catch (err) {
            console.error("Upload failed:", err);
            showToast("Image upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await updateProfile(form);
            await refreshUser();
            showToast("Profile updated successfully", "success");

            setTimeout(() => {
                navigate(`/profile/${user.id}`);
            }, 800);

        } catch (err) {
            console.error(err);
            showToast("Failed to update profile", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col">

            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

                {/* PROFILE IMAGE */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Profile Image</label>

                    <div className="flex items-center gap-4">

                        <div className="relative w-16 h-16">

                            <img
                                src={
                                    profilePreview ||
                                    form.profileImage ||
                                    `https://ui-avatars.com/api/?name=${form.name}`
                                }
                                className="w-16 h-16 rounded-full object-cover"
                            />

                            {/* 🔥 LOADER OVERLAY */}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* ✅ OPEN MODAL */}
                        <button
                            onClick={() => setShowImageModal(true)}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Change
                        </button>

                        {/* DELETE */}
                        {form.profileImage && (
                            <button
                                onClick={async () => {
                                    await deleteProfileImage();
                                    setForm(prev => ({ ...prev, profileImage: "" }));
                                    showToast("Profile image removed", "info");
                                }}
                                className="px-3 py-2 text-red-600 border border-red-500 rounded hover:bg-red-50"
                            >
                                Delete
                            </button>
                        )}

                    </div>
                </div>

                {showImageModal && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]"
                        onClick={() => setShowImageModal(false)}
                    >

                        <div
                            className="bg-white p-6 rounded-xl w-[400px]"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h2 className="text-lg font-semibold mb-4">
                                Choose Profile Image
                            </h2>

                            {/* Upload from device */}
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">
                                    Upload from device
                                </label>

                                <label className="cursor-pointer inline-block px-4 py-2 border rounded hover:bg-gray-100">
                                    Browse Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0], "profile")}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

                            {/* Default images */}
                            <div className="grid grid-cols-3 gap-3">
                                {defaultImages.map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        className="w-20 h-20 rounded cursor-pointer hover:scale-105"
                                        onClick={() => {
                                            setForm(prev => ({
                                                ...prev,
                                                profileImage: img.url
                                            }));
                                            setShowImageModal(false);
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setShowImageModal(false)}
                                className="mt-4 w-full border py-2 rounded"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                )}

                {/* ✅ COVER IMAGE FIXED */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Cover Image</label>

                    {/* IMAGE FULL WIDTH */}
                    <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-200">

                        {form.coverImage ? (
                            <img
                                src={previewImage || form.coverImage}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No cover image
                            </div>
                        )}

                        {/* 🔥 LOADER OVERLAY */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* ACTIONS BELOW */}
                    <div className="flex gap-3 mt-3">

                        <label className="cursor-pointer px-4 py-2 border rounded hover:bg-gray-100">
                            Change
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e.target.files[0], "cover")}
                                className="hidden"
                            />
                        </label>

                        {form.coverImage && (
                            <button
                                onClick={async () => {
                                    await deleteCoverImage();
                                    setForm(prev => ({ ...prev, coverImage: "" }));
                                    showToast("Cover image removed", "info");
                                }}
                                className="px-4 py-2 text-red-600 border border-red-500 rounded hover:bg-red-50"
                            >
                                Delete
                            </button>
                        )}

                    </div>
                </div>

                {/* NAME */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* BIO */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        rows="4"
                    />
                </div>

                {/* SOCIAL LINKS */}

                <div className="mb-6">
                    <label className="block mb-2 font-medium">LinkedIn</label>
                    <input
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">X (Twitter)</label>
                    <input
                        name="twitter"
                        value={form.twitter}
                        onChange={handleChange}
                        placeholder="https://x.com/username"
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">Instagram</label>
                    <input
                        name="instagram"
                        value={form.instagram}
                        onChange={handleChange}
                        placeholder="https://instagram.com/username"
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* SUBMIT */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    <button
                        onClick={handleSubmit}
                        disabled={uploading || submitting}
                        className={`w-full sm:w-auto px-6 py-2 rounded-full transition text-sm
        ${submitting
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800 active:scale-95"
                            }`}
                    >
                        {submitting ? "Saving..." : uploading ? "Uploading..." : "Save Changes"}
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                        className="w-full sm:w-auto px-6 py-2 rounded-full border text-sm
        hover:bg-gray-100 active:scale-95 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>

                </div>

            </div>

            {ToastComponent}
        </div>
    );
}

export default EditProfilePage;