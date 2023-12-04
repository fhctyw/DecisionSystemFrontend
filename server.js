const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static('html'));
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
