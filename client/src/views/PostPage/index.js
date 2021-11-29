import React, { useState } from "react"
import {  Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from "axios"


const PostPage = () => {
    const account = useSelector(state => state.account)
    const location = useLocation()
    const [post, setPost] = useState(location.state.post)
    const [comment, setComment] = useState('')
    const [errorComment, setErrorComment] = useState({ error: false, message: '' })

    const fetchPost = async () => {
        const rs = await axios.post('/posts/post', { post_id: post._id })
        setPost(rs.data.post)
    }
    //------------------------------------------------------
    const handleLike = async () => {
        const rs = await axios.post('/posts/like', { post_id: post._id, username: account.username })
        if (rs.data.success) {
            fetchPost()
        } else {
            console.log(rs.data.message)
        }
    }
    const handleUnLike = async () => {
        const rs = await axios.post('/posts/unlike', { post_id: post._id, username: account.username })
        if (rs.data.success) {
            fetchPost()
        } else {
            console.log(rs.data.message)
        }
    }
    const handleComment = async () => {
        if (comment.length > 0) {
            const rs = await axios.post('/posts/comment', { post_id: post._id, username: account.username, content: comment, displayname: account.displayname })
            if (rs.data.success) {
                fetchPost()
            } else {
                console.log(rs.data.message)
            }
        } else {
            setErrorComment({ error: true, message: 'Bình luận đang trống' })
        }
    }

    //------------------------------------------------------
    const renderComments = post.comments.map((comment,index) => {

        return (
            <div className=" row mb-1" key={index}>
                <div className=" col-xxl-6 m-auto">
                    <div className=" card border border-primary rounded">
                        <div className=" card-body">
                            <div className=" mb-3">
                                <div className=" h6">{comment.displayname}</div>
                                <div className=" text-muted">@{comment.username}</div>
                                <div className=" text-muted">{new Date(comment.created_at).toLocaleString()}</div>
                            </div>
                            <div className=" mb-3">
                                <div>{comment.content}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })






    if (account.username === null) return <Navigate to='/login' />
    return (
        <>
            <div className=" row mb-0">
                <div className=" col-xxl-6 m-auto">
                    <div className=" card shadow-sm p-3 border border-primary rounded">
                        <div className=" card-body">
                            <div className=" mb-3">
                                <div className=" h6">{post.by.displayname}</div>
                                <div className=" text-muted">@{post.by.username}</div>
                                <div className=" text-muted">{new Date(post.created_at).toLocaleString()}</div>
                            </div>
                            <div className=" mb-3">
                                <div>{post.content}</div>
                            </div>
                            <hr className=" py-0" />
                            <div className=" mb-3">{post.likes.length} thích - {post.comments.length} bình luận
                            </div>
                            <div className=" mb-3">
                                {post.tags.map((tag, index) => { return <span key={index} className="badge bg-primary me-1">#{tag}</span> })}
                            </div>
                            {
                                post.likes.includes(account.username) ? <button onClick={handleUnLike} className=" btn btn-primary me-1">Thích</button>
                                    : <button onClick={handleLike} className=" btn btn-outline-primary me-1">Thích</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className=" row mb-3">
                <div className=" col-xxl-6 m-auto">
                    <div className=" card shadow-sm p-3 border border-primary rounded">
                        <div className=" card-body">
                            {
                                errorComment.error && <div className=" mb-3">
                                    <div className=" alert alert-danger">{errorComment.message}</div>
                                </div>
                            }
                            <div className=" input-group">
                                <input onChange={(e) => setComment(e.target.value)} value={comment} type="text" className=" form-control" placeholder="Bình luận" />
                                <button onClick={handleComment} className=" btn btn-outline-primary">Gửi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {renderComments}
        </>
    )
}

export default PostPage