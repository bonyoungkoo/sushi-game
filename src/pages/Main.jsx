import { useEffect, useRef, useCallback, useState } from 'react';
import * as Matter from 'matter-js';
import { SUSHI } from '../constants/sushi'
import { HiSpeakerXMark } from "react-icons/hi2";
import { HiSpeakerWave } from "react-icons/hi2";
import { useTimer } from '../hooks/useTimer';

const Main = () => {
  const {elapsedTime, start, pause, reset} = useTimer();
  const [isStart, setIsStart] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);
  const countRef = useRef(0);
  const indexRef = useRef(0);
  const muteRef = useRef(false);
  const isDropping = useRef(false); 
  const [index, setIndex] = useState(0);
  const [collisionIndex, setCollisionIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameClear, setIsGameClear] = useState(false);

  useEffect(() => {
    const storage = localStorage.getItem('sushi-game');
    if (storage) {
      setIsMute(JSON.parse(storage).isMute);
    }
  }, []);

  useEffect(() => {
    if (!isStart) {
      return;
    }
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;
    
    const engine = Engine.create();
    const render = Render.create({
      engine,
      canvas: canvasRef.current,
      options: {
        width: 620,
        height: 850,
        background: 'rgb(0, 0, 0, 0.3)',
        wireframeBackground: 'transparent',
        wireframes: false,
        chamfer: {
          radius: [0, 0, 50, 50]
        }
      }
    });

    const world = engine.world;
    const left = Bodies.rectangle(5, 430, 15, 850, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    })

    const right = Bodies.rectangle(615, 430, 15, 850, {
      isStatic: true,
      render: { fillStyle: "transparent" }
    })

    const bottom = Bodies.rectangle(320, 875, 650, 50, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    })

    const top = Bodies.rectangle(310, 100, 620, 5, {
      name: 'top',
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "rgba(255, 255, 255, 0.5)" }
    })

    Matter.World.add(world, [left, right, bottom, top])

    Runner.run(engine);
    Render.run(render);

    Events.on(engine, 'collisionActive', (event) => {
      event.pairs.forEach(collision => {
        if (!isDropping.current) {
          if (collision.bodyA.name === 'top' || collision.bodyB.name === 'top') {
            Events.off(engine, 'collisionActive');
            pause();
            setIsGameOver(true);
          }
        }
      });
    });

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(collision => {
        if (collision.bodyA.index === collision.bodyB.index) {
          if (collision.bodyA.index === SUSHI.length - 2) {
            pause();
            setScore(prev => prev + 5000);
            setIsGameClear(true)
          }
          World.remove(world, [collision.bodyA, collision.bodyB]);
          const newSushi = SUSHI[collision.bodyA.index + 1];
          const body = Bodies.circle(collision.collision.supports[0].x, collision.collision.supports[0].y, newSushi.radius, {
            index: collision.bodyA.index + 1,
            render: {
              sprite: { 
                texture: `${baseURL}/${newSushi.name}.png`,
                xScale: newSushi.xScale,
                yScale: newSushi.yScale
              }
            },
            restitution: 0.2
          });
          if (!muteRef.current) {
            const audio = new Audio(`${baseURL}/collision.mp3`);
            audio.play();
          }
          World.add(world, body);
          setCollisionIndex(collision.bodyA.index + 1);
        }
      })
    })

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
    });

    Events.on(mouseConstraint, 'mousedown', (e) => {
      if (e.mouse.position.x < 10 || e.mouse.position.x > 610) {
        return;
      }
      if (isDropping.current) {
        return;
      }
      isDropping.current = true;
      dropSushi(World, world, Bodies, e.mouse.position.x);
      setTimeout(() => {
        isDropping.current = false;
      }, 1000);
    })

  }, [isStart]);

  useEffect(() => {
    muteRef.current = isMute;
  }, [isMute]);

  useEffect(() => {
    if (isGameClear) {
      const audio = new Audio(`${baseURL}/alert.mp3`);
      audio.play();
    }
  }, [isGameClear]);

  useEffect(() => {
    if (isGameOver) {
      const audio = new Audio(`${baseURL}/alert.mp3`);
      audio.play();
    }
  }, [isGameOver]);

  useEffect(() => {
    setScore(prev => prev + (5*collisionIndex));
    if (maxIndex > collisionIndex) {
      return;
    }
    setMaxIndex(collisionIndex);
  }, [collisionIndex]);

  const dropSushi = useCallback((World, world, Bodies, position) => {
    if (!muteRef.current) {
      const audio = new Audio(`${baseURL}/drop.mp3`);
      audio.play();
    }
    const body = Bodies.circle(position, 100, SUSHI[indexRef.current].radius, {
      index: indexRef.current,
      render: {
        sprite: { 
          texture: `${baseURL}/${SUSHI[indexRef.current].name}.png`,
          xScale: SUSHI[indexRef.current].xScale,
          yScale: SUSHI[indexRef.current].yScale
        }
      },
      restitution: 0.2
    })
    World.add(world, body);
    countRef.current = countRef.current + 1;
    changeIndex();
  }, [isMute]);

  const changeIndex = useCallback(() => {
    const nextIndex = Math.floor(Math.random() * (countRef.current < 1 ? 0 : 5));
    indexRef.current = nextIndex;
    setIndex(nextIndex)
  }, []);

  const onClickGameStart = useCallback(() => {
    setIsStart(true);
    start();
  }, []);

  const onClickMute = useCallback(() => {
    setIsMute(false);
    localStorage.setItem('sushi-game', JSON.stringify({isMute: false}));
  }, []);

  const onClickUnmute = useCallback(() => {
    setIsMute(true);
    localStorage.setItem('sushi-game', JSON.stringify({isMute: true}));
  }, []);

  return (
    <>
      <div style={{ width: '100dvw', height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: `url('${baseURL}/bg.jpeg')`, backgroundSize: 'cover' }}>
        {
          isStart ? (
            <>
              <div style={{ width: '340px', height: '480px', marginTop: 10 }}>
                <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', width: '30%' }}>
                    <div style={{ color: '#FFFFFF', fontWeight: '400' }}>SCORE</div>
                    <div style={{ marginLeft: 10, color: '#FFFFFF', fontWeight: '700' }}>{score}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '30%', color: '#FFFFFF', fontWeight: 799 }}>{Math.floor(elapsedTime/60).toString().padStart(2, '0')} : {(elapsedTime%60).toString().padStart(2, '0')}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '30%' }}>
                    {
                      isMute ? <HiSpeakerXMark size={20} fill={'#FFF'} onClick={() => onClickMute()} /> : <HiSpeakerWave size={20} fill={'#FFF'} onClick={() => onClickUnmute()} />
                    }
                  </div>
                </div>
                <div style={{ position: 'absolute', width: '340px', display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                  <img src={`${baseURL}/${SUSHI[index]?.name}.png`} style={{ height: 50, opacity: 0.5 }} />
                </div>
                <canvas style={{ width: '340px' }} ref={canvasRef} />
              </div>

              <div style={{ width: '340px', marginTop: 50 }}>
                <ul style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  {SUSHI.map((v, i) => <li key={`${i}`} style={{ display: 'flex', padding: 5, opacity: `${i < 5 ? 1 : i > maxIndex ? 0.2 : 1}` }}><img src={`${baseURL}/${v?.name}.png`} style={{ width: 25 }} /></li>)}
                </ul>
              </div>
            </>
          ) : (
            <div style={{ width: '100dvw', height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: `url('${baseURL}/bg.jpeg')`, backgroundSize: 'cover' }}>
              <img src={`${baseURL}/salmon.png`} style={{ width: 200, marginBottom: 100 }} />
              <button style={{ textAlign: 'center', height: 60, width: 250, fontSize: 24, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer', borderRadius: 25 }} onClick={onClickGameStart}>Game Start</button>
            </div>
          )
        }
      </div>

      { isGameOver &&
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100dvw', height: '100dvh', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: 0 }}>
          <h1 style={{ textAlign: 'center', fontSize: 48, fontWeight: '700', color: '#FFFFFF' }}>Game Over</h1>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 50 }}>SCORE</p>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: '100', color: '#FFFFFF', marginTop: 10 }}>{score}</p>
          <button style={{ height: 50, textAlign: 'center', width: 200, fontSize: 24, fontWeight: '700', backgroundColor: 'rgba(255, 255, 255, 0.7)', color: '#000', borderRadius: 20, marginTop: 50 }} onClick={() => location.reload()} >Main</button>
        </div>
      }

      { isGameClear &&
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100dvw', height: '100dvh', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: 0 }}>
          <h1 style={{ textAlign: 'center', fontSize: 48, fontWeight: '700', color: '#FFFFFF' }}>Game Clear!</h1>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 50 }}>SCORE</p>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: '100', color: '#FFFFFF', marginTop: 10 }}>{score}</p>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 50 }}>TIME</p>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: '100', color: '#FFFFFF', marginTop: 10 }}>{Math.floor(elapsedTime/60).toString().padStart(2, '0')} : {(elapsedTime%60).toString().padStart(2, '0')}</p>
          <button style={{ height: 50, textAlign: 'center', width: 200, fontSize: 24, fontWeight: '700', backgroundColor: 'rgba(255, 255, 255, 0.7)', color: '#000', borderRadius: 20, marginTop: 50 }} onClick={() => location.reload()} >Main</button>
        </div>
      }
    </>
  );
};

export default Main;