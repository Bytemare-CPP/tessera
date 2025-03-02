import logo from '../assets/Tessera.svg'
import logoimage from '../assets/tesseraLogo.svg'
import profile from '../assets/Profile Button.svg'
import home from '../assets/Home Button.svg'
import dm from '../assets/Direct Messages Button.svg'

    

const Navbar = () => {
  return (
    <div className='m-0 p-0 h-20'>
   <nav className='flex w-full justify-between items-center   '>
    <div className='flex space-x-4 '>
        <a >
            <img  src = {logoimage} alt="Tessera " className=' h-10  '/>
        </a>
        <a className='border border-black '>
            <img src ={logo} alt="Tessera Logo" className=' h-10 w-30 ' />
        </a>
      
</div>
{/* space-x-4 */}
        <ul className='flex text-align-center space-x-10 mr-64'>
            <li className=''> <a> <img src = {profile} className=' h-15' /></a></li>
            <li><a> <img src = {home}className='h-15' /></a> </li>
            <li> <a> <img src = {dm} className='h-15'/></a></li>
        </ul>

        <a>
            <img src = {profile} alt="Avatar" />
        </a>
   </nav>
   </div>
  );
};




export default Navbar