

import { useState, useEffect } from "react";

export default function useScroll(){
    const[isScrolled,setIsScrolled]=useState(false);

    useEffect(()=>{
        const scroll=window.addEventListener('scroll',function(){
            if(this.scrollY>50){
                setIsScrolled(true);
            }else{
                setIsScrolled(false)
            }
        })
    })
    return isScrolled;
    
}