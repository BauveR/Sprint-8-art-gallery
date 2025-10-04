import { usePrimaryImage } from "../../query/images";

interface ObraImageProps {
  obraId: number;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ObraImage({ obraId, alt, className, fallbackSrc = "/piedra-arte-02.svg" }: ObraImageProps) {
  const { data: imageUrl, isLoading } = usePrimaryImage(obraId);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
    );
  }

  return (
    <img
      src={imageUrl || fallbackSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackSrc;
      }}
    />
  );
}
