"use client"

import { useState } from "react"
import ListesInfo from "../components/ListesInfo"

export default function Listes(){
    const [listes, setlistes]= useState(
        [
            {id:1, nom:"Liste 1"},
            {id:2, nom:"Liste 2"},
            {id:3, nom:"Liste 3"}
        ]
    )

    const [input, setinput]= useState("")

    const handleclick= (id:any)=>{
        // alert("handleclick")
        const listescopy= [...listes]
        setlistes(listescopy.filter(liste=>(liste.id!=id)))
    }


    const handlesubmit= (e:any)=>{
        e.preventDefault();
        // alert("</div>")
        const listescopy2= [...listes]
        const id= new Date().getTime()
        const nom= input
        listescopy2.push({id,nom})
        setlistes(listescopy2)
        setinput("")
        
    }

    
    return(
        <div>
            <h1 className="flex items-center justify-center text-2xl uppercase p-6 font-bold">
                Listes
            </h1>
            <ul className="flex items-center gap-2 justify-center flex-col">
                {
                    listes.map(liste=><ListesInfo listeli={liste} supr={handleclick}/>)
                }
            </ul>
            <form className="flex flex-col mt-3 justify-center items-center" action="submit" onSubmit={handlesubmit}>
                <div className="gap-3 flex">
                <input value={input} onChange={(e)=>(setinput(e.target.value))} className="border p-4 rounded-xl" type="text" placeholder="Entrer une nouvele liste..."/>
                <button className="font-bold ml-3 p-4 hover:bg-gray-200 duration-200 rounded-2xl">Ajouter +</button>
                </div>
            </form>
        </div>
    )
}