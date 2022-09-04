import React, {useState} from 'react';
import memesData from './memesData';
import {v4 as uuidv4} from 'uuid';

const memeImages = memesData.data.memes;

//Collect the name and url
const imgData = memeImages.map(item => ({alt: item.name, src: item.url}));
const IMAGES = memeImages.map(item => (<img src={item.url} alt={item.name} crossOrigin='anonymous' />));

export default function Main() {
  const [meme, setMeme] = useState({
    top: "",
    bottom: "",
    imgNumber: 25
  });

  // eslint-disable-next-line
  const [textPosition, setTextPosition] = useState({
    topDragging: false,
    bottomDragging: false,
    topX: "50%",
    topY: "10%",
    bottomX: "50%",
    bottomY: "90%"
  });

  function getBase64Image(img) {
    // This function converts image to data URI
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d",{preserveDrawingBuffer: true});
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    //console.log(dataURL)
    return dataURL;
  }
  
  const [baseImg, setBaseImg] = useState(null)
  React.useEffect(()=>{
    const rawMemeImage = document.querySelector('#meme');
    let currentBase64Image = getBase64Image(rawMemeImage)
    setBaseImg(currentBase64Image)
  },[meme.imgNumber])

  function updateMeme(e){
    const {name, value} = e.target;
    setMeme(prevMeme => ({...prevMeme, [name]: value}));
  }

  function randomImage(){
    const randomPick = Math.floor(Math.random() * imgData.length)
    setMeme(prevMeme => ({...prevMeme, imgNumber: randomPick}));
  }

  function downloadMeme(){
    const svg = document.querySelector('#svg');
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    }
  }

  return (
    <div className="container">
      <div className="meme-card">
        <div className="input-group">
          <input type="text" name='topText' placeholder="Top Text" value={meme.topText || ''} onChange={updateMeme} />
          <input type="text" name='bottomText' placeholder='Bottom Text' value={meme.bottomText || ''} onChange={updateMeme} />
        </div>
        <button onClick={randomImage}>Get a new meme image 🖼</button>
        <div className="meme-holder">
          {/* The previous workflow - SIMPLE Branch */}
          {/* <img id='meme' src={imgData[meme.imgNumber].src} alt={imgData[meme.imgNumber].alt} crossOrigin="anonymous" />
          <p id='top'>{meme.topText}</p>
          <p id='bottom'>{meme.bottomText}</p> */}

          {/* Something new and much better */}
          {baseImg != null &&
          <svg id='svg' 
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              xmlnshlink="http://www.w3.org/1999/xlink">
              <image
                xlinkHref={baseImg}
                height="100%"
                width="100%"
                x={0}
                y={0}
                />
              <text
                style={{ zIndex: textPosition.topDragging ? 4 : 1, fontSize: '2rem', fontFamily: 'Anton' }}
                fill="#fff"
                stroke='#000'
                strokeWidth={2}
                x={textPosition.topX}
                y={textPosition.topY}
                dominantBaseline="middle"
                textAnchor="middle"
                onMouseDown={event => this.handleMouseDown(event, 'top')}
                onMouseUp={event => this.handleMouseUp(event, 'top')}
              >
                  {meme.topText}
              </text>
              <text
                style={{fontSize: '2rem', fontFamily: 'Anton'}}
                fill="#fff"
                stroke='#000'
                strokeWidth={2}
                dominantBaseline="middle"
                textAnchor="middle"
                x={textPosition.bottomX}
                y={textPosition.bottomY}
                onMouseDown={event => this.handleMouseDown(event, 'bottom')}
                onMouseUp={event => this.handleMouseUp(event, 'bottom')}
              >
                  {meme.bottomText}
              </text>
            </svg>}
        </div>
        <button onClick={downloadMeme}>Download</button>
      </div>


      {/* Created this for 2 reasons */}
      {/* Firstly and most iportantly, mapping and displaying IMAGES ensures that they all load. */}
      {/* I noticed that the images being drawn were all transparent and I eventually traced it to this fact */}
      {/* Secondly, the image object with the id of meme is actually what is being converted to base64 and passed into the svg <image>*/}
      <div className="">
            <div className="" style={{display: 'none'}}>
            <img id='meme' src={imgData[meme.imgNumber].src} alt={imgData[meme.imgNumber].alt} crossOrigin="anonymous" />
              {IMAGES.map(item => <div key={uuidv4()}>{item}</div>)}
            </div>
      </div>
    </div>
  )
}

// Img (in div set to display: none) is loaded. UseEffect runs and calls getBase64Image
// Result is set into State as baseImg
// BaseImg is passed into svg <image></image> as xlinkHref
// On Download Button click, downloadMeme function runs
// When Change Image Button is clicked, function randomImage is called and the process starts again
// Top and Bottom Text are held in state and displayed accordingly
// Might make text draggeable in future.
