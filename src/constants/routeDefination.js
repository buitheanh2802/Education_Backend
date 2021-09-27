export const path = {
    auth: {
        rootRoute: '/api/auth',
        signin: '/signin',
        signup: '/signup',
        active: '/active/:token',
        profile: '/profile/me',
        signout: '/signout',
        role: '/profile/me/role',
        facebook: '/facebook',
        facebookCallback : '/facebook/callback',
        google: '/google',
        googleCallback : '/google/callback',
        github: '/github',
        githubCallback : '/github/callback'
    },
    notification: {
        rootRoute: '/api/notification',
        gets: '/',
        post: '/:sendTo',
        put: '/:noficationId',
        delete: '/:noficationId',
        readall : '/readall'
    },
    post: {
        rootRoute: '/api/post',
        get: '/:postId',
        gets: '/',
        post: '/',
        put: '/:postId',
        delete: '/:postId'
    },
    follow: {
        rootRoute: '/api/follow',
        post: '/',
        delete: '/:followId'
    },
    tag : {
        rootRoute : '/api/tag',
        
    }
}