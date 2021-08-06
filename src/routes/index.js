import courseRoute from './course.route';
import lessionRoute from './lession.route';
import feedbackRoute from './feedback.route';
import commentRoute from './comment.route';
import notification from './notification.route';

export const routes = (app) => {
    app.use('/api/course', courseRoute)
    app.use('/api/lession', lessionRoute)
    app.use('/api/feedback', feedbackRoute)
    app.use('/api/comment', commentRoute)
    app.use('/api/notification', notification)
}