/// <reference path="require.js" />
require.config({
    baseUrl: "./my",
    paths: {
        jquery: 'jq1.72'
    },
    shim:
    {
        'Person': { exports: 'person' }

    },
    map:
    {
    a:{}
    }
});
require(["shirt1"], function (a) {
    alert(a.a);
});
require(['jquery', "Person"], function ($, x) {
    alert($().jquery);
    alert(x.name);
});