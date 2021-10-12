import { path } from 'constants/routeDefination';
import commentRoute from './comment.route';
import notification from './notification.route';
import authRoute from './auth.route';
import postRoute from './post.route';
import followRoute from './follow.route';
import tagRoute from './tag.route';
import questionRoute from './question.route';
import pictureRoute from './picture.route';

export const routes = (app) => {
    app.use(path.auth.rootRoute, authRoute)
    app.use(path.comment.rootRoute, commentRoute)
    app.use(path.notification.rootRoute, notification)
    app.use(path.post.rootRoute, postRoute)
    app.use(path.follow.rootRoute, followRoute)
    app.use(path.question.rootRoute, questionRoute)
    app.use(path.tag.rootRoute, tagRoute)
    app.use(path.picture.rootRoute, pictureRoute)
}
