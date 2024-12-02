"use client";
import React, { useState, useEffect, useCallback } from "react"; // Import React hooks
import Image from "next/image"; // Import Next.js Image component
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Import custom Carousel components
import { Button } from "@/components/ui/button"; // Import custom Button component
import { PlayIcon, PauseIcon } from "lucide-react";

interface ImageData{
id:string;
urls:{
    regular:string
};
alt_description:string;
description:string;
user:{
    name:string
}
}


export default function ImageSliderComponent() {

const [images,setImages]=useState<ImageData[]>([])
const [currentIndex,setCurrentIndex]=useState<number>(0)
const [isPlaying,setIsPlaying]=useState<boolean>(true);
const interval:number=3000


useEffect(()=>{
    const fetchImageData=async()=>{
        try {
            const response=await fetch(`https://api.unsplash.com/photos?client_id=ShU1Gdwr4kqmO8LN_YUVqEkXfR34T8P8UESCUfVjJHY&per_page=10`)
        if(!response.ok){
            throw new Error("Error Fetching images")
        }
        const data=await response.json()
        setImages(data)
        
        } catch (error) {
            console.error(error)
        }
    }
    fetchImageData()
},[])

const nextImage=useCallback(():void=>{
    setCurrentIndex((prevIndex)=>(prevIndex+1)% images.length)
},[images.length])


useEffect(()=>{
if(isPlaying){
    const id=setInterval(nextImage, interval);
    return ()=>clearInterval(id)
}
},[isPlaying,nextImage])

const togglePlayPause=()=>{
    setIsPlaying((prevPlaying)=>!prevPlaying)
}

    return(
        <>
<div className="flex items-center justify-center h-screen overflow-scroll ">
<div className="w-full max-w-2xl mx-auto">
<h1 className="text-3xl font-bold text-center mb-2">Image Slider</h1>
<p className="text-center text-gray-500">A simple dynamic image slider/carousel with Unsplash.</p>
<Carousel className="rounded-lg  ">
    <CarouselContent>
        {images.map((image,index)=>(
            <CarouselItem
            key={image.id}
            className={index===currentIndex?"block":"hidden"}>
<Image
src={image.urls.regular}
alt={image.alt_description}
width={800}
height={200}
className="w-full object-cover max-h-[700px]"/>
<div className="bg-white/75">
    <h1 className="text-lg font-bold text-center">{image.user.name}</h1>
    <p className="text-center text-sm">{image.description || image.alt_description}</p>
</div>
    </CarouselItem>
        ))}
    </CarouselContent>
<div className="relative bottom-15 left-[93%] -translate-x-1/2 flex items-center gap-2 ">
<Button onClick={togglePlayPause}
variant={"ghost"}
size={"icon"}>{isPlaying?<PauseIcon/>:<PlayIcon/>}</Button>
<span>{isPlaying?"Pause":"Play"}</span>
</div>


</Carousel>



</div>
</div>
        </>
    )
}