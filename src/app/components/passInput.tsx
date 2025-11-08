import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import React, { Dispatch, SetStateAction } from "react"

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

export default function PasswordInput({ setPasswordInfo, passwordInfo, specificVar }: { setPasswordInfo: Dispatch<SetStateAction<{ credential: string; password: string; }>>, passwordInfo: { credential: string; password: string; }, specificVar: string }) {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        className="border border-gray-400 text-white placeholder-gray-300 text-sm rounded-[3px] h-13 bg-transparent block w-full p-2.5"
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Senha'
        onChange={(event)=>{setPasswordInfo({ ...passwordInfo, [specificVar]: event.target.value })}}
        required
      />
      <InputRightElement width='3rem' className="h-full">
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? <IoEyeOffOutline className="text-xl text-white dark:text-white"/> : <IoEyeOutline className="text-xl text-white dark:text-white"/>}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}