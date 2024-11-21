import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'

// emoji数组
const emojis = [
  '🥸', '😃', '🖕🏻', '🤩', '🤡', '🩲', '🤠', '🥨', '🎃', '🐶',
  '🐹', '⭐️', '🐮', '🐨', '🐸', '🐵', '🐤', '🍑', '🐻', '🫧',
  '🎈', '🫵', '🌝', '🍄', '🥑', '🍗', '🍒', '🍌', '🍋', '🌏',
  '🍆', '🍉', '🍪', '🍩', '🥨', '🍡', '🧋', '🎾', '😎', '🛟',
  '🗿', '🌋', '🪙', '💣', '💊', '🧸', '🧻', '🧱', '🪩', '💿'
]

// 配置参数
const CONFIG = {
  MAX_EMOJIS: 350,          // 最大数量
  EMOJIS_PER_BATCH: 3,      // 每批发射数量
  EMIT_BATCHES: 2,          // 发射批次
  EMIT_INTERVAL: 100,       // 发射间隔(ms)
  GRAVITY: 0.8,             // 重力
  MIN_SCALE: 1.2,           // 最小缩放
  MAX_SCALE: 1.6,           // 最大缩放
  CLOSE_DELAY: 600,        // 关闭延迟(ms)
  IMAGE_SIZE: 56,           // emoji显示尺寸(px)
  LANDING_VELOCITY: 1.5,    // 放宽速度阈值
  GROUND_THRESHOLD: 400,    // 增加地面判定范围
}

export function AnimatedBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [emojiElements, setEmojiElements] = useState([])
  const [allLanded, setAllLanded] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const boxControls = useAnimationControls()
  const engineRef = useRef(null)
  const requestRef = useRef()

  // 初始化物理引擎
  useEffect(() => {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: CONFIG.GRAVITY }
    })
    engineRef.current = engine

    // 创建边界
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2, 
      window.innerHeight + 50, 
      window.innerWidth, 
      100, 
      { isStatic: true, restitution: 0.6 }
    )
    const leftWall = Matter.Bodies.rectangle(
        0,  // 改为屏幕最左边
        window.innerHeight / 2, 
        100, 
        window.innerHeight, 
        { isStatic: true, restitution: 0.6 }
      )
      const rightWall = Matter.Bodies.rectangle(
        window.innerWidth,  // 改为屏幕最右边
        window.innerHeight / 2, 
        100, 
        window.innerHeight, 
        { isStatic: true, restitution: 0.6 }
      )
    const ceiling = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      -20,
      window.innerWidth,
      100,
      { isStatic: true, restitution: 0.6 }
    )

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling])

    // 开始呼吸动画
    boxControls.start({
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })

    // 动画循环
    const animate = () => {
      Matter.Engine.update(engine, 1000 / 60)
      
      setEmojiElements(prev => {
        const updatedEmojis = prev.map(item => ({
          ...item,
          x: item.body.position.x,
          y: item.body.position.y,
          rotation: item.body.angle * (180 / Math.PI)
        }))
        
        if (!allLanded && updatedEmojis.length >= CONFIG.MAX_EMOJIS) {
          const allStable = updatedEmojis.every(item => {
            const velocityY = Math.abs(item.body.velocity.y)
            const velocityX = Math.abs(item.body.velocity.x)
            return velocityY < CONFIG.LANDING_VELOCITY * 1.5 && 
                   velocityX < CONFIG.LANDING_VELOCITY * 1.5
          });
        
          if (allStable && !isClearing) {
            setAllLanded(true)
            startClearingProcess()
          }
        }
        
        return updatedEmojis
      })
      
      requestRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      Matter.World.clear(engine.world)
      Matter.Engine.clear(engine)
    }
  }, [])

  const startClearingProcess = async () => {
    if (isClearing) return
    
    setIsClearing(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const ground = engineRef.current.world.bodies.find(
      body => body.isStatic && body.position.y > window.innerHeight * 0.7
    )
    if (ground) {
      Matter.World.remove(engineRef.current.world, ground)
    }
  
    engineRef.current.gravity.y = 3 // 增加重力
  
    emojiElements.forEach(item => {
      Matter.Body.setVelocity(item.body, {
        x: -3 - Math.random() * 3, // 增加初始水平速度
        y: 2 + Math.random() * 2   // 增加初始垂直速度
      })
    })
  
    const checkInterval = setInterval(() => {
      setEmojiElements(prev => {
        const remaining = prev.filter(item => {
          // 只要超出屏幕就移除
          const shouldKeep = item.y < window.innerHeight + 100;
          if (!shouldKeep) {
            Matter.World.remove(engineRef.current.world, item.body)
          }
          return shouldKeep
        })
        
        // 其他代码保持不变
        if (remaining.length === 0) {
          clearInterval(checkInterval)
          engineRef.current.gravity.y = CONFIG.GRAVITY
          
          const newGround = Matter.Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight + 50,
            window.innerWidth,
            100,
            { isStatic: true, restitution: 0.6 }
          )
          Matter.World.add(engineRef.current.world, newGround)
          
          setIsClearing(false)
          setAllLanded(false)
        }
        
        return remaining
      })
    }, 100)
  }

  // 发射函数
  const shootEmojis = () => {
    if (isClearing) return
    if (emojiElements.length >= CONFIG.MAX_EMOJIS && !isClearing) return
    
    const newEmojis = []
    const usedIndexes = new Set()
    
    for (let i = 0; i < CONFIG.EMOJIS_PER_BATCH; i++) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * emojis.length)
      } while (usedIndexes.has(randomIndex))
      
      usedIndexes.add(randomIndex)
      const emoji = emojis[randomIndex]
      
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight - 270
      const offset = 40
      
      const x = centerX - offset + (Math.random() * offset * 2)
      const y = centerY
      
      const body = Matter.Bodies.circle(x, y, CONFIG.IMAGE_SIZE / 2, {
        restitution: 0.7,
        friction: 0.1,
        density: 0.001,
        frictionAir: 0.01
      })
   
      const speed = 10 + Math.random() * 3
      const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI/8
      Matter.Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed * 1.2
      })
   
      Matter.World.add(engineRef.current.world, body)
   
      const scale = CONFIG.MIN_SCALE + Math.random() * (CONFIG.MAX_SCALE - CONFIG.MIN_SCALE)
   
      newEmojis.push({
        id: Date.now() + i,
        emoji: emoji,
        body,
        x,
        y,
        rotation: 0,
        scale
      })
    }
   
    setEmojiElements(prev => [...prev, ...newEmojis])
   }

  // 点击处理
  const handleClick = async () => {
    boxControls.start({
      scale: 0.95,
      transition: { duration: 0.1 }
    }).then(() => {
      boxControls.start({
        scale: 1,
        transition: { duration: 0.2 }
      })
    })
  
    setIsOpen(true)
    
    let emitCount = 0
    const emitInterval = setInterval(() => {
      shootEmojis()
      emitCount++
      if (emitCount >= CONFIG.EMIT_BATCHES) {
        clearInterval(emitInterval)
        setTimeout(() => {
          setIsOpen(false)
        }, CONFIG.CLOSE_DELAY)
      }
    }, CONFIG.EMIT_INTERVAL)
  }

  return (
    <>
      {/* Emoji 元素 */}
      {emojiElements.map(({ id, emoji, x, y, rotation, scale }) => (
        <div
          key={id}
          className="fixed pointer-events-none select-none"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
            fontSize: `${CONFIG.IMAGE_SIZE}px`,
            zIndex: 10
          }}
        >
          {emoji}
        </div>
      ))}
      
      {/* 箱子 */}
      <motion.div 
  className="fixed left-[calc(50%-350px)] -bottom-[280px] cursor-pointer"
  animate={boxControls}
  onClick={handleClick}
