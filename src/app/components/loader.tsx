import { Spinner } from '@chakra-ui/react'

export default function Loader(){
  return (
    <div className="w-full z-10 h-screen absolute bottom-0 left-0 bg-slate-400/50 flex justify-center items-center">
      <Spinner className='w-14 h-14'/>
    </div>
  )
}