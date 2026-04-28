import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, isFollowingUser, getUserDetails } from "../api/api";
import Navbar from "../components/Navbar";
import { getArticlesByUser, toggleFollow } from "../api/api";
import ArticleCard from "../components/ArticleCard";
import { generateGradient } from "../utils/gradient";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { formatDate } from "../utils/date";
import { FaPen } from "react-icons/fa";
import UserArticleCard from "../components/UserArticleCard";
import { useToast } from "../hooks/useToast.jsx";
import ScrambloLoader from "../components/ScrambloLoader";

function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [gradient, setGradient] = useState(generateGradient());
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null);
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await getUserDetails();
                setCurrentUserId(res.data.id);
            } catch (err) {
                console.error("Failed to get current user", err);
            }
        };

        const storedId = localStorage.getItem("userId");

        if (storedId) {
            setCurrentUserId(Number(storedId));
        } else {
            fetchCurrentUser();
        }

    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            setGradient(generateGradient());
        }, 3000); // change every 3 sec

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchUser();
        fetchArticles();
        checkFollowing();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await getUserById(id);
            setUser(res.data);
        } catch (err) {
            console.error("Error fetching user", err);
        }
    };

    const checkFollowing = async () => {
        try {
            const res = await isFollowingUser(id);
            setIsFollowing(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchArticles = async () => {
        try {
            const res = await getArticlesByUser(id);
            setArticles(res.data.content); // ⚠️ IMPORTANT (pagination response)
        } catch (err) {
            console.error("Error fetching articles", err);
        }
    };

    const isOwner = currentUserId === user?.id;

    const handleFollow = async () => {
        if (isOwner) return;

        try {
            await toggleFollow(id);

            setIsFollowing(prev => !prev);

            setUser(prev => ({
                ...prev,
                followersCount: prev.followersCount + (isFollowing ? -1 : 1)
            }));

            // ✅ SUCCESS TOAST
            showToast(
                isFollowing ? "Unfollowed user" : "Started following",
                isFollowing ? "info" : "success"
            );

        } catch (err) {
            console.error(err);

            showToast(
                err.response?.data || "Something went wrong",
                "error"
            );
        }
    };

    if (!user) return <ScrambloLoader size="lg" fullScreen />;

    return (
        <div className="flex flex-col">

            {/* NAVBAR */}
            <Navbar />

            {/* COVER (70% WIDTH) */}
            <div className="w-full lg:w-[70%] mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
                <div className="relative h-32 sm:h-40 md:h-48 rounded-2xl overflow-hidden group">

                    {/* BACKGROUND */}
                    {user.coverImage && user.coverImage.trim() !== "" ? (
                        <img
                            src={user.coverImage}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: "linear-gradient(270deg, #a78bfa, #60a5fa, #f472b6, #34d399)",
                                backgroundSize: "600% 600%",
                                animation: "gradientMove 12s ease infinite"
                            }}
                        />
                    )}

                    {/* SHOW ONLY IF NO COVER */}
                    {(!user.coverImage || user.coverImage.trim() === "") && (
                        <h1 className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg z-10">
                            Scramblo.
                        </h1>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* JOINED DATE */}
                    <p className="absolute bottom-3 right-5 text-sm text-white/80 z-10">
                        Joined {formatDate(user.createdAt)}
                    </p>

                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="w-full lg:w-[70%] mx-auto px-4 sm:px-6 mt-4 sm:mt-5 relative z-10">

                {/* PROFILE SECTION */}
                <div className="
  flex flex-col md:flex-row
  gap-5 sm:gap-6 md:gap-8
  items-start
">

                    {/* PROFILE IMAGE (slight floating effect) */}
                    <img
                        src={
                            user.profileImage ||
                            `https://ui-avatars.com/api/?name=${user.name}`
                        }
                        alt="profile"
                        className="
  w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40
  rounded-2xl object-cover shadow-lg border-4 border-white
  -mt-12 sm:-mt-16 md:-mt-24
"
                    />

                    {/* USER INFO */}
                    <div className="flex-1">

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{user.name}</h1>

                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                            {user.bio || "No bio available"}
                        </p>

                        {/* ACTION ROW */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">

                            {/* EDIT BUTTON */}
                            {isOwner ? (
                                <button
                                    onClick={() => navigate("/edit-profile")}
                                    className="px-4 sm:px-5 py-2 text-sm sm:text-base rounded-full border border-black text-black hover:bg-gray-100"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className="px-4 sm:px-5 py-2 text-sm sm:text-base rounded-full bg-black text-white hover:opacity-90"
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}

                            {/* SOCIAL ICONS */}
                            <div className="flex gap-3 text-xl">

                                {user.instagram && (
                                    <a href={user.instagram} target="_blank" rel="noreferrer">
                                        <FaInstagram className="text-pink-500 hover:scale-110 transition" />
                                    </a>
                                )}

                                {user.twitter && (
                                    <a href={user.twitter} target="_blank" rel="noreferrer">
                                        <FaTwitter className="text-black hover:scale-110 transition" />
                                    </a>
                                )}

                                {user.linkedin && (
                                    <a href={user.linkedin} target="_blank" rel="noreferrer">
                                        <FaLinkedin className="text-blue-600 hover:scale-110 transition" />
                                    </a>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* STATS */}
                    <div className="
  flex justify-start md:ml-auto
  gap-6 sm:gap-10 md:gap-12
  text-center
  mt-4 md:mt-0
">

                        <div>
                            <p className="text-gray-500 text-sm">Followers</p>
                            <p className="text-2xl font-bold">
                                {user.followersCount}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Following</p>
                            <p className="text-2xl font-bold">
                                {user.followingCount}
                            </p>
                        </div>

                    </div>

                </div>

                {/* TABS */}
                <div className="flex gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10 border-b pb-2 sm:pb-3 text-sm">
                    <span className="font-semibold border-b-2 border-black pb-2">
                        Articles
                    </span>
                </div>

                <div className="mt-6 sm:mt-8">

                    {articles.length === 0 ? (
                        <p className="text-gray-500">No articles found</p>
                    ) : (
                        articles.map((article) => (
                            isOwner ? (
                                <UserArticleCard
                                    key={article.id}
                                    article={article}
                                    onDelete={(id) => {
                                        setArticles(prev => prev.filter(a => a.id !== id));
                                    }}
                                />
                            ) : (
                                <ArticleCard key={article.id} article={article} />
                            )
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}

export default UserProfile;