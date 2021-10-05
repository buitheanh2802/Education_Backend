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
        facebookCallback: '/facebook/callback',
        google: '/google',
        googleCallback: '/google/callback',
        github: '/github',
        githubCallback: '/github/callback'
    },
    notification: {
        rootRoute: '/api/notification',
        gets: '/',
        post: '/:sendTo',
        put: '/:noficationId',
        delete: '/:noficationId',
        readall: '/readall'
    },
    post: {
        rootRoute: '/api/post',
        get: '/:postId',
        newest: '/newest',
        following: '/following',
        trending: '/trending',
        post: '/',
        put: '/:postId',
        delete: '/:postId'
    },
    follow: {
        rootRoute: '/api/follow',
        post: '/',
        delete: '/:followId'
    },
    question: {
        rootRoute: '/api/question',
        gets: '/',
        post: '/',
        get: '/:questionId',
        put: '/:questionId',
        delete: '/:questionId',
        like: '/:questionId/like',
        deletelike: '/:questionId/deletelike',
        dislike: '/:questionId/dislike',
        deletedislike: '/:questionId/delete-dislike',
    },
    tag: {
        rootRoute: '/api/tag',
        gets: '/',
        get: '/:tagname',
        post: '/',
        delete: '/:tagname',
        search: '/search',
        put: '/:tagname'
    }
}