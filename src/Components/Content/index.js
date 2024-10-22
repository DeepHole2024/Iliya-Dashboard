import TopMenuIcon from '../../Asssets/Top_menu.svg';
import TopicIcon from '../../Asssets/Topic_Icon.svg';
import MediaMentionsChart from '../Charts/MediaMentionsChart';
import FirstChart from '../Charts/FirstChart';
import SecondChart from '../Charts/SecondChart';
import Map from '../Charts/Map';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import BackTo from '../../Asssets/back_to.png';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, subDays } from 'date-fns';
import ReactPaginate from 'react-paginate';

// Utility function to fetch data from the API
const fetchApiData = async (url, params) => {
  try {
    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(params),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null in case of error to prevent crashes
  }
};

// API Endpoint
const API_URL = 'https://ai.oigetit.com/AI71/Articles';

// Function to determine sentiment label, emoji, and color
const getSentimentIcon = (sentiment) => {
  if (sentiment < -10) return { icon: '😡😡😡', label: 'Very Negative', color: 'red' };
  if (sentiment < 0) return { icon: '😠😠', label: 'Negative', color: 'red' };
  if (sentiment === 0) return { icon: '😐', label: 'Neutral', color: 'yellow' };
  if (sentiment > 0 && sentiment <= 10) return { icon: '😊😊', label: 'Positive', color: 'green' };
  if (sentiment > 10) return { icon: '😁😁😁', label: 'Very Positive', color: 'green' };
  return { icon: '❓', label: 'Unknown', color: 'gray' };
};

