export default function CarouselItem({ imageUrl, title, description }: { imageUrl: string; title: string; description: string }) {
  return (
    <div
      className="relative mx-auto h-[80vh] max-h-[500px] w-[96%] rounded-t-[30px] rounded-b-[60px] py-2 before:absolute before:inset-0 before:z-0 before:rounded-t-[30px] before:rounded-b-[60px] before:bg-black before:opacity-40 lg:max-h-[900px]"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 標題 */}
      <p className="absolute top-1/8 left-1/2 z-10 mx-2 inline-block w-full max-w-[350px] translate-x-[-50%] text-center text-4xl font-bold text-white select-none sm:text-left lg:top-1/4 lg:max-w-[750px] lg:text-5xl xl:left-1/3">
        {title}
      </p>
      {/* 描述 */}
      <p className="text-md absolute bottom-1/4 left-1/2 z-10 mx-auto inline-block w-full max-w-[300px] translate-x-[-50%] text-start font-bold text-white select-none lg:bottom-1/3 lg:max-w-[750px] lg:text-xl xl:left-1/3">
        {description}
      </p>
    </div>
  );
}
