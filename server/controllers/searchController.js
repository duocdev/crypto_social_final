const mongo = require('../db/mongo')

const searchController = {
    search: async (req, res) => {
        const { keyword } = req.body
        const collection = await mongo.getCollection('accounts')
        const accounts = await collection.find({ $text: { $search: keyword} }, { projection: { _id: 0, username: 1, displayname: 1 } }).toArray()
        const posts = await mongo.getCollection('posts')
        const posts_tag = await posts.find({ tags: { $in: [keyword] } }).toArray()
        const post_content = await posts.find({ $text: { $search: keyword } }).toArray()
        res.json({ success: true, accounts, post_content, posts_tag })
    }
}

module.exports = searchController