import React from 'react';
import { motion } from 'framer-motion';
import portrait from '../asset/siluette.png';

// Optional: alternative AboutMe using Framer Motion for richer animation
export default function AboutMeFramer({ name = 'Angelo Jackowski', title = 'Agente Immobiliare', bio }) {
  const defaultBio =
    "Ciao, sono Angelo. Aiuto le persone a trovare la casa dei loro sogni con un approccio onesto e professionale.";

  const container = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        when: 'beforeChildren',
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-transparent text-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="-mt-6 md:-mt-12 bg-gray-50 rounded-2xl shadow-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-20">
          <motion.img variants={item} src={portrait} alt={`${name} portrait`} className="w-72 h-72 object-cover rounded-xl shadow-xl border border-gray-100" />
          <div>
            <motion.h3 variants={item} className="text-3xl font-display mb-2">{name}</motion.h3>
            <motion.p variants={item} className="text-sm text-slate-500 font-medium mb-4">{title}</motion.p>
            <motion.p variants={item} className="text-base text-slate-600 leading-relaxed mb-6">{bio || defaultBio}</motion.p>
            <motion.div variants={item} className="flex justify-center md:justify-start">
              <a href="mailto:info@example.com" className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Contattami</a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
