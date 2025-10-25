import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PageHero from '../components/PageHero';
// Fallback background per articoli (tema: scrittura/blog)
const blogArticleBg = 'https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1920&auto=format&fit=crop';

const Article = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(()=>{
    const fetch = async () => {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (error) return console.error(error);
      setArticle(data);
    };
    fetch();
  }, [slug]);

  if (!article) return <p>Loading...</p>;

  return (
    <div>
      <NavBar current="" />
      <PageHero title={article.title} bgImage={article.image || blogArticleBg} />
      <div className="prose max-w-3xl mx-auto p-6">
        <p className="text-sm text-gray-500">By {article.author} - {new Date(article.created_at).toLocaleString()}</p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} className="mt-4" />
      </div>
    </div>
  );
};

export default Article;
