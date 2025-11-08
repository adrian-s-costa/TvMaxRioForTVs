"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className='w-full flex justify-between pt-[20px] z-10 absolute'>
      <Link href="/home">
        <img 
          src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655466/09fa9195634d318711940d331b600d897d2a8187_1_bh67vv.png" 
          width={60} 
          height={110} 
          alt="logo" 
          className='text-white ml-[100px] md:block hidden cursor-pointer' 
        />
        <img 
          src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655466/09fa9195634d318711940d331b600d897d2a8187_1_bh67vv.png" 
          width={40} 
          height={90} 
          alt="logo" 
          className='text-white ml-[20px] block md:hidden cursor-pointer' 
        />
      </Link>
      
      <div>
        <ul className='hidden md:flex text-white h-full items-center gap-[30px] mr-[40px] w-full'>
          <Link href="/home">
            <li className={`relative cursor-pointer w-auto transition-all duration-300 ease-in-out ${
              pathname === '/home' 
                ? 'text-[#bc0000] scale-110' 
                : 'text-white hover:text-[#bc0000] hover:scale-105'
            }`}>
              <span className="relative z-10">Ao Vivo</span>
              {pathname === '/home' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc0000] animate-pulse"></span>
              )}
            </li>
          </Link>
          <Link href="/programs">
            <li className={`relative cursor-pointer w-auto transition-all duration-300 ease-in-out ${
              pathname === '/programs' 
                ? 'text-[#bc0000] scale-110' 
                : 'text-white hover:text-[#bc0000] hover:scale-105'
            }`}>
              <span className="relative z-10">Programas</span>
              {pathname === '/programs' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc0000] animate-pulse"></span>
              )}
            </li>
          </Link>
          <Link href="/social">
            <li className={`relative cursor-pointer w-auto transition-all duration-300 ease-in-out ${
              pathname === '/social' 
                ? 'text-[#bc0000] scale-110' 
                : 'text-white hover:text-[#bc0000] hover:scale-105'
            }`}>
              <span className="relative z-10">Social</span>
              {pathname === '/social' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc0000] animate-pulse"></span>
              )}
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

