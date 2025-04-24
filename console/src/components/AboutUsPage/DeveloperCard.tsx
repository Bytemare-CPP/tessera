interface DeveloperCardProps {
    name: string
    role: string
    bio: string
    profilePicture: string
  }
  
  export default function DeveloperCard({ name, role, bio, profilePicture }: DeveloperCardProps) {
    return (
      <div className="bg-[#FDF7F4] h-auto min-h-[350px] w-full flex flex-col items-center p-6 rounded-lg shadow-md">
        {/* Image */}
        <div className="w-[128px] h-[128px] rounded-full mb-4">
          <img
            src={profilePicture || "/placeholder.svg"}
            className="w-[128px] h-[128px] rounded-full object-cover"
            alt={`${name} profile picture`}
          />
        </div>
  
        {/* Name and Role */}
        <div className="text-center mb-3">
          <h3 className="text-[#424242] font-bold text-xl">{name}</h3>
          <p className="text-[#8EB486] font-medium text-lg">{role}</p>
        </div>
  
        {/* Bio */}
        <div className="text-center">
          <p className="text-[#424242] text-md">{bio}</p>
        </div>
      </div>
    )
  }
  