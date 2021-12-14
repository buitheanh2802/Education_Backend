import { searchMultiple,searchAuthor,
    searchPost,searchQuestion,searchTag } from 'controllers/search.controller';
import express from "express";
import { path } from "constants/routeDefination";

const router = express.Router();

// search multiple
router.get(
    path.search.searchMultiple, 
    searchMultiple
);
// search questions
router.get(
    path.search.searchQuestion,
    searchQuestion
);
// search author
router.get(
    path.search.searchAuthor,
    searchAuthor
);
// search posts
router.get(
    path.search.searchPost,
    searchPost
);
// search tag
router.get(
    path.search.searchTag,
    searchTag
)

export default router;