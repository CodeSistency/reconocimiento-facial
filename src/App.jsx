import {useRef,useEffect} from 'react'
import './App.css'
import * as faceapi from 'face-api.js'

function App(){
  const videoRef = useRef()
  const canvasRef = useRef()

  // LOAD FROM USEEFFECT
  useEffect(()=>{
    startVideo()
    videoRef && loadModels()

    //new
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
    
  },[])

  //new

  const handleWindowResize = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let width = (windowWidth * 0.9).toFixed();
      let height = (windowHeight * 0.9).toFixed();

      console.log(height)
      if (windowWidth <= 500) {
        width = 400;
        height = 1000;
        
      } else if(windowWidth <= 410){
        width = 300;
      height = 800;
      // video.width = 300;
      video.height = 800;
      } else if(windowWidth <=310){
        width = 200;
        height = 600;
        // video.width = 200;
        video.height = 600;
      }else if(windowWidth <= 200){
        width = 150;
        height = 500;
        // video.width = 150;
        video.height = 500;


      } else {
        // video.width = width
        video.height = height
  
        canvas.width = width
        canvas.height = height
      }
      

      // video.style.width = width + 'px';
      // video.style.height = height + 'px';

      

      console.log(canvas.width, canvas.height, video.width, video.height)
    }
  }



  // OPEN YOU FACE WEBCAM
  const startVideo = ()=>{
    navigator.mediaDevices.getUserMedia({video:true})
    .then((currentStream)=>{
      videoRef.current.srcObject = currentStream
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // LOAD MODELS FROM FACE API

  const loadModels = ()=>{
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")

      ]).then(()=>{
        console.log('something')
      faceMyDetect()
    })
  }

  const faceMyDetect = ()=>{
    setInterval(async()=>{

      //new
      const video = videoRef.current
      const canvas = canvasRef.current

      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        
        

        //new
        const { width, height } = video.getBoundingClientRect();
        console.log(width, height, video)

        const videoWidth = video.offsetWidth
      const videoHeight = video.offsetHeight

      // console.log(videoRef.current, videoHeight, videoWidth)

      canvas.width = width
      canvas.height = height

      const resizedDetections = faceapi.resizeResults(detections, {
        width: width,
        height: height
      })
      // DRAW YOU FACE IN WEBCAM
      // canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      // faceapi.matchDimensions(canvasRef.current,{
      //   width:940,
      //   height:650
      // })

      // const resized = faceapi.resizeResults(detections,{
      //    width:940,
      //   height:650
      // })

      // faceapi.draw.drawDetections(canvasRef.current,resized)
      // faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
      // faceapi.draw.drawFaceExpressions(canvasRef.current,resized)

      //new

      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    },1000)
  }

  return (
    <div className="myapp">
      <h1 color='black' style={{textShadow:' gray 1px 0 10px', textAlign: 'center'}}>Face Detection</h1>
    {/* <h1>FAce Detection</h1> */}
      <div className='container' style={{ margin: '10px' }}>
        
      <video crossOrigin="anonymous" className='video' style={{height: '100%', borderRadius: '10px', border: '4px solid rgb(241, 241, 241)', boxShadow: '0 0 5px 3px rgba(0, 0, 0, 0.367)'}} ref={videoRef} autoPlay></video>
      </div>
      <canvas ref={canvasRef} 
      className="appcanvas"/>
    </div>
    )

}

export default App;