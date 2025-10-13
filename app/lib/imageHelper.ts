const imageModules = import.meta.glob(
  "../assets/images/products/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
);

const images: Record<string, string> = {};
for (const path in imageModules) {
  const filename = path.split("/").pop()!;
  images[filename] = imageModules[path] as string;
}

import defaultImage from "../assets/images/products/default-image.png";

export const getProductImage = (imageName?: string): string => {
  if (!imageName || !images[imageName]) {
    return defaultImage;
  }
  return images[imageName];
};
