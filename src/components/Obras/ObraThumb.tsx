import * as React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePrimaryImage } from "../../query/images";

export default function ObraThumb({ id_obra }: { id_obra: number }) {
  const { data: thumbUrl, isLoading } = usePrimaryImage(id_obra);

  if (isLoading) {
    return (
      <div className="w-24 h-24 rounded-md border bg-muted/30 grid place-items-center text-xs text-muted-foreground">
        …
      </div>
    );
  }

  return thumbUrl ? (
    <div className="w-24">
      <AspectRatio ratio={1}>
        <img
          src={thumbUrl}
          alt=""
          className="w-full h-full object-cover rounded-md border"
          loading="lazy"
        />
      </AspectRatio>
    </div>
  ) : (
    <div className="w-24 h-24 rounded-md border bg-muted/30 grid place-items-center text-xs text-muted-foreground">
      sin imagen
    </div>
  );
}
