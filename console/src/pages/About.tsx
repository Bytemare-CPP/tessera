import DeveloperCard from "../components/AboutUsPage/DeveloperCard";
import JohnPork from "/JohnPork.png?url";


function About() {
  const developers = [
    {
      name: "Alex Matei",
      role: "Frontend Developer",
      bio: "Jane specializes in React and has been building user interfaces for 5 years. She loves creating accessible and intuitive experiences.",
      profilePicture: JohnPork,
    },
    {
      name: "Omar Cruz",
      role: "Backend Developer",
      bio: "John is our API expert with extensive experience in Node.js and database design. He ensures our application runs smoothly behind the scenes.",
      profilePicture: JohnPork,
    },
    {
      name: "Jonathan Rodriguez",
      role: "UI/UX Designer",
      bio: "Alex brings our application to life with beautiful designs. With a background in psychology, they create interfaces that users love.",
      profilePicture: JohnPork,
    },
    {
      name: "Edgar Ortiz",
      role: "Full Stack Developer",
      bio: "Sam works across our entire stack and specializes in performance optimization. They're passionate about creating fast, responsive applications.",
      profilePicture: JohnPork,
    },
  ]


  return (
    <div className="items-center justify-center mt-[20px]">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#424242]">Tessera</h1>

        {/* About the Application Section */}
        <section className="mb-16">
          <div className="bg-[#FDF7F4] p-8 rounded-lg shadow-md">
            <div className="prose max-w-none">
              <p className="text-xl mb-4 text-[#424242]">
                Our platform is designed to help people connect and share meaningful experiences with their peers. We
                believe in building communities that foster genuine relationships and support.
              </p>
              <p className="text-xl mb-4 text-[#424242]">
                Founded in 2023, we've been working to create a space where users can easily find and connect with
                like-minded individuals, share their thoughts, and collaborate on projects that matter to them.
              </p>
              <p className="text-xl text-[#424242]">
                Our mission is to make online connections feel more personal and authentic, bridging the gap between
                digital interaction and real-world relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Developers Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-[#424242]">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developers.map((developer, index) => (
              <DeveloperCard
                key={index}
                name={developer.name}
                role={developer.role}
                bio={developer.bio}
                profilePicture={developer.profilePicture}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;