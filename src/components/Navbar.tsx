import logo from "../assets/Tessera.svg";
import logoimage from "../assets/tesseraLogo.svg";
import profile from "../assets/Avatar.svg";
import acc from "../assets/Profile.svg";
import home from "../assets/Home Button.svg";
import dm from "../assets/Direct Messages Button.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="m-0 p-0 h-20">
      <nav className="flex w-full justify-between bg-[#3e2723] px-4 py-2">
        <div className="flex space-x-4 items-center">
          <Link to="/">
            <img src={logoimage} alt="Tessera" className="h-10" />
          </Link>
          <Link to="/">
            <img src={logo} alt="Tessera Logo" className="h-10 w-30" />
          </Link>
        </div>

        <ul className="flex text-align-center items-center space-x-10 mr-30">
          <li>
            <Link to="/">
              <img src={acc} alt="Profile" className="h-15" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <img src={home} alt="Home" className="h-15" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <img src={dm} alt="Direct Messages" className="h-15" />
            </Link>
          </li>
        </ul>
        <div className="flex items-center">
          <Link to="/about">
            <img src={profile} alt="Avatar" className="h-15" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
