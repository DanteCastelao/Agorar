"use client";
import React, { useEffect, useState, useRef } from "react";
import Article from "./components/article";
import Chart from "chart.js/auto";
import { Vidaloka } from "next/font/google";

const vidaloka = Vidaloka({ subsets: ["latin"], weight: '400', variable: '--font-vidaloka'});

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const chartDNURef = useRef(null);
  // const chartOmnibusRef = useRef(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      if (!chartDNURef.current ) {
        renderCharts();
      }
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
        } else if (a.status === 'En discusión' && b.status !== 'No Vigente') {
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
    const ctxDNU = document.getElementById('chartDNU').getContext('2d');
    // const ctxOmnibus = document.getElementById('chartOmnibus').getContext('2d');

    chartDNURef.current = new Chart(ctxDNU, {
      type: 'doughnut',
      data: {
        labels: ['No Vigente', 'Vigente', 'En discusión'],
        datasets: [{
          label: 'Temáticas del DNU',
          data: [
            countArticlesByStatusAndCategory('No Vigente', 'dnu'),
            countArticlesByStatusAndCategory('Vigente', 'dnu'),
            countArticlesByStatusAndCategory('En discusión', 'dnu')
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
            const clickedLabel = chartDNURef.current.data.labels[chartElement[0].index];
            filterArticlesByStatus(clickedLabel);
          }
        }
      }
    });

    // chartOmnibusRef.current = new Chart(ctxOmnibus, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['No Vigente', 'Vigente', 'En discusión'],
    //     datasets: [{
    //       label: 'Articulos de la Ley Omnibus',
    //       data: [
    //         countArticlesByStatusAndCategory('No Vigente', 'omnibus'),
    //         countArticlesByStatusAndCategory('Vigente', 'omnibus'),
    //         countArticlesByStatusAndCategory('En discusión', 'omnibus')
    //       ],
    //       backgroundColor: [
    //         '#DF7474',
    //         '#74ACDF',
    //         '#D9D9D9'
    //       ],
    //       borderColor: [
    //         '#DF7474',
    //         '#74ACDF',
    //         '#D9D9D9'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     onClick: (event, chartElement) => {
    //       if (chartElement.length > 0) {
    //         const clickedLabel = chartOmnibusRef.current.data.labels[chartElement[0].index];
    //         filterArticlesByStatus(clickedLabel);
    //       }
    //     }
    //   }
    // });
  };

  const countArticlesByStatusAndCategory = (status, category) => {
    return articles.filter(article => article.status === status && article.category === category).length;
  };

  const filterArticlesByStatus = (status) => {
    setSearchQuery('');
    setFilteredArticles(articles.filter(article => article.status === status));
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setFilteredArticles(articles.filter(article => {
      if (event.target.value.trim() === "") {
        return true;
      } else {
        return article.name.toLowerCase().includes(event.target.value.toLowerCase()) || article.description.toLowerCase().includes(event.target.value.toLowerCase());
      }
    }));
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#F3F6F9]">
      <div className="flex flex-row px-8 py-4 justify-center">
        <span className={`${vidaloka.variable} font-mono text-white text-4xl bg-[#38485C] px-2 py-1`}>Agorar</span>
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col gap-4 mt-4">
          <canvas id="chartDNU"></canvas>
          <p className="text-center text-[#38485C] text-[1.5rem] font-bold">DNU</p>
        </div>
        {/* <div className="flex flex-col gap-4">
          <canvas id="chartOmnibus"></canvas>
          <p className="text-center text-[#38485C] text-[1.5rem] font-bold">OMNIBUS</p>
        </div> */}
      </div>
      <span className="text-[#38485C] font-medium text-center text-[0.95rem] my-8">Ultima vez actualizado: 31/1/2024 9:19 a.m.</span>
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
