const app = require('./app');

// In real app port would be passed through configuration.
app.listen(3001, () => {
    console.log('App started on port 3001');
});
