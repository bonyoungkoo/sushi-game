import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as Matter from 'matter-js';
import { SUSHI } from '../constants/sushi'

const Main = () => {
  const canvasRef = useRef(null);
  const countRef = useRef(0);
  const indexRef = useRef(0);
  const isActivated = useRef(true); 
  const [index, setIndex] = useState(0);

  useEffect(() => {
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
        background: '#D2CCAA',
        wireframes: false
      }
    });

    const world = engine.world;
    const left = Bodies.rectangle(15, 395, 30, 850, {
      isStatic: true,
      render: { fillStyle: "#3e1c00" }
    })

    const right = Bodies.rectangle(605, 395, 30, 850, {
      isStatic: true,
      render: { fillStyle: "#3e1c00" }
    })

    const bottom = Bodies.rectangle(310, 835, 650, 30, {
      isStatic: true,
      render: { fillStyle: "#3e1c00" }
    })

    const top = Bodies.rectangle(310, 50, 620, 2, {
      name: 'top',
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#3e1c00" }
    })

    Matter.World.add(world, [left, right, bottom, top])

    Runner.run(engine);
    Render.run(render);

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(collision => {
        if (collision.bodyA.index === collision.bodyB.index) {
          if (collision.bodyA.index === SUSHI.length - 1) {
            return;
          }
          World.remove(world, [collision.bodyA, collision.bodyB]);
          const newSushi = SUSHI[collision.bodyA.index + 1];
          const body = Bodies.circle(collision.collision.supports[0].x, collision.collision.supports[0].y, newSushi.radius, {
            index: collision.bodyA.index + 1,
            render: {
              sprite: { 
                // texture: new URL(`src/assets/${sushi.name}.png`).href,
                texture: `src/assets/${newSushi.name}.png`,
                xScale: newSushi.xScale,
                yScale: newSushi.yScale
              }
            },
            restitution: 0.2
          });

          World.add(world, body);
        }

        console.log('collision', collision); 

        // if (!isActivated) {

        //   if (collision.bodyA.name === 'top' || collision.bodyB.name === 'top') {
        //     console.log('fail')
        //   }
        // }

      })
    })

    const mouseConstraint = Matter.MouseConstraint.create(
      engine, {canvas: canvasRef.current}
    );

    Events.on(mouseConstraint, 'mousedown', (e) => {
      if (e.mouse.position.x < 15 || e.mouse.position.x > 605) {
        return;
      }
      if (!isActivated.current) {
        return;
      }
      isActivated.current = false;
      dropSushi(World, world, Bodies, e.mouse.position.x);
      setTimeout(() => {
        isActivated.current = true;
      }, 1000);
    })

  }, []);

  const dropSushi = useCallback((World, world, Bodies, position) => {
    if (position.x < 15 || position.x > 605) {
      return;
    }
    
    const body = Bodies.circle(position, 20, SUSHI[indexRef.current].radius, {
      index: indexRef.current,
      render: {
        sprite: { 
          texture: `src/assets/${SUSHI[indexRef.current].name}.png`,
          xScale: SUSHI[indexRef.current].xScale,
          yScale: SUSHI[indexRef.current].yScale
        }
      },
      restitution: 0.2
    })
    World.add(world, body);
    countRef.current = countRef.current + 1;
    handleIndex();
  }, []);

  const handleIndex = useCallback(() => {
    const nextIndex = Math.floor(Math.random() * (countRef.current < 3 ? 0 : 5));
    indexRef.current = nextIndex;
    setIndex(nextIndex)
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img src={`src/assets/${SUSHI[index]?.name}.png`} style={{ width: 50, height: 50, opacity: 0.5 }} />
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Main;