import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'


const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({ error: false, message: '' })
    const account = useSelector(state => state.account)

    const handleLogin = async () => {
        if (!username || !password) {
            setError({ error: true, message: 'Vui lòng điền đủ thông tin' })
        } else {
            setError({ error: false, message: '' })
            const result = await axios.post('/accounts/login', { username, password })
            if (result.data.success) {
                setError({ error: true, message: result.data.message })

                dispatch({ type: 'SET_ACCOUNT', payload: result.data.account })
                setTimeout(() => {
                    navigate("/")
                }, 1000);
            } else {
                setError({ error: true, message: result.data.message })
            }
        }
    }


    if (account.username !== null) return <Navigate to='/' />
    return (
        <div className=" row mt-5">
            <div className=" col-3 m-auto">
                <div className=" card">
                    <div className=" card-header bg-primary fw-bold text-white text-uppercase text-center">đăng nhập</div>
                    <div className=" card-body">
                        {
                            error.error &&
                            <div className=" mb-3">
                                <div className=" alert alert-danger">{error.message}</div>
                            </div>
                        }
                        <div className=" mb-3">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input onChange={(e) => setUsername(e.target.value)} value={username} id="username" className=" form-control" type="text" placeholder="Tên đăng nhập" />
                        </div>
                        <div className=" mb-3">
                            <label htmlFor="password">Mật khẩu</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} id="password" className=" form-control" type="password" placeholder="Mật khẩu" />
                        </div>
                        <button onClick={handleLogin} id="btn-login" className="btn btn-primary fw-bold text-uppercase">đăng nhập</button>
                        <button onClick={() => navigate('/register')} id="btn-register" className="btn btn-outline-secondary fw-bold text-uppercase ms-1">đăng kí</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage