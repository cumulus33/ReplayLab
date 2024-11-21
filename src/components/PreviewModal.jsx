// src/components/PreviewModal.jsx
import { motion } from 'framer-motion'

export function PreviewModal({ work, onClose }) {
 return (
   <motion.div 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     transition={{ duration: 0.3, ease: 'easeInOut' }}
     className="fixed inset-0 bg-white z-50"
   >
     <div className="fixed top-0 left-0 right-0 px-12 md:px-24 py-8 flex justify-between items-center">
       <span className="text-xl font-montserrat font-medium tracking-tight text-black">
         {work.title}
       </span>
       <button
         onClick={onClose}
         className="opacity-50 hover:opacity-100 transition-opacity"
       >
         <svg
           width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
           strokeLinecap="round"
           strokeLinejoin="round"
         >
           <line x1="18" y1="6" x2="6" y2="18" />
           <line x1="6" y1="6" x2="18" y2="18" />
         </svg>
       </button>
     </div>
     
     <div className="w-full h-full flex items-center justify-center">
       {work.type === 'animation' && work.component ? (
         <work.component />
       ) : work.type === 'video' ? (
         <video
           src={work.url}
           autoPlay
           loop
           muted
           playsInline
           className="w-full h-full object-contain"
         />
       ) : (
         <img
           src={work.url}
           alt={work.title}
           className="w-full h-full object-contain"
         />
       )}
     </div>
   </motion.div>
 )
}