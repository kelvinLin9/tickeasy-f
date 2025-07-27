interface GoogleMapProps {
  address: string;
  className?: string;
  height?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ address, className = "w-full h-[400px]", height = "100%" }) => {
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  return (
    <div className={className}>
      <iframe
        src={mapUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};
