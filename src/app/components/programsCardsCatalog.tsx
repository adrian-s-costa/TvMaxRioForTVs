import Link from "next/link";

interface VideoCardCatalogProps {
  image: string;
  title: string;
  subtitle: string;
  showId: string;
  isFocused?: boolean;
  onFocus?: () => void;
  'data-program-index'?: number;
}

export default function VideoCardCatalog({ image, title, subtitle, showId, isFocused = false, onFocus, 'data-program-index': dataProgramIndex }: VideoCardCatalogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // O Link já trata a navegação
    }
  };

  return (
    <Link href={`/program/${showId}`} className="block w-full">
      <div
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        tabIndex={isFocused ? 0 : -1}
        role="button"
        aria-label={`Ver programa ${title}`}
        data-program-index={dataProgramIndex}
        className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#bc0000] ${
          isFocused
            ? 'border-[#bc0000] scale-105 shadow-lg shadow-[#bc0000]/50'
            : 'border-white/20'
        } bg-zinc-800`}
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
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          <p className="text-xs opacity-80 truncate">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