function Content() {
  const [sentimentData, setSentimentData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const { query } = useParams(); // Get search query from URL
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [activeMenu, setActiveMenu] = useState(30); // Default to '30 days'
  const [activeFilter, setActiveFilter] = useState('UAE');

  // Function to handle menu item click
  const articlesPerPage = 10; // Number of articles per page

  const handleMenuClick = (menu) => {
    setActiveMenu(menu); // Update the active menu based on what was clicked
    handleFetchSentimentData(activeFilter, menu); // Fetch data for the updated menu
  };

  const handleFilterMenu = (menu) => {
    setActiveFilter(menu);
    handleFetchSentimentData(menu, activeMenu); // Update sentiment data based on active filter
  };

  // Function to calculate start and end dates based on selected range
  const calculateDateRange = (range) => {
    const endDate = new Date();
    const startDate = subDays(endDate, range == 30 ? 30 : 90); // Adjust date range
    return {
      StartDate: startDate.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
      EndDate: endDate.toISOString().split('T')[0], // Today's date
    };
  };

  // Fetch sentiment and country data
  const handleFetchSentimentData = (searchTerm, dateRange) => {
    const { StartDate, EndDate } = calculateDateRange(dateRange);

    const params = {
      StartDate,
      EndDate,
      Query: searchTerm,
      Sort: 1,
      Size: 1000,
    };
    
    // Fetch sentiment data
    fetchApiData('https://ai.oigetit.com/AI71/Histogram', params).then((data) => {
      if (data) {
        setSentimentData(data); // Set the sentiment data if successful
      } else {
        console.error('No sentiment data available');
      }
    });

    // Fetch country data (if needed)
    fetchApiData('https://ai.oigetit.com/AI71/Country', params).then((data) => {
      if (data) {
        setCountryData(data); // Set the country data if successful
      } else {
        console.error('No country data available');
      }
    });
  };

  // Fetch articles from the API
  const fetchArticles = async (currentPage, dateRange) => {
    const { StartDate, EndDate } = calculateDateRange(dateRange);
    try {
      const response = await axios.get(API_URL,{
        params: {
          json: JSON.stringify({
            StartDate: StartDate,
            EndDate: EndDate,
            Query: activeFilter,
            Sort: 1,
          })
        }});

      if (response.data.result) {
        setArticles(response.data.result); // Assuming API returns 'result' array
        setTotalPages(Math.ceil(response.data.result.length / articlesPerPage)); // Assuming 'total' returns total count of articles
      } else {
        console.error('No article data available');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  // Fetch data when the page loads or when 'page' changes
  useEffect(() => {
    fetchArticles(page, activeMenu); // Fetch articles on page load and when the page changes
  }, [page, activeFilter]);

  // Initial data fetch for sentiment and media mentions
  useEffect(() => {
    handleFetchSentimentData('UAE', activeMenu); // Fetch initial data for 'UAE' and '30 days' or '90 days'
  }, []);

  useEffect(() => {
    handleFetchSentimentData(activeFilter, activeMenu);
  },[activeMenu])

  // Handle page change for pagination
  const handlePageClick = (data) => {
    setPage(data.selected); // Set the current page based on user click
  };

  return (
    <>
      <Header handleFetchSentimentData={handleFetchSentimentData} activeMenu={activeMenu} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <div className="content">
        <div className="top-menu">
          <img src={TopMenuIcon} className="top_menu_icon cursor-pointer" alt="Top Menu" />
          <div className="topic-menu">
            <img src={TopicIcon} className="top_menu_icon cursor-pointer" alt="Topic Icon" />
            <span style={{ fontSize: 21.47, marginLeft: 20, marginRight: 20 }}>Topics: </span>
            <div
              className={
                activeFilter === 'CROWN PRINCE'
                  ? 'topic-item topic-active-item cursor-pointer'
                  : 'topic-item'
              }
              onClick={() => handleFilterMenu('CROWN PRINCE')}
            >
              CROWN PRINCE
            </div>
            <div
              className={
                activeFilter === 'FALCON LLM'
                  ? 'topic-item topic-active-item cursor-pointer'
                  : 'topic-item'
              }
              onClick={() => handleFilterMenu('FALCON LLM')}
            >
              FALCON LLM
            </div>
            <div
              className={
                activeFilter === 'UAE LEADERSHIP'
                  ? 'topic-item topic-active-item cursor-pointer'
                  : 'topic-item'
              }
              onClick={() => handleFilterMenu('UAE LEADERSHIP')}
            >
              UAE LEADERSHIP
            </div>
            <div
              className={
                activeFilter === 'ATRC'
                  ? 'topic-item topic-active-item cursor-pointer'
                  : 'topic-item'
              }
              onClick={() => handleFilterMenu('ATRC')}
            >
              ATRC
            </div>
            <div
              className={
                activeFilter === 'COP 28'
                  ? 'topic-item topic-active-item cursor-pointer'
                  : 'topic-item'
              }
              onClick={() => handleFilterMenu('COP 28')}
            >
              COP 28
            </div>
          </div>
        </div>

        <div className="dashboard-header">
          <span className="dashboard-header-text">Falcon AI Dashboard</span>
          <div className="dashboard-date-menu">
            <div
              className={
                activeMenu === 30
                  ? 'dashboard-date-active-menu-item cursor-pointer'
                  : 'dashboard-date-menu-item cursor-pointer'
              }
              onClick={() => handleMenuClick(30)}
            >
              30 days
            </div>
            <div
              className={
                activeMenu === 90
                  ? 'dashboard-date-active-menu-item cursor-pointer'
                  : 'dashboard-date-menu-item cursor-pointer'
              }
              onClick={() => handleMenuClick(90)}
            >
              90 days
            </div>
          </div>
        </div>

        {/* Main Content for charts and data */}
        <div className="main-content">
          <div className="MediaMentionsChart">
            {sentimentData && <FirstChart sentimentData={sentimentData} activeMenu = {activeMenu} activeFilter={activeFilter}/>}
          </div>
          <div className="MediaMentionsChart">
            {sentimentData && <MediaMentionsChart sentimentData={sentimentData} activeFilter={activeFilter} activeMenu={activeMenu}/>}
            <span>Weeks</span>
          </div>
          <div className="ChartContainer">
            <div className="MediaMentionsChart ResponsiveWidth" style={{ flexBasis: '50%' }}>
              {sentimentData && <SecondChart sentimentData={sentimentData} activeMenu={activeMenu} activeFilter={activeFilter}/>}
            </div>
            <div
              className="MediaMentionsChart ResponsiveWidth"
              style={{ position: 'relative', flexBasis: '50%' }}
            >
              {countryData && <Map countryData={countryData} />}
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: '0px',
                  bottom: '30px',
                }}
              >
                <div style={{ margin: '0 15px', display: 'flex' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: 'green' }}></div>
                  <span style={{ marginLeft: '5px' }}>Positive</span>
                </div>
                <div style={{ margin: '0 15px', display: 'flex' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow' }}></div>
                  <span style={{ marginLeft: '5px' }}>Neutral</span>
                </div>
                <div style={{ margin: '0 15px', display: 'flex' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: 'red' }}></div>
                  <span style={{ marginLeft: '5px' }}>Negative</span>
                </div>
                <div style={{ margin: '0 15px', display: 'flex' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: 'gray' }}></div>
                  <span style={{ marginLeft: '5px' }}>No Mention</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article table */}
        <div className="article-table-container">
          <table className="article-table">
            <thead>
              <tr>
                <th>Sentiment</th>
                <th>Trusted</th>
                <th>Article</th>
                <th>Source</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {articles &&
                articles.slice(page*10, (page+1)*10).map((article, index) => {
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
                      <td>{parseInt(article.trusted * 100) + "%"}</td>
                      <td><a href={article.imagelink} target='_blank'>{article.title}</a></td>
                      <td>{article.feed}</td>
                      <td>{article.pubdate}</td>
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
      </div>
    </>
  );
}

export default Content;
