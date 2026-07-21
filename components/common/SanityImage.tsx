import "server-only";

import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import Image, { type ImageProps } from "next/image";

import { getRequiredPublicEnv } from "@/lib/env";

type SanityImageProps = Omit<ImageProps, "src"> & {
  image: SanityImageSource;
  sourceWidth?: number;
};

export function SanityImage({ image, sourceWidth, alt, ...props }: SanityImageProps) {
  const imageUrlBuilder = createImageUrlBuilder({
    projectId: getRequiredPublicEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
    dataset: getRequiredPublicEnv("NEXT_PUBLIC_SANITY_DATASET"),
  });
  const builder = imageUrlBuilder.image(image).auto("format");
  const src = sourceWidth ? builder.width(sourceWidth).fit("max").url() : builder.url();

  return <Image {...props} src={src} alt={alt} />;
}
