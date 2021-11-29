import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"



const SearchPage = () => {
    const account = useSelector(state => state.account)
    const params = useParams()
    const navigate = useNavigate()
    const keyword = params.keyword
    const [search, setSearch] = useState(keyword)
    const [people, setPeople] = useState([])
    const [posts_tag, setPosts_tag] = useState([])
    const [posts_content, setPosts_content] = useState([])

    const fetchData = async () => {
        const result = await axios.post('/search', { keyword:search })
        console.log(result.data)
        setPeople(result.data.accounts)
        setPosts_tag(result.data.posts_tag)
        setPosts_content(result.data.post_content)
    }

    useEffect(() => { fetchData() }, [])


    const handleSearch = () => {
        console.log(search)
        fetchData()
    }

    const renderPosts_tag = posts_tag.map((post) => {
        const handleClick = () => {
            navigate('/posts/', { state: { post } })
        }
        const handleLike = async () => {
            const rs = await axios.post('/posts/like', { post_id: post._id, username: account.username })
            if (rs.data.success) {
                fetchData()
            } else {
                console.log(rs.data.message)
            }
        }
        const handleUnLike = async () => {
            const rs = await axios.post('/posts/unlike', { post_id: post._id, username: account.username })
            if (rs.data.success) {
                fetchData()
            } else {
                console.log(rs.data.message)
            }
        }

        return (
            <div className=" row mb-3" key={post._id}>
                <div className=" col-xxl-6 m-auto">
                    <div className=" card shadow-sm p-3 border border-primary rounded">
                        <div className=" card-body">
                            <div className=" mb-3">
                                <div className=" h6">{post.by.displayname}</div>
                                <div className=" text-muted">@{post.by.username}</div>
                                <div className=" text-muted">{new Date(post.created_at).toLocaleString()}</div>
                            </div>
                            <div onClick={handleClick} className=" mb-3">
                                <div>{post.content}</div>
                            </div>
                            <hr className=" py-0" />
                            <div className=" mb-3 text-muted">{post.likes.length} thích - {post.comments.length} bình luận
                            </div>
                            <div className=" mb-3">
                                {post.tags.map((tag, index) => { return <span key={index} className="badge bg-primary me-1">#{tag}</span> })}
                            </div>
                            {
                                post.likes.includes(account.username) ? <button onClick={handleUnLike} className=" btn btn-primary me-1">Thích</button>
                                    : <button onClick={handleLike} className=" btn btn-outline-primary me-1">Thích</button>
                            }
                            <button onClick={handleClick} className=" btn btn-outline-primary">Bình luận</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    const renderPosts_content = posts_content.map((post) => {
        const handleClick = () => {
            navigate('/posts/', { state: { post } })
        }
        const handleLike = async () => {
            const rs = await axios.post('/posts/like', { post_id: post._id, username: account.username })
            if (rs.data.success) {
                fetchData()
            } else {
                console.log(rs.data.message)
            }
        }
        const handleUnLike = async () => {
            const rs = await axios.post('/posts/unlike', { post_id: post._id, username: account.username })
            if (rs.data.success) {
                fetchData()
            } else {
                console.log(rs.data.message)
            }
        }

        return (
            <div className=" row mb-3" key={post._id}>
                <div className=" col-xxl-6 m-auto">
                    <div className=" card shadow-sm p-3 border border-primary rounded">
                        <div className=" card-body">
                            <div className=" mb-3">
                                <div className=" h6">{post.by.displayname}</div>
                                <div className=" text-muted">@{post.by.username}</div>
                                <div className=" text-muted">{new Date(post.created_at).toLocaleString()}</div>
                            </div>
                            <div onClick={handleClick} className=" mb-3">
                                <div>{post.content}</div>
                            </div>
                            <hr className=" py-0" />
                            <div className=" mb-3 text-muted">{post.likes.length} thích - {post.comments.length} bình luận
                            </div>
                            <div className=" mb-3">
                                {post.tags.map((tag, index) => { return <span key={index} className="badge bg-primary me-1">#{tag}</span> })}
                            </div>
                            {
                                post.likes.includes(account.username) ? <button onClick={handleUnLike} className=" btn btn-primary me-1">Thích</button>
                                    : <button onClick={handleLike} className=" btn btn-outline-primary me-1">Thích</button>
                            }
                            <button onClick={handleClick} className=" btn btn-outline-primary">Bình luận</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    })


    if (account.username === null) return <Navigate to="/login" />
    return (
        <>
            <div className=" row">
                <div className=" col-xxl-6 m-auto">
                    <div className="card">
                        <div className="card-body">
                            <div className=" input-group">
                                <input type="text" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" row">
                <div className=" col-xxl-6 m-auto">
                    <div className="card">
                        <div className="card-header bg-white fw-bold text-uppercase text-primary">mọi người</div>
                        <div className="card-body">
                            <ul className="list-group">
                                {
                                    people.map((item, index) => {
                                        let link = "/profile/" + item.username
                                        return (
                                            <Link to={link} class="list-group-item list-group-item-action" key={index}>
                                                <div><span className=" text-muted">@{item.username}</span> {item.displayname}</div>
                                            </Link>
                                        )
                                    })
                                }
                            </ul>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className=" row">
                <div className=" col-xxl-6 m-auto">
                    <div className="card">
                        <div className="card-header bg-white fw-bold text-uppercase text-primary">bài đăng có gắn thẻ</div>
                    </div>
                </div>
            </div>
            {renderPosts_tag}
            <div className=" row">
                <div className=" col-xxl-6 m-auto">
                    <div className="card">
                        <div className="card-header bg-white fw-bold text-uppercase text-primary">bài đăng có từ khóa trong nội dung</div>
                    </div>
                </div>
            </div>
            {renderPosts_content}
        </>
    )
}

export default SearchPage