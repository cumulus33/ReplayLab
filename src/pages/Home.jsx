import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AnimatedBox } from '../components/AnimatedBox'
import { PreviewModal } from '../components/PreviewModal'

export function Home() {
 const [selectedWork, setSelectedWork] = useState(null)

 const works = [
   {
     id: 1,
     title: 'Emoji Box',
     preview: '/Emoji Box.jpg',
     type: 'animation',
     component: AnimatedBox
   },
 ]

 return (
   <div className="min-h-screen">
     <div className="px-12 md:px-24 py-24">
       <motion.div 
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
       >
         {works.map((work, index) => (
           <motion.div
             key={work.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: index * 0.1 }}
           >
             <button
               onClick={() => setSelectedWork(work)}
               className="w-full group"
             >
               <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
                 <motion.img
                   src={work.preview}
                   alt={work.title}
                   className="w-full h-full object-cover"
                   whileHover={{ 
                     scale: 1.05,
                     transition: { duration: 0.4 }
                   }}
                 />
               </div>
               <h3 className="mt-4 text-sm font-light opacity-60 group-hover:opacity-100 transition-opacity">
                 {work.title}
               </h3>
             </button>
           </motion.div>
         ))}
       </motion.div>
     </div>

     <AnimatePresence>
       {selectedWork && (
         <PreviewModal 
           work={selectedWork} 
           onClose={() => setSelectedWork(null)} 
         />
       )}
     </AnimatePresence>
   </div>
 )
}

export default Home