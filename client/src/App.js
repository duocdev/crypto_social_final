import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import ProfilePage from './views/ProfilePage'
import PostPage from './views/PostPage'
import SettingPage from './views/SettingPage'
import SearchPage from './views/SearchPage'


function App() {
  const account = useSelector(state => state.account)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const linkProfile = account.username ? `/profile/${account.username}` : '/login'

  const handleSearch = () => {
    navigate(`/search/${search}`)
  }

  const handleExit = () => {
    dispatch({ type: 'CLEAR_ACCOUNT' })
  }


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Crypto Social</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link fw-bold" to='/' >Trang chủ</Link>
              </li>
              {account.username &&
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to={linkProfile} >Trang cá nhân</Link>
                </li>}
              {account.username &&
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to='/setting' >Cài đặt</Link>
                </li>
              }
            </ul>
            {account.username && <div className=" nav-text">Chào {account.displayname}</div>}
            <form className="d-flex">
              {account.username &&
                <button onClick={handleExit} className="btn btn-btn-outline-dark" type="button">Thoát</button>
              }
              <input onChange={e => setSearch(e.target.value)} value={search} className="form-control me-2" type="search" placeholder="Tìm ..." />
              <button onClick={handleSearch} className="btn btn-outline-success" type="button">Search</button>
            </form>
          </div>
        </div>
      </nav>
      <div className=" container-fluid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts/" element={<PostPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/search/:keyword" element={<SearchPage />} />
        </Routes>
      </div>

    </>
  )
}

export default App
