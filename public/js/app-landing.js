requirejs.config({
    baseUrl: 'js',
    shim : {
        'bootstrap': {'deps' : ['jquery']}
    },
    paths: {
        jquery: 'jquery-2.1.4.min',
        bootstrap: 'bootstrap.min'
    }
});

requirejs(['jquery', 'bootstrap'], function($, bootstrap) {

});