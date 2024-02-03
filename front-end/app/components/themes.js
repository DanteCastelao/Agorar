import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import Article from "./article";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import WhatsappIcon from "../assets/WhatsAppIcon.png";
import TwitterIcon from "../assets/TwitterIcon.png";
import FacebookIcon from "../assets/FacebookIcon.png";

const Themes = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const chartRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState("");

  const [searchFilters, setSearchFilters] = useState([]);
  /* "No Vigente", "Vigente", "En discusión" */
    const filtersColors = {
        Vigente: "bg-[#74ACDF]",
        "No Vigente": "bg-[#DF7474]",
        "En discusión": "bg-[#838383]",
    };

    /**
     * @type [Fuse | null, React.Dispatch<React.SetStateAction<Fuse | null>>]
     */
    const [fuse] = useState(
        new Fuse([], {
            includeScore: true,
            threshold: 0.4,
            keys: ["description", "name"],
        })
    );

	useEffect(() => {
		setCurrentUrl(window.location.href);
		fetchArticles();
	}, []);

	useEffect(() => {
		if (articles.length > 0) {
			if (!chartRef.current) {
				renderCharts();
			}
			filterArticlesByCategory(category);
		}
	}, [articles]);

	useEffect(() => {
		if (searchFilters.length > 0) {
			filterArticlesByStatus(searchFilters);
		} else {
			filterArticlesByCategory(category);
		}
	}, [searchFilters]);

	const fetchArticles = async () => {
		try {
			const response = await fetch("https://agorar-fb7184e25907.herokuapp.com/articles");
			if (!response.ok) {
				throw new Error("Failed to fetch articles");
			}
			const data = await response.json();

			// Sort articles by status: No Vigente first, En discusión second, Vigente third
			data.sort((a, b) => {
        const modifiedStatusLabel = (category === "dnu") ? "En discusión" : "Modificada";
    
        // Define the sorting logic based on the modified status label
        if (a.status === "No Vigente") {
            return -1;
        } else if (a.status === modifiedStatusLabel && b.status !== "No Vigente") {
            return -1;
        } else {
            return 0;
        }
    });    

			fuse.setCollection(data);
			setArticles(data);
			setFilteredArticles(data); // Initialize filteredArticles with all articles
		} catch (error) {
			console.error("Error fetching articles:", error);
		}
	};

	const renderCharts = (cae) => {
		const ctx = document.getElementById("chart").getContext("2d");
        const statusLabels = ["No Vigente", "Vigente", "En discusión"];
        if (category === "omnibus") {
            statusLabels[2] = "Modificada"; // Change "En discusión" to "Modificada" based on some condition
        }
        chartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: statusLabels,
            datasets: [
            {
                label: `Temáticas del ${category}`,
                data: [
                countArticlesByStatusAndCategory(statusLabels[0], category),
                countArticlesByStatusAndCategory(statusLabels[1], category),
                countArticlesByStatusAndCategory(statusLabels[2], category),
                ],
                backgroundColor: [
                "#DF7474",
                "#74ACDF",
                "#D9D9D9",
                ],
                borderColor: [
                "#DF7474",
                "#74ACDF",
                "#D9D9D9",
                ],
                borderWidth: 1,
            },
            ],
        },
			options: {
				onClick: (event, chartElement) => {
					if (chartElement.length > 0) {
						const clickedLabel = chartRef.current.data.labels[chartElement[0].index];
						setSearchFilters((old) => {
							if (old.includes(clickedLabel)) {
								return old.filter((label) => label !== clickedLabel);
							}
							return [...old, clickedLabel];
						});
					}
				},
			},
		});
	};

	const countArticlesByStatusAndCategory = (status, category) => {
		return articles.filter((article) => article.status === status && article.category === category)
			.length;
	};

	const filterArticlesByStatus = (statuses) => {
		setSearchQuery("");
		const data = articles.filter(
			(article) => statuses.includes(article.status) && article.category === category
		);
		setFilteredArticles(data);
		fuse.setCollection(data);
	};

	const filterArticlesByCategory = (category) => {
		setSearchQuery("");
		const data = articles.filter((article) => article.category === category);
		setFilteredArticles(data);
		fuse.setCollection(data);
	};

	const handleSearchInputChange = (event) => {
		const searchQuery = event.target.value.trim().toLowerCase();
		setSearchQuery(searchQuery);

		if (searchQuery === "") {
			filterArticlesByCategory(category);
			return;
		}

		const filtered = fuse.search(searchQuery);

		setFilteredArticles(filtered.map((result) => result.item));
	};

  return (
    <main className="flex min-h-screen flex-col bg-[#F3F6F9]">
      <div className="flex flex-row px-8 py-4 justify-center">
        <span className="font-mono text-white text-4xl bg-[#38485C] px-2 py-1">
          Agorar
        </span>
      </div>
      <div className="flex flex-row justify-center text-[#8F8F8F] font-bold gap-6 text-center">
        <a href="/omnibus-tematicas" className={category === "omnibus" ? "text-[#38485C]" : "hover:text-[#404040]"}>
          Ley Omnibus: Temáticas
        </a>
        <a href="/" className={category === "dnu" ? "text-[#38485C]" : "hover:text-[#404040]"}>
          DNU
        </a>
        <a
          href="/omnibus-diputados"
          className="hover:text-[#404040]"
        >
          Ley Omnibus: Diputados
        </a>
      </div>
      <div className="flex flex-row justify-center gap-6 mt-4">
        <a
            href={`whatsapp://send?text=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus%20-%20${currentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src={WhatsappIcon.src} alt="Compartir en WhatsApp" />
        </a>
        <a
            href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src={TwitterIcon.src} alt="Compartir en Twitter" />
        </a>
        <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src={FacebookIcon.src} alt="Compartir en Facebook" />
        </a>
    </div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col gap-4 mt-4">
          <canvas id="chart"></canvas>
          <p className="text-center text-[#38485C] text-[1.5rem] font-bold">
            {category === "dnu" ? "DNU" : "Ley Omnibus"}
          </p>
        </div>
      </div>
      <span className="text-[#38485C] font-medium text-center text-[0.95rem] my-8">
        Ultima vez actualizado: 31/1/2024 9:19 a.m.
      </span>
      <div className="flex flex-row bg-white rounded-[5px] mx-[10%] border-[2px] border-[#D9D9D9] my-4">
        <input
          className="flex flex-grow rounded-[5px] p-4 py-2 placeholder-[#838383] text-[#38485C] font-medium focus:outline-none"
          type="text"
          placeholder="Buscar temática"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="mx-[10%]">
        {searchFilters.map((filter, index) => (
            <div
                key={index}
                className={`${filtersColors[filter]} text-white px-3 py-1 rounded-full inline-block mx-2 w-fit`}
            >
                <span key={index}>{filter}</span>

                <svg
                    className="inline-block w-4 h-4 ml-1 cursor-pointer"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    onClick={() => {
                        const newSearchFilters = searchFilters.filter((_, i) => i !== index);
                        setSearchFilters(newSearchFilters);
                        filterArticlesByCategory(category);
                    }}
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </div>
        ))}
      </div>
      <div className="grid gap-5 mx-[10%] my-8 grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))]">
					{filteredArticles.map((article, index) => (
						<motion.div key={article.name} layoutId={`article-${article.name}`} layout>
							<Article
								title={article.name}
								description={article.description}
								status={article.status}
							/>
						</motion.div>
					))}
			</div>
      <footer>
        <div className="flex flex-row justify-center gap-2 bg-[#38485C] text-white py-4">
          <span className="text-[0.85rem] font-medium">
            © 2024 Agorar. Todos los derechos reservados.
          </span>

          <a
            href="https://github.com/DanteCastelao/Agorar"
            className="text-[0.85rem] font-medium ml-2 underline underline-offset-2 flex flex-row items-center gap-1"
          >
            <svg
              className="inline-block w-5 h-5"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                stroke="none"
                d="M0 0h24v24H0z"
                fill="none"
              />
              <path
                d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.5c0-1.48 -.274 -2.882 -.777 -4.155m-1.034 -1.805c-.842 -1.804 -2.154 -3.19 -3.689 -4.04m-2.955 -.955c-1.493 -.22 -2.946 -.22 -4.5 0m10.5 5c1.607 -2.033 2.5 -4 2.5 -6.5c0 -6.5 -4 -9.5 -12 -9.5s-12 3 -12 9.5c0 2.5 .893 4.467 2.5 6.5"
              />
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Themes;