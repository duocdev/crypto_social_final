import React, { useState } from "react"
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"


const SettingPage = () => {
    const account = useSelector(state => state.account)
    const dispatch = useDispatch()
    const [displayname, setDisplayName] = useState(account.displayname)
    const [bio, setBio] = useState(account.bio)
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error_save, setErrorSave] = useState({ error: false, message: "" })
    const [error_password, setErrorPassword] = useState({ error: false, message: "" })


    const handleSaveInfo = async () => {
        const result = await axios.post('/accounts/update-info', { username: account.username, displayname, bio })
        if (result.data.success) {
            setErrorSave({ error: true, message: result.data.message })
            dispatch({ type: "UPDATE_ACCOUNT", payload: result.data.account })
        } else {
            setErrorSave({ error: true, message: result.data.message })
        }
    }

    const handleUpdatePassword = async () => {
        if (!oldPassword || !password || !confirmPassword) {
            setErrorPassword({ error: true, message: "Vui lòng điền đủ thông tin" })
        } else if (password !== confirmPassword) {
            setErrorPassword({ error: true, message: "Xác nhận mật khẩu mới không khớp" })
        } else {
            const result = await axios.post('/accounts/update-password', { oldPassword, password, username: account.username })
            if (result.data.success) {
                setErrorPassword({ error: true, message: result.data.message })
            } else {
                setErrorPassword({ error: true, message: result.data.message })
            }
        }
    }



    if (account.username === null) return <Navigate to='/login' />
    return (
        <div className=" row">
            <div className=" col-xxl-4">
                <div className="card">
                    <div className=" card-header bg-white fw-bold text-uppercase text-primary">cập nhật mật khẩu</div>
                    <div className="card-body">
                        {
                            error_password.error && <div className=" mb-3">
                                <div className=" alert alert-danger">{error_password.message}</div>
                            </div>
                        }
                        <div className=" mb-3">
                            <label className=" fw-bold">Mật khẩu hiện tại</label>
                            <input onChange={e => setOldPassword(e.target.value)} value={oldPassword} type="password" className="form-control" placeholder="Mật khẩu hiện tại" />
                        </div>
                        <div className=" mb-3">
                            <label className=" fw-bold">Mật khẩu mới</label>
                            <input onChange={e => setPassword(e.target.value)} value={password} type="password" className="form-control" placeholder="Mật khẩu mới" />
                        </div>
                        <div className=" mb-3">
                            <label className=" fw-bold">Xác nhận mật khẩu</label>
                            <input onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className="form-control" placeholder="Xác nhận mật khẩu" />
                        </div>
                        <button onClick={handleUpdatePassword} className="btn btn-primary btn-block">Cập nhật</button>
                    </div>
                </div>
            </div>
            <div className=" col-xxl-8">
                <div className=" card">
                    <div className=" card-header bg-white fw-bold text-uppercase text-primary">cập nhật thông tin</div>
                    <div className=" card-body">
                        {
                            error_save.error && <div className=" mb-3">
                                <div className=" alert alert-danger">{error_save.message}</div>
                            </div>
                        }
                        <div className=" mb-3">
                            <label htmlFor="displayname" className=" form-control-label">Tên hiển thị</label>
                            <input onChange={e => setDisplayName(e.target.value)} value={displayname} type="text" className=" form-control" id="displayname" placeholder="Tên hiển thị" />
                        </div>
                        <div className=" mb-3">
                            <label htmlFor="bio" className=" form-control-label" >Tiểu sử</label>
                            <textarea onChange={e => setBio(e.target.value)} value={bio} className=" form-control" id="bio" placeholder="tiểu sử" rows="3" />
                        </div>
                        <button onClick={handleSaveInfo} className="btn btn-primary btn-block">Lưu</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SettingPage