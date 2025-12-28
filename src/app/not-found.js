'use client';
import './not-found.css';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function notfound (){
    const router = useRouter()
    const audioRef = useRef(null);
    function handleClick() {
        router.push('/');
    }
    function clickDog(){
        if(audioRef.current){
            audioRef.current.currentTime = 0; 
            audioRef.current.play();
        }
    }

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <img
            onClick={()=>{clickDog()}}
            className="DOG" 
            src="/img/dog.gif" 
            alt="Dog GIF" 
            width={400} 
            style={{imageRendering: 'pixelated'}}/>
            <h2>Ops, parece que voce entrou em uma aba que não Existe. Clique para voltar a aba inicial.</h2>
            <audio ref={audioRef} src="music/url.mp3" />
            <button onClick={handleClick}>Voltar para a Página Inicial</button>
        </div>
    );
}