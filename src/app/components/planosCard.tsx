const PlanosCard = ({ plano, desc, amount, billing }: {plano: string, desc: string, amount: string, billing: string}) => {
  return (
    <div className="flex justify-start p-12 bg-[#1A1A1A] rounded-lg h-auto w-[33%] flex-col">
      <h1 className="font-bold text-[24px] mb-[16px] text-white">
        { plano }
      </h1>
      <h2 className="text-[18px] text-[#999999]">
        { desc }
      </h2>
      
      <div className="flex items-center my-12">
        <h1 className="text-[40px] font-semibold text-white">{ 'R$' + amount }</h1>
        <h2 className="text-[18px] text-[#999999]">{ "/" + billing }</h2>
      </div>

      <div className="flex text-white w-full justify-between">
        <button className="bg-black rounded-sm py-4 w-[48%]">Teste Grátis</button>
        <button className="bg-[#BC0000] rounded-sm py-4 w-[48%]">Escolher Plano</button>
      </div>

    </div>
  );
}

export default PlanosCard;