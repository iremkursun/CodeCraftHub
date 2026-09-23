const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("");
    console.log("==========================================");
    console.log(" CodeCraftHub API");
    console.log("==========================================");
    console.log(` Server: http://localhost:${PORT}`);
    console.log(` Swagger: http://localhost:${PORT}/api/docs`);
    console.log("==========================================");
    console.log("");
});
