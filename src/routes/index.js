import { path } from 'constants/routeDefination';
import commentRoute from './comment.route';
import notification from './notification.route';
import authRoute from './auth.route';
import postRoute from './post.route';
import followRoute from './follow.route';
import tagRoute from './tag.route';
import questionRoute from './question.route';
import pictureRoute from './picture.route';
import challengesRoute from "./challengesRoute.route";
import userRoute from './user.route';
import challengeCategoriesRoute from './challenge-categories.route';
import solutionRoute from './solution.route';
import spamRoute from './spam.route';

export const routes = (app) => {
    app.use(path.auth.rootRoute, authRoute);
    app.use(path.comment.rootRoute, commentRoute);
    app.use(path.notification.rootRoute, notification);
    app.use(path.post.rootRoute, postRoute);
    app.use(path.follow.rootRoute, followRoute);
    app.use(path.question.rootRoute, questionRoute);
    app.use(path.tag.rootRoute, tagRoute);
    app.use(path.picture.rootRoute, pictureRoute);
    app.use(path.user.rootRoute, userRoute);
    app.use(path.challenges.rootRoute, challengesRoute);
    app.use(path.challengeCategories.rootRoute, challengeCategoriesRoute);
    app.use(path.solution.rootRoute, solutionRoute);
    app.use(path.spam.rootRoute, spamRoute);
}
