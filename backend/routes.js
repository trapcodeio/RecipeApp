const route = $.router;

route.path('/api', () => {
    route.path('auth', () => {

        route.get('@me');
        route.post('@login');
        route.post('@logout');

    }).controller('Auth')
});