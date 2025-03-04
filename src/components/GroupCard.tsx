interface GroupCardProps {
  name: string;
  description: string;
  profilePicture: string;
}

function GroupCard({ name, description, profilePicture }: GroupCardProps) {
  return (
    <div
      id="groupCardDiv"
      className="bg-[#FDF7F4] h-[250px] w-[404px] flex items-center justify-evenly rounded-lg shadow-md"
    >
      {/* Image Div */}
      <div
        id="groupCardImageDiv"
        className="w-[128px] h-[128px] rounded-[25%]"
      >
        {/* Group Card Image */}
        <img
          id="groupCardImage"
          src={profilePicture}
          className="w-[128px] h-[128px] rounded-[25%]"
          alt="ProfilePicture"
        />
        {/* End Group Card Image */}
      </div>
      {/* End Image Div */}

      {/* Group Name and Text */}
      <div
        id="groupNameAndTextDiv"
        className="w-[169px] h-[204px] flex flex-col justify-center"
      >
        {/* Group Card Name */}
        <p
          id="groupCardName"
          className="text-[#424242] font-bold text-2xl overflow-hidden"
        >
          {name}
        </p>

        {/* Group Card Text */}
        <p
          id="groupCardText"
          className="text-[#424242] text-lg overflow-hidden"
        >
          {description}
        </p>
      </div>
      {/* End Group Name and Text Div */}
    </div>
    // End Group Card Div
  );
}

export default GroupCard;