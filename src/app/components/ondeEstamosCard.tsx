import Image from "next/image";

const LaptopsCard = () => {
  return (
    <div className="flex items-center justify-center w-[33%]">
      <div className="gap-5 w-full h-[160px] bg-linear-to-tr from-[#0F0F0F] from-70% to-[#e5000025] to-100% rounded-xl flex flex-row justify-center items-center border border-[#262626]">
        <div className="flex items-center justify-center ml-[-30%]">
          <div className="w-18 h-18 border-[#262626] border bg-[#141414] rounded-md flex items-center justify-center">
            <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755710503/Icon_ir2z4c.png" alt="" />
          </div>
        </div>
        <h3 className="text-white text-center text-[24px] font-semibold">Laptops</h3>
      </div>
    </div>
  );
}

export default LaptopsCard;
