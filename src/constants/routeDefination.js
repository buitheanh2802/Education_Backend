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
        get: '/:shortId',
        newest: '/newest',
        following: '/following',
        trending: '/trending',
        post: '/',
        put: '/:shortId',
        delete: '/:shortId',
        like: '/:shortId/like',
        dislike: '/:shortId/dislike',
        bookmark: '/:shortId/bookmark',
        publishPost: '/publish/:shortId',
        unPublishPost: '/unpublish/:shortId',
        publishList: '/publish/list',
        edit: '/edit/:shortId',
        myBookmark: '/bookmark'
    },
    follow: {
        rootRoute: '/api/follow',
        post: '/:followId',
        delete: '/:followId'
    },
    question: {
        rootRoute: '/api/question',
        gets: '/',
        post: '/',
        get: '/:questionId',
        put: '/:questionId',
        delete: '/:questionId',
        bookmark: '/bookmark/:questionId',
        listbookmark: '/listbookmark',
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
    },
    comment: {
        rootRoute: '/api/comment',
        gets: '/:postOrQuestionId',
        post: '/',
        put: '/:commentId',
        delete: '/:commentId',
        like: '/:commentId/like',
        dislike: '/:commentId/dislike'
    },
    picture: {
        rootRoute: '/api/picture',
        post: '/',
        gets: '/',
        get: '/:pictureId',
        delete: '/:pictureId'
    },
    user: {
        rootRoute: '/api/user',
        get: '/:username',
        post: '/:username/post',
        question: '/:username/question',
        following: '/:username/following',
        followers: '/:username/follower',
        postBookmark: '/:username/bookmark/post',
        questionBookmark: '/:username/bookmark/question',
        tag: '/:username/tag'
    },
    exerciseLayout: {
        rootRoute: '/api/exercise-layout',
        gets: '/',
        post: '/',
        get: '/:layoutId',
        put: '/:layoutId',
        delete: '/:layoutId',
        rate: '/rate/:layoutId'
    },
    challengeCategories: {
        rootRoute: '/api/challenge-categories',
        gets: '/',
        post: '/',
        get: '/:challengeCategoriesId',
        put: '/:challengeCategoriesId',
        delete: '/:challengeCategoriesId'
    },
}