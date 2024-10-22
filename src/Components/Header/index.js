import logo from '../../Asssets/Logo.svg'
import login from '../../Asssets/Login.svg'
import HeaderIcon from '../../Asssets/Header_Icon.svg'
import SearchIcon from '../../Asssets/Search_Icon.svg'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function Header(props) {
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if(props.activeFilter == "UAE")
      setSearchTerm("")
  }, [props])
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      props.handleFetchSentimentData(searchTerm, props.activeMenu );
      props.setActiveFilter(searchTerm)
    }
    else if (e.key === 'Enter' && searchTerm == "") {
      props.handleFetchSentimentData("UAE", props.activeMenu );
      props.setActiveFilter(searchTerm)
    }
  };


  return (
    <div className="header">
      <img src={logo} className="Logo_image cursor-pointer"></img>
      <div className="Search_input">
        <img src={SearchIcon} className="HeaderIcon" style={{ marginRight: 20 }}></img>
        <input
          type="text" className='Search_text_input' placeholder='What news are you looking for?'
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value={searchTerm}
          onKeyDown={handleSearch} // Trigger search on Enter
        >
        </input>
      </div>
      <div className='Setting_menu'>
        <img src={HeaderIcon} className="cursor-pointer HeaderIcon" style={{ marginRight: 20 }}></img>
        <span style={{ display: 'flex' }} className='cursor-pointer'>
          <img src={login} className="Login_image" style={{ marginRight: 10 }}></img>
          <span style={{ fontSize: 15 }}>Login</span>
        </span>
      </div>
    </div>
  );
}

export default Header;
