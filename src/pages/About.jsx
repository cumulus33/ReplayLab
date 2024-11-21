// src/pages/About.jsx
import { motion } from 'framer-motion'

export function About() {
 return (
   <motion.main 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.8 }}
     className="min-h-screen flex items-center justify-center px-12 md:px-24 py-24"
   >
     <motion.p
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8 }}
       className="max-w-4xl text-[2rem] md:text-[2.5rem] leading-tight tracking-tight font-light"
     >
       <span className="font-montserrat">ReplayLab</span>
       <span className="font-inter"> 是一个由设计师 </span>
       <span className="font-montserrat">Cumulus</span>
       <span className="font-inter"> 发起的创意实验项目，致力于挖掘日常生活中的重复动作、几何图形和色彩变化，创造有趣的视觉体验。</span>
     </motion.p>
   </motion.main>
 )
}