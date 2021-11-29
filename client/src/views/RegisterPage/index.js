import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Navigate } from "react-router-dom"
import axios from "axios"

const RegisterPage = () => {
    const account = useSelector(state => state.account)
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRepassword] = useState("")
    const [displayname, setDisplayname] = useState("")
    const [error, setError] = useState({ error: false, message: "" })

    const handRegister = async () => {
        if (!username || !password || !repassword || !displayname) {
            setError({ error: true, message: "Vui lòng điền đủ thông tin" })
        } else if (password !== repassword) {
            setError({ error: true, message: "xác nhận mật khẩu không khớp" })
        } else {
            setError({ error: false, message: "" })
            const result = await axios.post('/accounts/register', { displayname, username, password })
            if (result.data.success) {
                setError({ error: true, message: result.data.message })
                setTimeout(() => {
                    navigate("/login")
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
                    <div className=" card-header bg-primary text-white text-uppercase text-center">Tạo tài khoản</div>
                    <div className=" card-body">
                        {
                            error.error &&
                            <div className=" mb-3">
                                <div className=" alert alert-danger">{error.message}</div>
                            </div>
                        }
                        <div className=" mb-3">
                            <label htmlFor="displayname">Tên hiển thị</label>
                            <input onChange={e => setDisplayname(e.target.value)} value={displayname} id="displayname" className=" form-control" type="text" placeholder="Tên hiển thị" />
                        </div>
                        <div className=" mb-3">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input onChange={e => setUsername(e.target.value)} value={username} id="username" className=" form-control" type="text" placeholder="Tên đăng nhập" />
                        </div>
                        <div className=" mb-3">
                            <label htmlFor="password">Mật khẩu</label>
                            <input onChange={e => setPassword(e.target.value)} value={password} id="password" className=" form-control" type="password" placeholder="Mật khẩu" />
                        </div>
                        <div className=" mb-3">
                            <label htmlFor="repassword">Xác nhận mật khẩu</label>
                            <input onChange={e => setRepassword(e.target.value)} value={repassword} id="repassword" className=" form-control" type="password" placeholder="Xác nhận mật khẩu" />
                        </div>
                        <button onClick={handRegister} id="btn-register" className="btn btn-primary fw-bold text-uppercase">đăng ký</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage