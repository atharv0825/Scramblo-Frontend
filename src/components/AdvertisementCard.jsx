function BaseAdCard({
  title,
  subtitle,
  ctaText,
  ctaIcon,
  ctaLink, // ✅ NEW
  onClick,
  gradient,
  logo,
  image,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-r ${gradient} p-5 rounded-2xl text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      {/* IMAGE BACKGROUND */}
      {image && (
        <img
          src={image}
          alt="ad"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}

      {/* GLASS OVERLAY */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* CONTENT */}
      <div className="relative z-10 text-center">

        {/* LOGO */}
        {logo && (
          <div className="flex justify-center mb-3">
            {typeof logo === "string" ? (
              <img
                src={logo}
                alt="logo"
                className="h-12 w-12 object-contain rounded-xl"
              />
            ) : (
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 p-2">
                {logo}
              </div>
            )}
          </div>
        )}

        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-xs mt-1 opacity-90">{subtitle}</p>

        {/* CTA */}
        {ctaText && (
          <div className="mt-4 flex justify-center">
            <a
              href={ctaLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // ✅ IMPORTANT
              className="flex items-center gap-2 bg-white/90 text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition"
            >
              {/* ICON */}
              {ctaIcon && (
                typeof ctaIcon === "string" ? (
                  <img src={ctaIcon} alt="icon" className="h-4 w-4" />
                ) : (
                  ctaIcon
                )
              )}

              {/* TEXT */}
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function AdvertisementCard({
  company,
  headline,
  description,
  title,
  subtitle,
  ctaText,
  ctaIcon,
  ctaLink, // ✅ NEW
  onClick,
  gradient,
  logo,
  image,
}) {
  return (
    <div className="w-full">

      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">
        {company}
      </p>

      <div className="mb-3">
        <h3 className="text-sm font-semibold leading-snug">
          {headline}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
      </div>

      <BaseAdCard
        title={title}
        subtitle={subtitle}
        ctaText={ctaText}
        ctaIcon={ctaIcon}
        ctaLink={ctaLink} // ✅ pass
        onClick={onClick}
        gradient={gradient}
        logo={logo}
        image={image}
      />
    </div>
  );
}

export default AdvertisementCard;