import dotenv from "dotenv";
import createApp from "./lib/app";

dotenv.config();

const port = process.env.PORT;
const app = createApp();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});