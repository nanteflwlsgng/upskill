import Image from "next/image";

export const OfficialDocument = ({ data }: { data: any }) => {
    if (!data) return null;
  
    return (
      <div className="bg-white p-8 mx-auto w-[25cm] min-h-[29.7cm] text-black font-serif shadow-none flex flex-col" id="printable-document">
        
        {/* HEADER : Logos dynamiques */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-60 h-16 border border-dashed border-gray-300 flex justify-end italic text-[10px] border-b pb-0.5">{data.sidebar_left.top_mention}</div>
          {/* <div className="w-24 h-24 border border-dashed border-gray-300 flex items-center justify-center text-[10px]">Logo Repoblika</div> */}
          <div className="text-center">
            {/* <p className="font-bold uppercase text-xs">Repoblikan'i Madagasikara</p>
            <p className="italic text-[9px]">Fitiavana - Tanindrazana - Fandrosoana</p> */}
            <Image src={"/republique-madagascar.png"} width={200} height={200} alt="republique-madagascar"/>
          </div>
          <div className="border-gray-300 flex flex-col items-center justify-center text-[10px]">
            <Image src={"/matsiatraambony.png"} width={70} height={70} alt="matsiatraambony"/>
            <p className="pt-2">FARITRA MATSIATRA AMBONY</p>
            </div>
        </div>
  
        {/* BODY : Layout 2 colonnes dynamique */}
        <div className="grid grid-cols-[35%_65%] grow">
          
          {/* COLONNE GAUCHE (SIDEBAR) */}
          <div className=" flex flex-col justify-start items-center space-y-6 text-[11px] leading-relaxed">
              {/* <p className="italic text-[9px] border-b pb-1">{data.sidebar_left.top_mention}</p> */}
              <div className="items-center justify-center w-full flex flex-col">

              <Image src={"/commune_fianarantsoa.png"} width={90} height={90} alt="commune_fianarantsoa"/>
            {/*<p className="italic text-[9px] border-b pb-1">{data.sidebar_left.top_mention}</p> */}
            
            <div className="text-center py-2">
              {data.sidebar_left?.authority}
            </div>
              </div>
  
            <div className="space-y-1">
              <p className="whitespace-pre-line">{data.sidebar_left?.id_details}</p>
            </div>
  
            <div className="py-4 border-y border-black">
              <h2 className="font-bold underline uppercase text-center mb-2 italic">Fahaterahana</h2>
              <p className="text-center font-bold text-[13px] uppercase">{data.structured?.nom}</p>
              <p className="text-center font-bold text-[13px] uppercase">{data.structured?.prenoms}</p>
            </div>
  
            <p className="text-[10px] italic">{data.sidebar_left?.stamp_mentions}</p>
            
            <div className="mt-10">
              <p className="font-bold underline text-[10px]">Soratra an-tsisiny :</p>
              <p className="mt-2 text-[10px] leading-snug">{data.sidebar_left?.marginal_notes || "---"}</p>
            </div>
          </div>
  
          {/* COLONNE DROITE (CONTENU PRINCIPAL) */}
          <div className="pl-4">
            <h1 className="text-center font-bold text-lg underline uppercase mb-6">
              {data.main_content?.title}
            </h1>
  
            <div className="text-[13px] leading-[1.8] text-justify whitespace-pre-line space-y-4">
              {/* {data.main_content?.narrative_paragraphes?.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))} */}
              {data.main_content?.narrative_paragraphes}
            </div>
  
            {/* SIGNATURES */}
            <div className="mt-16 text-right space-y-1 text-[12px]">
              <p>Natao tamin'ny faha: {data.footer?.date_signature || "...................."}</p>
              <div className="h-20"></div>
              <p className="font-bold uppercase underline">{data.footer?.signataire_nom}</p>
              <p className="text-[10px] italic">{data.footer?.signataire_titre}</p>
            </div>
          </div>
        </div>
  
        {/* FOOTER DE PAGE */}
        <div className="mt-4 text-center text-[8px] text-gray-400 border-t pt-2 uppercase">
          Soratra AI - Digitalisation sécurisée des actes d'état civil
        </div>
      </div>
    );
  };