<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="wangkemiao" />
    <title>百度推广</title>
    <script type="text/javascript">
        performance.mark('performance_static_html_parse');
    </script>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-store, no-cache, must-revalidate, pre-check=0, post-check=0">
    <meta http-equiv="expires" content="0">
    <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
         Remove this if you use the .htaccess -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">

    <link rel="shortcut icon" type="image/ico" href="src/resource/img/favicon.ico" />
    <link rel="stylesheet" href="src/resource/css/common.less">
    <script type="text/javascript">
        performance.mark('performance_static_css_loaded');
    </script>
</head>

<body>
    <!--[if lt IE 9]>
    <script>
        window.location.href = 'unsupported.html';
    </script>
    <![endif]-->
    <script>
        (function(){
            var isIE = !!window.ActiveXObject;
            var userAgentMatch = navigator.userAgent.match(/\sMSIE\s+(\d+)/);
            if (isIE && userAgentMatch && userAgentMatch[1]) {
                var version = +userAgentMatch[1];
                if (version < 9) {
                    window.location.href = 'unsupported.html';
                }
            }
        })();
    </script>
    <div id="wrapper">
        <div class="uc-header-bar"></div>
        <div id="header"></div>
        <div id="main"></div>
        <div id="footer"></div>
        <div id="message-global-main">
            <img src="src/resource/img/loading.gif">
            正在读取数据，请稍候...
        </div>
    </div>

    <script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-6/esl.js"></script>
    <script>
        window.performance.mark('loading-global-start');
        require.config({
            'baseUrl': 'src',
            'paths': {
                'css': 'common/esl/css',
                'js': 'common/esl/js',
                'jstpl': 'common/esl/jstpl',
                'tpl': 'common/esl/tpl',
                'uc': 'http://u.baidu.com/ucnavi/asset'
            },
            'packages': [
                {
                    'name': 'material',
                    'location': 'module/material',
                    'main': 'main'
                }
            ],
            'config': { 'flags': { 'devtoggle': true } }
        });
        require(['main']);
    </script>
</body>
</html>