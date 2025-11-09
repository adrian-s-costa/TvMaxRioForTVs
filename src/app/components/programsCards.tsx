import Link from "next/link";
import { forwardRef } from "react";

interface VideoCardProps {
  image: string;
  title: string;
  subtitle: string;
  showId: string;
  isFocused?: boolean;
  onFocus?: () => void;
}

const VideoCard = forwardRef<HTMLDivElement, VideoCardProps>(
  ({ image, title, subtitle, showId, isFocused = false, onFocus }, ref) => {
    return (
      <Link href={`/program/${showId}`}>
        <div
          ref={ref}
          className={`relative w-[206px] h-[106px] md:w-[343px] md:h-[244px] rounded-xl overflow-hidden border flex-shrink-0 transition-all duration-200 ${
            isFocused
              ? 'border-[#bc0000] scale-105 shadow-lg shadow-[#bc0000]/50'
              : 'border-white/20'
          } bg-zinc-800`}
          onFocus={onFocus}
          tabIndex={isFocused ? 0 : -1}
        >
          {/* Imagem */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Overlay gradient + sombra (sempre visível) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Ícone play (sempre visível) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755795839/play_xnfbn8.svg" alt="" />
          </div>

          {/* Texto embaixo (sempre visível) */}
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs opacity-80">{subtitle}</p>
          </div>
        </div>
      </Link>
    );
  }
);

VideoCard.displayName = "VideoCard";

export default VideoCard;
