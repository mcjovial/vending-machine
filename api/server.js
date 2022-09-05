const app = require("./_helpers/express");
const { connectDB } = require("./_helpers/db");
const { port } = require("./_helpers/config");

// connect mongoose
connectDB()

// start server
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
