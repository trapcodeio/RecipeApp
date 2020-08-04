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

    }).controller('Category').middleware('Auth.logged');

    route.path('recipes', () => {

        route.get('=all');
        route.post('=add');

    }).controller('Recipe').middleware('Auth.logged')

    route.path('recipe/:recipe', () => {

        route.get('=view');
        route.post('=edit');

    }).controller('Recipe').middleware('Auth.logged')
});

/**
 * Api for mobile app
 */
route.path('/app', () => {

    route.get('@categories')
    route.get('@recipes');
    route.get('recipes/:recipe', 'recipe');

}).controller('Api');


route.all('/*', (http) => {
    return http.status(404).send({404: 'Not found'})
})