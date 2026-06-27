import express from "express";
import { addShow, getAllshows, getNowPlayingMovies, getShow } from "../controllers/showControllers.js";
import { protectAdmin } from "../middlewares/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin,getNowPlayingMovies)
showRouter.post('/add',protectAdmin ,addShow)
showRouter.get('/all',getAllshows)
showRouter.get('/:movieId',getShow)


export default showRouter;