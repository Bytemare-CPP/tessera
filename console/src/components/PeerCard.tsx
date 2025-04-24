interface PeerCardProps {
  name: string;
  profilePicture: string;
  onClick?: () => void;
}

function PeerCard({ name, profilePicture, onClick }: PeerCardProps) {
  return (
    <div
      id="peerCardDiv"
      className="bg-[#FDF7F4] h-[250px] w-[200px] flex items-center justify-center rounded-lg shadow-md cursor-pointer"
      onClick={onClick}
    >
      {/* Image Div */}
      <div
        id="peerCardImageDiv"
        className="w-[128px] h-[128px] rounded-full transform -translate-y-10"
      >
        {/* Peer Card Image */}
        <img
          id="peerCardImage"
          src={profilePicture}
          className="w-[128px] h-[128px] rounded-full"
          alt="ProfilePicture"
        />

        {/* Peer Card Name */}
        <p
          id="peerCardName"
          className="text-[#424242] font-bold text-2xl mt-2 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {name}
        </p>
      </div>
      {/* End Image Div */}
    </div>
  );
}

export default PeerCard;
