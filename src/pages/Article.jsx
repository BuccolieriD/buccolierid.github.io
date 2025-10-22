import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';

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
      <div className="prose max-w-3xl mx-auto p-6">
        <h1>{article.title}</h1>
        <p className="text-sm text-gray-500">By {article.author} - {new Date(article.created_at).toLocaleString()}</p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} className="mt-4" />
      </div>
    </div>
  );
};

export default Article;
