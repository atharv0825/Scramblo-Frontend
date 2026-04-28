function Logo({ isDark = false }) {
  const fill = isDark ? "#ffffff" : "#000000";

  return (
    <svg 
      width="120" 
      height="30" 
      viewBox="0 0 120 30" 
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <text 
        x="0" 
        y="50%" 
        dominantBaseline="central" 
        fill={fill} 
        fontFamily="'Merriweather', serif" 
        fontWeight="700" 
        fontSize="28"
        letterSpacing="1.5"
      >
        scramble
      </text>
    </svg>
  );
}

export default Logo;
