<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv='content' content='text/html;charset=utf-8'/>
        <title>OpenCorpora: открытый корпус русского языка</title>

        <meta property="og:image" content="http://opencorpora.org/img/fb-pic.png"/>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://opencorpora.org" />
        <meta property="og:title" content="OpenCorpora: открытый корпус русского языка" />

        <link rel="shortcut icon" href="{$web_prefix}/favicon.ico" />

        <!-- Bootstrap -->
        <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">

        <link rel='stylesheet' type='text/css' href='{$web_prefix}/css/main.css?4'/>
        <link rel='stylesheet' type='text/css' href='http://yandex.st/jquery-ui/1.8.16/themes/smoothness/jquery.ui.all.min.css'/>

        {block name=styles}{/block}

        <script src="{$web_prefix}/js/jquery-1.8.1.min.js"></script>
        <script type="text/javascript" src="http://yandex.st/jquery-ui/1.8.16/jquery-ui.min.js"></script>
        <script src='{$web_prefix}/js/main.js?3' type='text/javascript'></script>
        <script src='{$web_prefix}/js/jquery.mousewheel.js' type='text/javascript'></script>
        <script src='{$web_prefix}/js/jquery.autocomplete.js'></script>
        <script src="bootstrap/js/bootstrap.min.js"></script>


    </head>
{block name=body}<body>{/block}
<div id='wrap'>
{nocache}{include file='header.tpl'}
{block name=before_content}{/block}{/nocache}
{if $readonly == 1}
<div class='alert alert-error'><div class="container">Система находится в режиме &laquo;только для чтения&raquo;. Функции разметки и редактирования временно не работают.</div></div>
{/if}
<div id="container" class="container">
{if $game_is_on == 1}{include file='qa/user_splash.tpl'}{/if}
<div id="alert_wrap">{if $alerts}{foreach $alerts as $type=>$message}<div class="alert alert-{$type}">{$message}</div>{/foreach}<script>setTimeout('$("#alert_wrap .alert").fadeOut()',3000);</script>{/if}
</div>
{block name=content}{/block}
</div>
{include file='footer.tpl'}
</div>
<script type="text/javascript">
var reformalOptions = {
    project_id: 93183,
    project_host: "opencorpora.reformal.ru",
    tab_orientation: "right",
    tab_indent: "30%",
    tab_bg_color: "#2852a6",
    tab_border_color: "#FFFFFF",
    tab_image_url: "http://tab.reformal.ru/T9GC0LfRi9Cy0Ysg0Lgg0L%252FRgNC10LTQu9C%252B0LbQtdC90LjRjw==/FFFFFF/2a94cfe6511106e7a48d0af3904e3090/left/1/tab.png",
    tab_border_width: 2
};

(function() {
    var script = document.createElement('script');
    script.type = 'text/javascript'; script.async = true;
    script.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'media.reformal.ru/widgets/v3/reformal.js';
    document.getElementsByTagName('head')[0].appendChild(script);
})();
</script><noscript><a href="http://reformal.ru"><img src="http://media.reformal.ru/reformal.png" /></a><a href="http://opencorpora.reformal.ru">Oтзывы и предложения для opencorpora</a></noscript>
{block name=javascripts}{/block}
</body>
</html>
