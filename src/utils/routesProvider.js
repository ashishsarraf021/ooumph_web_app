const routes = {

    protected: [
        { path: '/home' },
        { path: '/profile' },

    ],

    unprotected: [
        { path: '/' },
    ],
    auth:[
        { path: '/login' },
        { path: "register" }
    ]
};


const isRouteProtected = (routePath) => {

    for (const protectedRoute of routes.protected) {
        if (protectedRoute.path === routePath) {
            return true;
        }
    }

    return false;

}

export{
    isRouteProtected
}

