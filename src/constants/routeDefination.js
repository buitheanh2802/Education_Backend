export const path = {
    auth: {
        rootRoute: '/api/auth',
        signin: '/signin',
        signup: '/signup',
        active: '/active/:token',
        profile: '/profile/me',
        signout : '/signout',
        role : '/profile/me/role'
    },
    notification : {
        rootRoute : '/api/notification',
        gets : '/',
        post : '/:sendTo',
        put : '/:noficationId',
        delete : '/:noficationId'
    }
}