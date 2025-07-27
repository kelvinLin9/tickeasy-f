export default function BannerSection() {
  return (
    <div className="h-full w-full bg-[#EAF7FB] bg-[url(@/assets/images/bg-concerts.jpg)] bg-size-[auto_150px] bg-bottom bg-no-repeat lg:bg-cover">
      <div className="relative flex h-[222px] w-full items-center px-5 lg:mx-auto lg:h-[360px] lg:w-[70%] lg:flex-row lg:items-end lg:px-0">
        <div className="flex flex-col gap-4 lg:absolute lg:top-40 lg:left-0 lg:flex-row lg:items-end">
          <p className="text-3xl font-bold lg:text-5xl">所有演唱會</p>
          <p className="text-md text-primary font-bold lg:text-2xl">All Concerts</p>
        </div>
      </div>
    </div>
  );
}