>
  <div className="relative w-[700px] h-[700px]">
    <svg 
      viewBox="-20 -20 160 160"
      className="w-full h-full"
      style={{ overflow: 'visible' }}
    >
            {/* 箱子主体 */}
            <g fill="#E4B37D">
              <rect x="20" y="20" width="80" height="80" fill="#E4B37D" />
              <path
                d="M20 20 L20 100 L100 100 L100 20"
                fill="none"
                stroke="#8B5E34"
                strokeWidth="2"
              />
              
              <circle cx="20" cy="20" r="1" fill="#8B5E34" />
              <circle cx="20" cy="100" r="1" fill="#8B5E34" />
              <circle cx="100" cy="100" r="1" fill="#8B5E34" />
              <circle cx="100" cy="20" r="1" fill="#8B5E34" />
            </g>
  
            {/* 盖子左半部分 */}
            <motion.line
              x1="20"
              y1="20"
              x2="60"
              y2="20"
              stroke="#8B5E34"
              strokeWidth="2"
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{
                closed: {
                  x2: 60,
                  y2: 20,
                },
                open: {
                  x2: 20 + 35 * Math.cos(Math.PI / 1.5),
                  y2: 20 - 45 * Math.sin(Math.PI / 1.5),
                }
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
            />
  
            {/* 盖子右半部分 */}
            <motion.line
              x1="100"
              y1="20"
              x2="60"
              y2="20"
              stroke="#8B5E34"
              strokeWidth="2"
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{
                closed: {
                  x2: 60,
                  y2: 20,
                },
                open: {
                  x2: 100 - 35 * Math.cos(Math.PI / 1.5),
                  y2: 20 - 45 * Math.sin(Math.PI / 1.5),
                }
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
            />
  
            {/* 笑脸 */}
            <g transform="translate(35, 35)">
              <circle cx="13" cy="10" r="4" fill="#8B5E34" />
              <circle cx="37" cy="10" r="4" fill="#8B5E34" />
              <path
                d="M13 25 Q25 35 37 25"
                fill="none"
                stroke="#8B5E34"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </motion.div>
    </>
  )
}