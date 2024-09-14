import React, { useState, useEffect, useRef } from "react";
import Button from "./components/Button";
import Score from "./components/Score";
import imgMosquito0 from "./images/mosquito0.png";
import imgMosquito1 from "./images/mosquito1.png";
import imgMosquito2 from "./images/mosquito2.png";
import imgMosquito3 from "./images/mosquito3.png";
import './App.css';

interface mosquito {
  mosquitoCount: number;
  speed: number;
  MosquitoArr: any[]
}

function Game() {
  //변수, 객체 선언
  const [start, setStart] = useState<boolean>(true);
  const useResultRef = useRef<number>(0);
  const [resultScore, setResultScore] = useState<boolean>(false);
  const [gameover, setGameover] = useState<boolean>(false);
  const useElapsedTimeRef = useRef<number>(10); //게임 플레이 시간
  let [elapsed, setElapsed] = useState<number>(useElapsedTimeRef.current); 
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width: number = 1000;
  const height: number = 700;
  const clicker: any[] = [];
  let mosquitoImgArr: any[] = [];
  let mosquitoImgArrTemp: any[] = [];
  let imgNumber = 4;
  let startTime = new Date();

  const gameResult = {
    score: 0
  };
  const mosquito: mosquito = {
    mosquitoCount: 10
    , speed: 1
    , MosquitoArr: []
  };


  //모기 이미지 입력
  mosquitoImgArrTemp = [imgMosquito0, imgMosquito1, imgMosquito2, imgMosquito3];
  for (let i = 0; i < imgNumber; i++) {
    mosquitoImgArr[i] = new Image();
    mosquitoImgArr[i].src = mosquitoImgArrTemp[i]
  }


  const resetGame = () => {
    setStart(true);
    setResultScore(false);
    setGameover(false);
    setElapsed(useElapsedTimeRef.current);
    gameResult.score = 0;
    mosquito.MosquitoArr = [];
    clicker.length = 0; // 클릭 배열 초기화
    startTime = new Date(); // 시작 시간 초기화
  };

  const onStart = () => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.style.cursor = 'crosshair'; //마우스커서

    //함수선언
    const draw = () => {
      if (!canvas) return;
      if (!ctx) return;
      ctx.fillStyle = 'rgb(211,211,211)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      if (mosquito.MosquitoArr.length < mosquito.mosquitoCount) {
        //새로운 모기 생성
        mosquitoInfoMaker();
      }

      clicker.forEach((dot, index) => {
        ctx.strokeStyle = 'black'; //마우스 원
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
        ctx.stroke();
        dot.size -= 1;
        if (dot.size < 1) {
          clicker.splice(index, 1);
        }
      })

      mosquito.MosquitoArr.forEach((bub, index) => {

        //모기 벽 튕기기
        if (elapsed < 1) {
          bub.y -= 0; 
          bub.x -= 0; 
        }else{
          bub.y -= bub.dy * bub.speed;
          bub.x -= bub.dx * bub.speed; 
        }

        if (bub.y >= height - bub.size || bub.y < 0) {
          bub.dy *= -1;
        } else if (bub.x >= width - bub.size || bub.x < 0) {
          bub.dx *= -1;
        }

        drawMosquito(bub.img, bub.x, bub.y);
      })

      drawElapsedTime()//시간표시
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 20, canvas.width, 40);
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.font = '36px serif';
      ctx.textAlign = 'center';
      let tempOutput = `SCORE : ${gameResult.score}, ${elapsed}seconds`;
      ctx.fillText(tempOutput, canvas.width / 2, 50);

      if (elapsed < 1){
        setGameover(true);
        console.log("게임오버");
        useResultRef.current=gameResult.score
        setResultScore(true);
        return;
      } 
      if (start === false) requestAnimationFrame(draw);
    }

    function mosquitoInfoMaker() {
      if (!canvas) return;
      if (!ctx) return;
      let mosquitoSize = 84
      let xPos = Math.random() * (canvas.width - mosquitoSize);
      let yPos = Math.random() * (canvas.height - mosquitoSize);
      let directionX = Math.floor(Math.random() * 2 - 1) >= 0 ? 1 : -1; //모기 비행 방향
      let directionY = Math.floor(Math.random() * 2 - 1) >= 0 ? 1 : -1;
      let imgNum: number = Math.floor(Math.random() * imgNumber);
      mosquito.MosquitoArr.push({
        img: mosquitoImgArr[imgNum],
        x: xPos,
        y: yPos,
        size: mosquitoSize,
        speed: Math.floor(Math.random() * 5) + mosquito.speed,
        dx: directionX,
        dy: directionY
      });
    }

    function drawMosquito(img: any, xPos: number, yPos: number) {
      if (!canvas) return;
      if (!ctx) return;
      ctx.drawImage(img, xPos, yPos);
    }

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseClick = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        size: 50
      }
      clicker.push(mouseClick);
      mosquito.MosquitoArr.forEach((bub, index) => {
        if (colCheck(bub, mouseClick)) {
          mosquito.MosquitoArr.splice(index, 1);
          if (elapsed < 1) return
          gameResult.score += 1;
        }
      })
    })

    //마우스 원과 모기 접촉 체크
    function colCheck(a: any, b: any) {
      let hit = a.x < b.x + b.size && a.x + a.size > b.x && a.y < b.y + b.size && a.y + a.size > b.y;
      return hit;
    }

    function drawElapsedTime() {
      if (elapsed < 1) return
      elapsed = useElapsedTimeRef.current - Math.floor((new Date().getTime() - startTime.getTime()) / 1000); //체크
      return elapsed;
    }

    //함수 호출
    draw();
  }

  function toggleStart() {
    if (start === false) setStart(true);
    else setStart(false);
  }

  useEffect(() => {
    onStart();
  }, [start])

  return (
    <div className="container">
      <div className="canvasBox">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="canvas"
        />
        {start === true ? <Button onClick={toggleStart} name="Game Start" width={width} backgroundColor={"black"}/> : null}
        {resultScore === true && <Score score={useResultRef.current} />}
        {gameover && <Button onClick={resetGame} name="Restart" width={width} backgroundColor={"gray"} />}
      </div>
    </div>
  );
}

export default Game;
