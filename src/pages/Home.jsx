import React, { useEffect, useState, useRef } from "react";
import sfondo from "../asset/sfondobackground.png";
import logo from "../asset/logo.png";
import NavBar from "../components/NavBar";
import AboutMe from "../components/AboutMe";
import supabase from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Home() {
  const [preview, setPreview] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null); // full article
  const [panelLoading, setPanelLoading] = useState(false);
  const heroRef = useRef(null);
  const previewRef = useRef(null);
  // start hidden so the entrance transition runs on initial page load
  const [heroInView, setHeroInView] = useState(false);
  const [previewInView, setPreviewInView] = useState(false);
  const [logoAnimate, setLogoAnimate] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      const { data, error } = await supabase
        .from("articles")
        // include content + author so we can show it immediately (fallback/full view)
        .select("id,title,excerpt,slug,image,content,author")
        .order("created_at", { ascending: false })
        .limit(3);
      if (!error && data) setPreview(data);
    };
    fetchPreview();
  }, []);

  // close panel on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setActiveArticle(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const currentFetchSlug = useRef(null);

  const openArticlePanel = async (articleOrSlug) => {
    setPanelLoading(true);
    setActiveArticle(null);

    const isString = typeof articleOrSlug === "string";
    const slug = isString ? articleOrSlug : articleOrSlug?.slug;
    const previewItem = isString ? preview.find((p) => p.slug === slug) : articleOrSlug;

    // show preview immediately
    if (previewItem) {
      setActiveArticle({
        title: previewItem.title,
        author: previewItem.author || "Unknown",
        created_at: previewItem.created_at || new Date().toISOString(),
        content: previewItem.content || previewItem.excerpt || "<p>Contenuto non disponibile</p>",
        image: previewItem.image || null,
      });
    }

    if (!slug) {
      setPanelLoading(false);
      return;
    }

    // track current requested slug to avoid race updates
    currentFetchSlug.current = slug;

    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .single();
      if (!error && data && currentFetchSlug.current === slug) {
        setActiveArticle(data);
      }
    } catch (e) {
      console.error("Error loading full article", e);
    } finally {
      // only stop loading if this is the current request
      if (currentFetchSlug.current === slug) currentFetchSlug.current = null;
      setPanelLoading(false);
    }
  };

  // hero and preview observers
  useEffect(() => {
    const heroEl = heroRef.current;
    if (heroEl) {
      const hObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setHeroInView(entry.isIntersecting));
        },
        { threshold: 0.05 }
      );
      hObs.observe(heroEl);
      return () => hObs.disconnect();
    }
  }, []);

  useEffect(() => {
    const previewEl = previewRef.current;
    if (previewEl) {
      const pObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setPreviewInView(entry.isIntersecting);
          });
        },
        { threshold: 0.12 }
      );
      pObs.observe(previewEl);
      return () => pObs.disconnect();
    }
  }, []);

  // on mount animate logo briefly
  useEffect(() => {
    // trigger the hero and logo entrance on initial load
    // small next-tick timeout ensures transitions run
    const a = setTimeout(() => setHeroInView(true), 50);
    setLogoAnimate(true);
    const t = setTimeout(() => setLogoAnimate(false), 800);
    return () => {
      clearTimeout(a);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="bg-gray-900">
      <NavBar current="" />

      <div
        className="relative isolate px-6 pt-14 lg:px-8"
        style={{
          backgroundImage: `url(${sfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
          {/* dark veil over the background to improve contrast */}
          <div aria-hidden className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div ref={heroRef} className={`mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 relative z-10 transform transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div
            className="sm:mb-8 sm:flex sm:justify-center"
            style={{ placeItems: "anchor-center" }}
          >
            <img
              alt="Company Logo"
              src={logo}
              className={`h-[12vh] w-auto transform transition-all duration-700 ${(heroInView || logoAnimate) ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-2 scale-95'}`}
            />
          </div>
          <div className="text-center">
            <h1 className={`text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl transform transition-all duration-700 ${(heroInView || logoAnimate) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
               Jackowski Immobiliare srl
            </h1>
           {/*  <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
            </p> */}
          </div>
        </div>
      </div>
  {/* About me section */}
  <AboutMe />

      {/* Article Modal (overlay) */}
      {panelLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-50 max-w-3xl w-full bg-white rounded-lg p-6">
            <p className="text-sm text-slate-600">Caricamento articolo...</p>
          </div>
        </div>
      )}

      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setActiveArticle(null)}
          />
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            {activeArticle.image && (
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
              <div className="p-6 flex flex-col max-h-[80vh]">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-semibold mb-2">
                    {activeArticle.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  By {activeArticle.author} -{" "}
                  {new Date(activeArticle.created_at).toLocaleString()}
                </p>
                <div
                  className="prose max-w-none overflow-auto mb-4"
                  style={{ flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: activeArticle.content }}
                />

                {/* footer with right-aligned close button */}
                <div className="mt-4 flex justify-end border-t border-slate-100/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(null)}
                    className="px-4 py-2 bg-slate-200 rounded"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

  {/* Preview articoli */}
  <div ref={previewRef} className={`max-w-7xl mx-auto px-6 py-12 transform transition-all duration-700 ${previewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Blog Immobili</h3>
          <Link to="/blog" className="text-sm text-slate-300 hover:text-white">
            Vedi tutti
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {preview.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => openArticlePanel(a)}
              className="text-left block bg-white/5 rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out hover:scale-103 hover:-translate-y-1 hover:shadow-2xl focus:scale-103 focus:-translate-y-1 focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
            >
              {a.image ? (
                <img
                  src={a.image}
                  alt={a.title}
                    className="w-full h-36 object-cover"
                    loading="lazy"
                />
              ) : (
                <div className="w-full h-36 bg-white/3 flex items-center justify-center text-slate-300">
                  No image
                </div>
              )}
              <div className="p-3">
                <h4 className="text-sm font-semibold text-white line-clamp-2">
                  {a.title}
                </h4>
                <p className="mt-2 text-xs text-slate-300 line-clamp-3">
                  {a.excerpt || a.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

  
