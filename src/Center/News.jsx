import React, { useState, useEffect } from 'react';

const News = () => {
    const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index
    const [newsData, setNewsData] = useState([]); // Store fetched news articles
    const [summarizedNews, setSummarizedNews] = useState([]); // Store summarized news and sentiment
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Function to summarize and analyze content
    const summarizeAndAnalyze = async (content) => {
        try {
            const response = await fetch('http://localhost:5000/summarize-and-analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data; // Return summary and sentiment
        } catch (error) {
            console.error('Error summarizing and analyzing content:', error);
            throw new Error('Failed to summarize and analyze content');
        }
    };

    // Function to fetch news and process it
    const fetchNews = async () => {
        try {
            // Fetch news from NewsAPI
            
            const response = await fetch(
                'https://newsapi.org/v2/everything?q=bitcoin&apiKey=27569badc7684d3bbb9f289044b34cd1&pageSize=20'
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }

            const data = await response.json();
            const articles = data.articles.map((article) => ({
                title: article.title,
                image: article.urlToImage,
                publishedAt: article.publishedAt,
                content: article.content,
            }));
            setNewsData(articles); // Store fetched articles

            // Check local storage for cached news
            const cachedNews = JSON.parse(localStorage.getItem('cachedNews')) || [];
            const lastCachedDate = localStorage.getItem('lastCachedDate');

            // Clear cache if it's a new day
            const currentDate = new Date().toLocaleDateString();
            if (lastCachedDate !== currentDate) {
                localStorage.removeItem('cachedNews');
                localStorage.setItem('lastCachedDate', currentDate);
            }

            // Process each article
            const summarizedArticles = await Promise.all(
                articles.map(async (article) => {
                    // Check if the article is already cached
                    const cachedArticle = cachedNews.find(
                        (cached) => cached.title === article.title && cached.publishedAt === article.publishedAt
                    );
                    console.log("checking cached")
                    if (cachedArticle) {
                        // Use cached sentiment and summary
                        return cachedArticle;
                    } else {
                        // Fetch new sentiment and summary
                        console.log("sumaarizing")
                        const { summary, sentiment } = await summarizeAndAnalyze(article.content);
                        const newArticle = {
                            ...article,
                            summary,
                            sentiment,
                        };
                        console.log("sumarized");
                        // Add to cache
                        cachedNews.push(newArticle);
                        localStorage.setItem('cachedNews', JSON.stringify(cachedNews));

                        return newArticle;
                    }
                })
            );

            setSummarizedNews(summarizedArticles); // Store summarized articles
            setLoading(false); // Set loading to false
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch or process news');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Function to go to the next slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % summarizedNews.length);
    };

    // Function to go to the previous slide
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + summarizedNews.length) % summarizedNews.length);
    };

    if (loading) {
        return <div className="text-white p-4">Loading...</div>; // Display loading message
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>; // Display error message
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">B</h1>

            {/* Slider Container */}
            <div className="overflow-hidden relative h-[600px] rounded-lg shadow-lg">
                {/* Slides */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {summarizedNews.map((article, index) => (
                        <div
                            key={index}
                            className={`w-full flex-shrink-0 flex flex-col items-center justify-start p-6 ${
                                article.sentiment === 'Positive' ? 'bg-green-50' : 'bg-red-50'
                            }`}
                        >
                            {/* Sentiment and Published Date on Top */}
                            <div className="flex items-center justify-between w-full mb-4">
                                {/* Sentiment Icon */}
                                <div className="flex items-center space-x-2">
                                    {article.sentiment === 'Positive' ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-green-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6 text-red-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                                            />
                                        </svg>
                                    )}
                                    <span className={`text-lg font-semibold ${
                                        article.sentiment === 'Positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {article.sentiment}
                                    </span>
                                </div>
                                {/* Published Date */}
                                <p className="text-sm text-gray-500">
                                    Published: {new Date(article.publishedAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Article Image */}
                            <img
                                src={article.image || 'https://up.yimg.com/ib/th?id=OIP.A8uFWq3q-Yy9P8HBNgN4cAHaE8&pid=Api&rs=1&c=1&qlt=95&w=162&h=108'}
                                alt={article.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />

                            {/* Article Title */}
                            <h2 className="text-xl font-bold text-gray-800">{article.title}</h2>
                            {/* Article Summary */}
                            <p className="text-gray-600 mt-2 overflow-y-auto max-h-40">
                                <strong>Summary:</strong> {article.summary}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
                &larr; {/* Left Arrow */}
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
                &rarr; {/* Right Arrow */}
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-2 space-x-2">
                {summarizedNews.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                            currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default News;