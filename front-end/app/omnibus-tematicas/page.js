"use client";
import React, { useEffect, useState, useRef } from "react";
import Article from "../components/article";
import Chart from "chart.js/auto";
import { Vidaloka } from "next/font/google";

const vidaloka = Vidaloka({ subsets: ["latin"], weight: '400', variable: '--font-vidaloka'});

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const chartOmnibusRef = useRef(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      if (!chartOmnibusRef.current) {
        renderCharts();
      }
      filterArticlesByCategory("omnibus");
    }
  }, [articles]);

  const fetchArticles = async () => {
    try {
      const response = await fetch('https://agorar-fb7184e25907.herokuapp.com/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
  
      // Sort articles by status: No Vigente first, En discusión second, Vigente third
      data.sort((a, b) => {
        if (a.status === 'No Vigente') {
          return -1;
        } else if (a.status === 'Modificada' && b.status !== 'No Vigente') {
          return -1;
        } else {
          return 0;
        }
      });
  
      setArticles(data);
      setFilteredArticles(data); // Initialize filteredArticles with all articles
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  

  const renderCharts = () => {
    const ctxOmnibus = document.getElementById('chartOmnibus').getContext('2d');

    chartOmnibusRef.current = new Chart(ctxOmnibus, {
      type: 'doughnut',
      data: {
        labels: ['No Vigente', 'Vigente', 'Modificada'],
        datasets: [{
          label: 'Articulos de la Ley Omnibus',
          data: [
            countArticlesByStatusAndCategory('No Vigente', 'omnibus'),
            countArticlesByStatusAndCategory('Vigente', 'omnibus'),
            countArticlesByStatusAndCategory('Modificada', 'omnibus')
          ],
          backgroundColor: [
            '#DF7474',
            '#74ACDF',
            '#D9D9D9'
          ],
          borderColor: [
            '#DF7474',
            '#74ACDF',
            '#D9D9D9'
          ],
          borderWidth: 1
        }]
      },
      options: {
        onClick: (event, chartElement) => {
          if (chartElement.length > 0) {
            const clickedLabel = chartOmnibusRef.current.data.labels[chartElement[0].index];
            filterArticlesByStatus(clickedLabel);
          }
        }
      }
    });
  };

  const countArticlesByStatusAndCategory = (status, category) => {
    return articles.filter(article => article.status === status && article.category === category).length;
  };

  const filterArticlesByStatus = (status) => {
    setSearchQuery('');
    setFilteredArticles(articles.filter(article => article.status === status && article.category === "omnibus"));
  };

  const filterArticlesByCategory = (category) => {
    setSearchQuery("");
    setFilteredArticles(
      articles.filter((article) => article.category === category)
    );
  }

  const handleSearchInputChange = (event) => {
    const searchQuery = event.target.value.trim().toLowerCase();
    setSearchQuery(searchQuery);
    const normalizedSearchQuery = searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
    setFilteredArticles(articles.filter(article => {
      if (normalizedSearchQuery === "") {
        return article.category === "omnibus"; // Only consider articles of "omnibus" category when search query is empty
      } else {
        const normalizedTitle = article.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
        const normalizedDescription = article.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
        return (normalizedTitle.includes(normalizedSearchQuery) || normalizedDescription.includes(normalizedSearchQuery)) && article.category === "omnibus";
      }
    }));
  };  

  return (
    <main className="flex min-h-screen flex-col bg-[#F3F6F9]">
      <div className="flex flex-row px-8 py-4 justify-center">
        <span className={`${vidaloka.variable} font-mono text-white text-4xl bg-[#38485C] px-2 py-1`}>Agorar</span>
      </div>
      <div className="flex flex-row justify-center text-[#8F8F8F] font-bold gap-6 text-center">
        <a href="/omnibus-tematicas" className="text-[#38485C]">Ley Omnibus: Temáticas</a>
        <a href="/" className="hover:text-[#404040]">DNU</a>
        <a href="/omnibus-diputados" className="hover:text-[#404040]">Ley Omnibus: Diputados</a>
      </div>
      <div className="flex flex-row justify-center gap-6 mt-4">
        <a href={`whatsapp://send?text=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus%20-%20${window.location.href}`} target="_blank" rel="noopener noreferrer">
          <img src={WhatsappIcon.src} alt="Compartir en WhatsApp" />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus`} target="_blank" rel="noopener noreferrer">
          <img src={TwitterIcon.src} alt="Compartir en Twitter" />
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus`} target="_blank" rel="noopener noreferrer">
          <img src={FacebookIcon.src} alt="Compartir en Facebook" />
        </a>
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col gap-4">
          <canvas id="chartOmnibus"></canvas>
          <p className="text-center text-[#38485C] text-[1.5rem] font-bold">OMNIBUS</p>
        </div>
      </div>
      <span className="text-[#38485C] font-medium text-center text-[0.95rem] my-8">Ultima vez actualizado: 31/1/2024 21:31 a.m.</span>
      <div className="flex flex-row bg-white rounded-[5px] mx-[10%] border-[2px] border-[#D9D9D9] my-4">
        <input
          className="flex flex-grow rounded-[5px] p-4 py-2 placeholder-[#838383] text-[#38485C] font-medium focus:outline-none"
          type="text"
          placeholder="Buscar temática"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 mx-[10%] my-8 md:grid-cols-4 sm:grid-cols-2">
        {filteredArticles.map((article, index) => (
          <Article
            key={index}
            title={article.name}
            description={article.description}
            status={article.status}
          />
        ))}
      </div>
    </main>
  );
}