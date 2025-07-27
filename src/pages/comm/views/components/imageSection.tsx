import * as React from "react";
export interface ImageSectionProps extends React.InputHTMLAttributes<HTMLInputElement> {
  imageUrl: string;
  alt: string;
}
export function ImageSection({ imageUrl, alt }: ImageSectionProps) {
  return (
    <section className="flex hidden h-[80vh] w-full items-center justify-center md:block">
      <img src={imageUrl} alt={alt} className="block h-[90%] w-full max-w-full object-contain" />
    </section>
  );
}
