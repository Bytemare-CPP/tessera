import logo from '../assets/Tessera.svg'
import logoimage from '../assets/tesseraLogo.svg'
import profile from '../assets/Avatar.svg'
import acc from '../assets/Profile.svg'
import home from '../assets/Home Button.svg'
import dm from '../assets/Direct Messages Button.svg'
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';


const Navbar = () => {
  return (
    <div className='m-0 p-0 h-20 '>
   <nav className='flex w-full justify-between bg-[#3e2723] p-2 '>
    <div className='flex space-x-4 items-center '> 
        <Link to='/' >
            <img  src = {logoimage} alt="Tessera " className=' h-10  '/>
        </Link>
        <Link to='/' className=' '>
            <img src ={logo} alt="Tessera Logo" className=' h-10 w-30 ' />
        </Link>
      
</div>

        <ul className='flex text-align-center items-center space-x-10 mr-30  '>
            <li > <Link to='/'> <img src = {acc} className=' h-15 ' /></Link></li>
            <li><Link to='/'> <img src = {home}className='h-15' /></Link> </li>
            <li> <Link to= '/'> <img src = {dm} className='h-15'/></Link></li>
        </ul>
<div className='flex items-center'>
        <Link to ='/about' className=''>
            <img src = {profile} alt="Avatar" className='h-15  '/>
        </Link>
        </div>
   </nav>

   <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path = "/Nav" element = {<Home/>}/>
        </Routes>
   </div>
  );
};




export default Navbar