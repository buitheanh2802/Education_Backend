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
        githubCallback: '/github/callback',
        changePassword: '/profile/me/change-password',
        resetPassword: '/reset-password',
        changeInfo: '/profile/me/change-info'
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
        view: '/:questionId/view',
        bookmark: '/bookmark/:questionId',
        listbookmark: '/listbookmark',
        like: '/:questionId/like',
        deletelike: '/:questionId/deletelike',
        dislike: '/:questionId/dislike',
        deletedislike: '/:questionId/delete-dislike',
        follow: '/follow',
        spam: '/spam/:questionId'
    },
    tag: {
        rootRoute: '/api/tag',
        gets: '/',
        get: '/:tagname',
        create: '/',
        delete: '/:tagname',
        search: '/search',
        put: '/:tagname',
        popular: '/popular',
        post: '/:tagname/post',
        question: '/:tagname/question',
        follower: '/:tagname/follower'
    },
    comment: {
        rootRoute: '/api/comment',
        gets: '/:postOrQuestionId',
        post: '/',
        put: '/:commentId',
        delete: '/:commentId',
        like: '/:commentId/like',
        dislike: '/:commentId/dislike',
        spam: '/spam/:commentId'
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
        tag: '/:username/tag',
        featuredAuthor: '/featured-author'
    },
    challenges: {
        rootRoute: '/api/challenges',
        uploadImage: '/upload-image',
        uploadFileZip: '/upload-file',
        addSubmitedUser: '/submited-user/:challengeId',
        solutionSubmitedBy: '/solution-submited/:challengeId',
        gets: '/:cateId/challenge-categories',
        post: '/',
        get: '/:challengeId',
        put: '/:challengeId',
        delete: '/:challengeId',
    },
    challengeCategories: {
        rootRoute: '/api/challenge-categories',
        uploadImage: '/upload-image',
        gets: '/',
        post: '/',
        get: '/:challengeCategoriesId',
        put: '/:challengeCategoriesId',
        delete: '/:challengeCategoriesId',
    },
    solution: {
        rootRoute: '/api/solution',
        gets: '/',
        get: '/:solutionId',
        post: '/',
        put: '/:solutionId',
        delete: '/:solutionId',
        upVote: '/:solutionId/vote'
    },
    spam: {
        rootRoute: '/api/spam',
        questionOrCmt: '/question-or-comment',
        listQuestion: '/list-question',
        listCmt: '/list-comment',
        detailQuestion: '/detail-question/:spamId',
        detailCmt: '/detail-comment/:spamId',
    }
}