import Link from "next/link";

export default function VideoCard({ image, title, subtitle, showId }: {image: string, title: string, subtitle: string, showId: string}) {
  return (
    <Link href={`/program/${showId}`}>
      <div className="relative w-[206px] h-[106px] md:w-[343px] md:h-[244px] rounded-xl overflow-hidden border border-white/20 bg-zinc-800 flex-shrink-0">
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
