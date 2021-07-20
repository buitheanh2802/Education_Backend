import courseRoute from './course.route';


export const routes = (app) => {
    app.use('/course',courseRoute)
}