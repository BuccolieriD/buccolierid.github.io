import React, { useEffect, useRef, useState } from 'react';
import portrait from '../asset/siluette.png';

export default function AboutMe({ name = 'Angelo Jackowski', title = 'Agente Immobiliare', bio }) {
  const defaultBio =
    "Ciao, sono Angelo. Aiuto le persone a trovare la casa dei loro sogni con un approccio onesto e professionale. Con anni di esperienza nel mercato locale, offro supporto completo dalla valutazione alla chiusura della compravendita.";

  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // entering viewport
            setInView(true);
            if (prefersReduced) {
              setImageVisible(true);
              setTextVisible(true);
            } else {
              setImageVisible(true);
              timers.current.push(setTimeout(() => setTextVisible(true), 160));
            }
            obs.disconnect(); // Disconnetti dopo la prima apparizione
          }
        });
      },
      { threshold: 0.15 }
    );

    obs.observe(el);

    return () => {
      obs.disconnect();
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // prefer-reduced-motion CSS fallback: add class names that skip transforms when needed
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    // section uses page background; card is pulled up to overlap the hero more
    <section className="bg-transparent text-slate-800 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={` bg-[aliceBlue] -mt-20 md:-mt-32 lg:-mt-36 bg-white/92 backdrop-blur-md rounded-3xl p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-30 transform transition-all duration-700 ease-out ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ boxShadow: '0 40px 120px rgba(2,6,23,0.55)' }}
        >
          <div className="flex justify-center md:justify-start -mt-6 md:-mt-10">
            <div 
              className={`w-80 h-80 md:w-72 md:h-72 rounded-xl shadow-2xl transform transition-all duration-[2000ms] ease-out ${
                prefersReducedMotion ? '' : imageVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-20'
              }`}
              style={{
                backgroundImage: `url(${portrait})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'transparent',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                WebkitMaskImage: `url(${portrait})`,
                WebkitMaskSize: 'cover',
                WebkitMaskPosition: 'center',
                maskImage: `url(${portrait})`,
                maskSize: 'cover',
                maskPosition: 'center'
              }}
            />
          </div>
          <div className={`text-center md:text-left transition-all duration-[1400ms] delay-300 ${prefersReducedMotion ? 'opacity-100' : textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <h3 className="text-3xl font-display mb-2">{name}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">{title}</p>
            <p className="text-base text-slate-600 leading-relaxed mb-6">{bio || defaultBio}</p>

            <div className="flex justify-center md:justify-start">
              <a href="mailto:info@example.com" className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300">Contattami</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
