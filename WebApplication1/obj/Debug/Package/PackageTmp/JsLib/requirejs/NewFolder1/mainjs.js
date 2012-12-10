require.config({
    paths: {
        jquery: './jq1.72'
    }
});

require(['jquery'], function ($) {
    alert($().jquery);
});