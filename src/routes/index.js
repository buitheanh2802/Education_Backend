import courseRoute from './course.route';
import lessionRoute from './lession.route';
import feedbackRoute from './feedback.route';
import commentRoute from './comment.route';
import notification from './notification.route';
import categoryExercise from './categoryExercise.route';
import authRoute from './auth.route';
import postRoute from './post.route';

export const routes = (app) => {
    app.use('/api/auth', authRoute)
    app.use('/api/course', courseRoute)
    app.use('/api/lession', lessionRoute)
    app.use('/api/feedback', feedbackRoute)
    app.use('/api/comment', commentRoute)
    app.use('/api/notification', notification)
    app.use('/api/categoryexercise', categoryExercise)
    app.use('/api/post', postRoute)
}
///123
