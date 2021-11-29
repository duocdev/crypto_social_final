const mongo = require('../db/mongo')
const ObjectId = require('mongodb').ObjectId

const postsController = {
    /**
     * @api {post} /posts/create Create a new post
     */
    create: async (req, res) => {
        const { username, displayname, content, tags } = req.body
        const post = { by: { username, displayname }, content, tags: tags[0] === '' ? ['default'] : tags, comments: [], likes: [], created_at: new Date() }
        const collection = await mongo.getCollection('posts')
        const result = await collection.insertOne(post)
        if (result.acknowledged) {
            res.json({ success: true, message: 'Đăng bài thành công' })
        } else {
            res.json({ success: false, message: 'Đã có lỗi xảy ra' })
        }
    },
    /**
     * @api {get} /posts/list Get all posts of following
     */
    list: async (req, res) => {
        const { username } = req.body
        if (username) {
            
            const accounts = await mongo.getCollection('accounts')
            const accountCur = await accounts.findOne({ username }, { projection: { _id: 0, following: 1 } })

            accountCur.following.push(username)
            

            const posts = await mongo.getCollection('posts')
            const rs = await posts.find({ 'by.username': { $in: accountCur.following } }).sort({ created_at: -1 }).toArray()
            
            if (rs) {
                res.json({ success: true, posts: rs })
            } else {
                res.json({ success: false, message: 'Không có bài viết nào' })
            }
        }
    },
    /**
     * @api {post} /posts/like Like a post
     */
    like: async (req, res) => {
        const { username, post_id } = req.body
        const posts = await mongo.getCollection('posts')
        const rs = await posts.findOneAndUpdate({ _id: ObjectId(post_id) }, { $addToSet: { likes: username } })
        if (rs.value) {
            res.json({ success: true, likes: rs.value.likes })
        } else {
            res.json({ success: false, message: 'Đã có lỗi xảy ra' })
        }
    },
    /**
     * @api {post} /posts/unlike Unlike a post
     */
    unlike: async (req, res) => {
        const { username, post_id } = req.body
        const posts = await mongo.getCollection('posts')
        const rs = await posts.findOneAndUpdate({ _id: ObjectId(post_id) }, { $pull: { likes: username } })
        if (rs.value) {
            res.json({ success: true, likes: rs.value.likes })
        } else {
            res.json({ success: false, message: 'Đã có lỗi xảy ra' })
        }
    },
    /**
     * @api {post} /posts/post Get a post
     */
    post: async (req, res) => {
        const { post_id } = req.body
        const posts = await mongo.getCollection('posts')
        const rs = await posts.findOne({ _id: ObjectId(post_id) })
        if (rs) {
            res.json({ success: true, post: rs })
        } else {
            res.json({ success: false, message: 'Không có bài viết nào' })
        }
    },
    /**
     * @api {post} /posts/comment Comment a post
     */
    comment: async (req, res) => {
        const { username, displayname, post_id, content } = req.body
        const Comment = { username, displayname, content, created_at: new Date() }
        const posts = await mongo.getCollection('posts')
        const rs = await posts.findOneAndUpdate({ _id: ObjectId(post_id) }, { $addToSet: { comments: Comment } })
        console.log(rs)
        if (rs.value) {
            res.json({ success: true, comments: rs.value.comments })
        } else {
            res.json({ success: false, message: 'Đã có lỗi xảy ra' })
        }
    },
}

module.exports = postsController