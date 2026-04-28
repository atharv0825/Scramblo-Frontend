import { assets } from "../assets/assets";

const PlayStoreIcon = (
    <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path fill="#34A853" d="M3 2l10 10-10 10z" />
        <path fill="#FBBC05" d="M13 12l3-3 5 3-5 3z" />
        <path fill="#EA4335" d="M3 2l13 7-3 3z" />
        <path fill="#4285F4" d="M3 22l13-7-3-3z" />
    </svg>
);

export const ads = [
    {
        company: "Spot Alert",
        headline: "Avoid Accident-Prone Areas in Real-Time",
        description: "AI detects black spots and alerts you instantly.",
        title: "Spot Alert",
        subtitle: "Smart Roads. Safer Journeys.",
        ctaText: "Coming Soon",
        ctaIcon: PlayStoreIcon, // ✅ FIXED
        gradient: "from-red-500 to-orange-500",
    },

    {
        company: "Scramblo",
        headline: "Grow your audience",
        description: "Reach more readers with powerful tools.",
        title: "Scramblo",
        subtitle: "Your voice matters",
        ctaText: "Start Writing",
        gradient: "from-green-500 to-emerald-600",
    },

    {
        company: "Bookr",
        headline: "Stop Searching, Start Experiencing",
        description:
            "Book sports, staycations, events & dining in seconds — all in one app.",
        title: "Bookr",
        subtitle: "Your city. One app.",
        ctaText: "Download Now",
        ctaIcon: PlayStoreIcon,
        logo: assets.BookrLogo,
        ctaLink: "https://play.google.com/store/apps/details?id=com.bookr_mobile&pcampaignid=web_share",
        gradient: "from-purple-500 to-pink-500",
    },
];