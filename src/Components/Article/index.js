import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import TopMenuIcon from '../../Asssets/Top_menu.svg'
import BackTo from '../../Asssets/back_to.png'
import TopicIcon from '../../Asssets/Topic_Icon.svg'
import { formatDistanceToNow } from 'date-fns'; // Import for relative date formatting
import Header from '../Header';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

// API Endpoint
const API_URL = 'https://ai.oigetit.com/AI71/Articles';

// Function to determine sentiment label, emoji, and color
const getSentimentIcon = (sentiment) => {
  if (sentiment < -10) return { icon: "😡😡😡", label: "Very Negative", color: "red" };
  if (sentiment < 0) return { icon: "😠😠", label: "Negative", color: "red" };
  if (sentiment === 0) return { icon: "😐", label: "Neutral", color: "yellow" };
  if (sentiment > 0 && sentiment <= 10) return { icon: "😊😊", label: "Positive", color: "green" };
  if (sentiment > 10) return { icon: "😁😁😁", label: "Very Positive", color: "green" };
  return { icon: "❓", label: "Unknown", color: "gray" };
};

const ArticleTable = () => {
  const { query } = useParams(); // Get search query from URL
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const articlesPerPage = 10; // Number of articles per page

  // Fetch articles from the API
  const fetchArticles = async (currentPage) => {
    try {
      const response = await axios.post(API_URL, {
        StartDate: '2024-09-01',
        EndDate: '2024-10-01',
        Query: 'UAE', // The search query (can be adjusted dynamically)
        Sentiment: 'all', // Filter by sentiment (e.g., positive, negative, all)
        Sort: 0, // 0 for ascending, 1 for descending
        Page: currentPage,
        Size: articlesPerPage, // Fetch only articlesPerPage items per request
      });

      setArticles(response.data.result); // Assuming API returns 'result' array
      setTotalPages(Math.ceil(response.data.result.length / articlesPerPage)); // Assuming 'total' returns total count of articles
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  // Fetch data when the page loads or when 'page' changes
  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  // Handle page change for pagination
  const handlePageClick = (data) => {
    setPage(data.selected);
     
  };

  return (
    <>
      <Header />
      <div className="article-table-container">
        <div className='top-menu'>
          <img src={TopMenuIcon} className='top_menu_icon cursor-pointer'></img>
          <div className='topic-menu' style={{justifyContent: 'left'}}>
            <img src={BackTo} className='top_menu_icon cursor-pointer'></img>
            
            <span className='dashboard-header-text'>
              <span className='dashboard-header-text' style={{color: 'black'}}>Back to&nbsp;</span>
              <Link to="/">Falcon AI Dashboard</Link>
            </span>
            
          </div>
        </div>
        <div className='dashboard-header'>
          <span className='dashboard-header-text' style={{color: 'black'}}>Search Results for: {query}</span>
          <div className='dashboard-date-menu'>
            <div className='dashboard-date-active-menu-item cursor-pointer'>This week</div>
            <div className='dashboard-date-menu-item cursor-pointer'>This Month</div>
            <div className='dashboard-date-menu-item cursor-pointer'>Choose Date</div>
          </div>
        </div>

        
        <table className="article-table">
          <thead>
            <tr>
              <th>Sentiment</th>
              <th>Article</th>
              <th>Source</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {articles && articles.map((article, index) => {
              if (index > 10)
                return ;
              const sentimentInfo = getSentimentIcon(article.happiness);

              return (
                <tr key={index}>
                  <td>
                    <span
                      style={{ color: sentimentInfo.color, fontSize: '24px' }}
                      title={sentimentInfo.label}
                    >
                      {sentimentInfo.icon}
                    </span>
                  </td>
                  <td>{article.title}</td>
                  <td>{article.feed}</td>
                  <td>{formatDistanceToNow(new Date(article.pubdate), { addSuffix: true })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Component */}
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </>
  );
};

export default ArticleTable;