import logo from '../assets/Tessera.svg'
import logoimage from '../assets/tesseraLogo.svg'
import profile from '../assets/Profile Button.svg'
import home from '../assets/Home Button.svg'
import dm from '../assets/Direct Messages Button.svg'
import pic from '../assets/Avatar.svg'
import search from '../assets/Search Button.svg'     

const Navbar = () => {
  return (
   <nav className='flex w-100% justify-between'>
    <div>
        <a>
            <img src ={logo} alt="Tessera Logo" />
        </a>
        <a>
            <img src = {logoimage} alt="Tessera " />
        </a>
</div>
        <ul>
            <li> <a> <img src = {profile} /></a></li>
            <li><a> <img src = {home} /></a> </li>
            <li> <a> <img src = {dm} /></a></li>
        </ul>

        <a>
            <img src = {profile} alt="Avatar" />
        </a>
   </nav>
  );
};

export default Navbar