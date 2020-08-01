const route = $.router;

route.path('/api', () => {
    route.path('auth', () => {

        route.get('@me');
        route.post('@login');
        route.post('@logout');

    }).controller('Auth')


    route.path('categories', () => {

        route.get('=all');
        route.post('=create');

    }).controller('Category');

    route.path('recipes', () => {

        route.get('=all');
        route.post('=add');

    }).controller('Recipe')

    route.path('recipe/:recipe', () => {

        route.get('=view');
        route.post('=edit');

    }).controller('Recipe')
});