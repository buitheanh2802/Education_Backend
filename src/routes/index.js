import { path } from 'constants/routeDefination';
import courseRoute from './course.route';
import feedbackRoute from './feedback.route';
import commentRoute from './comment.route';
import notification from './notification.route';
import authRoute from './auth.route';
import postRoute from './post.route';
import followRoute from './follow.route';
import questionRoute from './question.route';

export const routes = (app) => {
    app.use('/api/course', courseRoute)
    app.use(path.auth.rootRoute, authRoute)
    app.use('/api/feedback', feedbackRoute)
    app.use('/api/comment', commentRoute)
    app.use(path.notification.rootRoute, notification)
    app.use(path.post.rootRoute, postRoute)
    app.use('/api/follow', followRoute)
    app.use(path.question.rootRoute, questionRoute)
}
