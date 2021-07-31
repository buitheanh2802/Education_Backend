import courseRoute from './course.route';
import lessionRoute from './lession.route';
import feedbackRoute from './feedback.route';
import commentRoute from './comment.route';

export const routes = (app) => {
    app.use('/course', courseRoute)
    app.use('/lession', lessionRoute)
    app.use('/feedback', feedbackRoute)
    app.use('/comment', commentRoute)
}