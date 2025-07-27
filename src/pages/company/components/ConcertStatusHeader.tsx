interface ConcertStatsHeaderProps {
  concertName: string;
  organizerName: string;
}

export default function ConcertStatsHeader({ concertName, organizerName }: ConcertStatsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between border-b pb-4 md:flex-row md:items-center">
      <h1 className="mb-2 text-2xl font-bold text-gray-800 md:mb-0">演唱會名稱：{concertName}</h1>
      <p className="text-lg text-gray-500">{organizerName}</p>
    </div>
  );
}
