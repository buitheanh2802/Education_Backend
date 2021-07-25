import courseRoute from './course.route';
import lessionRoute from './lession.route';

export const routes = (app) => {
    app.use('/course', courseRoute)
    app.use('/lession', lessionRoute)
}