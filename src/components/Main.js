import React, {useState} from 'react';
import memesData from './memesData';

const memeImages = memesData.data.memes;

//Collect the name and url
const imgData = memeImages.map(item => ({alt: item.name, src: item.url}));

export default function Main() {

  const [meme, setMeme] = useState({
    top: "",
    bottom: "",
    imgNumber: 25
  });

  function updateMeme(e){
    const {name, value} = e.target;
    setMeme(prevMeme => ({...prevMeme, [name]: value}));
  }

  function randomImage(){
    const randomPick = Math.floor(Math.random() * imgData.length)
    console.log(randomPick);
    setMeme(prevMeme => ({...prevMeme, imgNumber: randomPick}));
  }

  return (
    <div className="container">
      <div className="meme-card">
        <div className="input-group">
          <input type="text" name='topText' placeholder="top text" value={meme.topText || ''} onChange={updateMeme} />
          <input type="text" name='bottomText' placeholder='bottom text' value={meme.bottomText || ''} onChange={updateMeme} />
        </div>
        <button onClick={randomImage}>Get a new meme image 🖼</button>
        <div className="meme-holder">
          <img src={imgData[meme.imgNumber].src} alt={imgData[meme.imgNumber].alt} />
          <p id='top'>{meme.topText}</p>
          <p id='bottom'>{meme.bottomText}</p>
        </div>
      </div>
    </div>
  )
}
