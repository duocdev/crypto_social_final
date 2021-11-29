const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(5000, () => console.log('Server started on port 5000'));

app.use('/accounts/', require('./routers/accountsRouter'));
app.use('/posts/', require('./routers/postsRouter'));
app.use('/search/', require('./routers/searchRouter'));

app.get('/', (req, res) => {
    res.send('Hello World');
})

