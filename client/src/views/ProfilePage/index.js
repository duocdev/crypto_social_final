import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, Navigate, useNavigate } from 'react-router-dom'



const ProfilePage = () => {
    const account = useSelector(state => state.account)
    const navigate = useNavigate()
    const params = useParams()
    const username = params.username
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])

    const fetchData = async () => {
        const result = await axios.post('/accounts/profile', { username })
        setProfile(result.data.profile)
        setPosts(result.data.posts)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleFollow = async () => {
        const result = await axios.post('/accounts/follow', { username: account.username, follow: username })
        if (result.data.success) {
            fetchData()
        } else {
            console.log(result.data.message)
        }
    }
    const handleUnFollow = async () => {
        const result = await axios.post('/accounts/unfollow', { username: account.username, follow: username })
        if (result.data.success) {
            fetchData()
        } else {
            console.log(result.data.message)
        }
    }

    //------------------------------------------------------
    const [error_create_post, setError_create_post] = useState({ error: false, message: '' })
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const hanldeCreatePost = async () => {
        if (!content) {
            setError_create_post({ error: true, message: 'Vui lòng nhập nội dung' })
        } else {
            const tgs = tags.trim().split('#')
            tgs.splice(0, 1)
            const rs = await axios.post('/posts/create', {
                content,
                tags: tgs,
                username: account.username,
                displayname: account.displayname
            })
            if (rs.data.success) {
                setContent('')
                setTags('')
                setError_create_post({ error: true, message: rs.data.message })
                fetchData()
            } else {
                setError_create_post({ error: true, message: rs.data.message })
            }
        }
    }

    //-----------------------------------------------------

    const renderButtonFollow = () => {
        if (account.username !== username) {
            if (profile.followers !== null)
                if (profile.followers.includes(account.username)) {
                    return (
                        <button onClick={handleUnFollow} className=" btn btn-primary float-end">Following</button>
                    )
                } else {
                    return (
                        <button onClick={handleFollow} className=" btn btn-outline-primary float-end">Follow</button>
                    )
                }
        }
    }

    const renderCreatePost = () => {
        if (account.username === username) {
            return (
                <div className=" row mb-5">
                    <div className=" col-xxl-6 m-auto">
                        <div className=" card  shadow-sm p-3 border border-primary rounded">
                            <div className=" card-body">
                                {error_create_post.error &&
                                    <div className=" mb-3">
                                        <div className=" alert alert-danger">{error_create_post.message}</div>
                                    </div>
                                }
                                <div className=" mb-3">
                                    <textarea onChange={e => { setContent(e.target.value); setError_create_post({ error: false }) }} value={content} className=" form-control" placeholder="Bạn đang nghĩ gì?"></textarea>
                                </div>
                                <input onChange={(e) => setTags(e.target.value)} value={tags} type="text" placeholder="tag ví dụ #crypto #btc" />
                                <button onClick={hanldeCreatePost} className="btn btn-primary float-end">Đăng bài</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

        const renderPosts = posts.map((post) => {
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



        if (account.username === null) return <Navigate to='/login' />
        return (
            <>
                <div className=" row mb-3">
                    <div className=" col-xxl-6 m-auto">
                        <div className=" card shadow-sm p-3 border border-primary">
                            {profile !== null &&
                                <div className=" card-body">
                                    <div className=" h6">{profile.displayname}</div>
                                    <div className=" text-muted">@{profile.username}</div>
                                    <div className=" mb-3">{profile.bio}</div>
                                    <div className=" mb-3 text-muted">{profile.following.length} following - {profile.followers.length} followers</div>
                                    {renderButtonFollow()}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {renderCreatePost()}
                {renderPosts}
            </>
        )
    }


    export default ProfilePage