import { useMemo } from "react";

type ImageType = Record<string, string>;

const images = import.meta.glob("@/assets/images/**/*.{png,jpg,jpeg,gif,svg}", {
  eager: true,
  import: "default",
});

export function useImportImages(imagePath: string[]): ImageType {
  return useMemo(() => {
    const importedImages: ImageType = {};

    imagePath.forEach((path) => {
      const matchedKey = Object.keys(images).find((key) => key.endsWith(`/assets/images/${path}`));
      if (matchedKey && images[matchedKey]) {
        importedImages[path] = images[matchedKey] as string;
      } else {
        // console.warn(`圖片找不到: ${path}`);
      }
    });

    return importedImages;
  }, [imagePath]);
}
