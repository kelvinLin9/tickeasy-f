export default function MobileTitle({
  title = "Mobile Title",
  subtitle = "",
  subClass = "text-neutral-100",
  deskTopShow = false,
}: {
  title: string;
  subtitle?: string;
  subClass?: string;
  deskTopShow?: boolean;
}) {
  return (
    <div className={`relative mx-auto w-fit text-center text-4xl font-bold select-none ${deskTopShow ? "" : "lg:hidden"}`}>
      <h2 className="relative z-20 bg-gradient-to-r from-[#2D6ED0] to-[#2BC6CC] bg-clip-text text-[48px] text-transparent">{title}</h2>
      {subtitle && (
        <span className={`${subClass} text-primary-foreground absolute top-[50%] left-[-40%] z-10 w-[180%] text-[40px] text-nowrap`}>{subtitle}</span>
      )}
    </div>
  );
}
