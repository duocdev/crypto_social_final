const mongo = require('../db/mongo')


const accountsController = {
    /**
     * @api {post} /accounts/register Register
     */
    register: async (req, res) => {
        const { displayname, username, password } = req.body
        const account = { displayname, username, password, followers: [], following: [], bio: '' }
        const collection = await mongo.getCollection('accounts')
        const accountAlready = await collection.findOne({ username }, { projection: { _id: 0, username: 1 } })
        console.log(accountAlready)
        if (accountAlready) {
            res.json({ success: false, message: 'Tên đăng nhập đã có người khác dùng.' })
        } else {
            const result = await collection.insertOne(account)
            res.json({ success: true, message: 'Đăng ký thành công.' })
        }
    },
    /** 
     * @api {post} /accounts/login Login
    */
    login: async (req, res) => {
        const { username, password } = req.body
        const collection = await mongo.getCollection('accounts')
        const account = await collection.findOne({ username, password }, { projection: { _id: 0, username: 1, displayname: 1, followers: 1, following: 1, bio: 1 } })
        if (account) {
            res.json({ success: true, message: 'Đăng nhập thành công.', account })
        } else {
            res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' })
        }
    },
    /**
     * @api {post} /accounts/profile Profile
     */
    profile: async (req, res) => {
        const { username } = req.body
        const accounts = await mongo.getCollection('accounts')
        const account = await accounts.findOne({ username }, { projection: { _id: 0, username: 1, displayname: 1, followers: 1, following: 1, bio: 1 } })
        const posts = await mongo.getCollection('posts')
        const post = await posts.find({ 'by.username': username }).sort({ created_at: -1 }).toArray()
        if (account) {
            res.json({ success: true, message: 'Lấy thông tin thành công.', profile: account, posts: post })
        } else {
            res.json({ success: false, message: 'Tài khoản không tồn tại.' })
        }
    },
    /**
     * @api {post} /accounts/follow Follow
     */
    follow: async (req, res) => {
        const { username, follow } = req.body
        const accounts = await mongo.getCollection('accounts')
        const account = await accounts.findOne({ username })
        const accountFollow = await accounts.findOne({ username: follow })
        if (account && accountFollow) {
            const result = await accounts.updateOne({ username }, { $push: { following: follow } })
            const result2 = await accounts.updateOne({ username: follow }, { $push: { followers: username } })
            res.json({ success: true, message: 'Theo dõi thành công.', account: account, accountFollow: accountFollow })
        } else {
            res.json({ success: false, message: 'Tài khoản không tồn tại.' })
        }
    },
    /**
     * @api {post} /accounts/unfollow Unfollow
    */
    unfollow: async (req, res) => {
        const { username, follow } = req.body
        const accounts = await mongo.getCollection('accounts')
        const account = await accounts.findOne({ username })
        const accountFollow = await accounts.findOne({ username: follow })
        if (account && accountFollow) {
            const result = await accounts.updateOne({ username }, { $pull: { following: follow } })
            const result2 = await accounts.updateOne({ username: follow }, { $pull: { followers: username } })
            res.json({ success: true, message: 'Bỏ theo dõi thành công.', account: account, accountFollow: accountFollow })
        } else {
            res.json({ success: false, message: 'Tài khoản không tồn tại.' })
        }
    },
    /**
     * @api {post} /accounts/update Update
     */
    updateInfo: async (req, res) => {
        const { username, displayname, bio } = req.body
        const accounts = await mongo.getCollection('accounts')
        const account = await accounts.findOne({ username })
        if (account) {
            const result = await accounts.updateOne({ username }, { $set: { displayname, bio } })
            const accountCurr = await accounts.findOne({ username }, { projection: { _id: 0, username: 1, displayname: 1, followers: 1, following: 1, bio: 1 } })
            res.json({ success: true, message: 'Cập nhật thông tin thành công.', account: accountCurr })
        } else {
            res.json({ success: false, message: 'Tài khoản không tồn tại.' })
        }
    },
    /**
     * @api {post} /accounts/updatePassword UpdatePassword
     */
    updatePassword: async (req, res) => {
        const { username, password, oldPassword } = req.body
        const accounts = await mongo.getCollection('accounts')
        const account = await accounts.findOne({ username, password: oldPassword })
        if (account) {
            const result = await accounts.updateOne({ username }, { $set: { password } })
            const accountCurr = await accounts.findOne({ username, password }, { projection: { _id: 0, username: 1, displayname: 1, followers: 1, following: 1, bio: 1 } })
            res.json({ success: true, message: 'Cập nhật mật khẩu thành công.', account: accountCurr })
        } else {
            res.json({ success: false, message: 'Tài khoản không tồn tại.' })
        }
    },
}

module.exports = accountsController