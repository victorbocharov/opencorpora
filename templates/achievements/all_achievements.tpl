{* Smarty *}
{extends file='common.tpl'}
{block name='content'}
<h1>Все награды</h1>
<div class="lead">
    На этой странице собраны все ачивки, которые мы вам пока не дадим.
</div>
<div class="tabbable achievements-tabbable tabs-left">
    <ul class="nav nav-tabs">
        {foreach $manager->objects as $a}
            <li {if $a@iteration==1}class="active"{/if}>
                <a href="#{$a->css_class}" data-toggle="tab">{$a->short_title}</a>
            </li>
        {/foreach}
    </ul>
    <div class="tab-content">
        {foreach $manager->objects as $a}
            <div class="tab-pane {if $a@iteration==1}active{/if}" id="{$a->css_class}">
                <div class="row achievement-stats">
                    <div class="span3">
                        <div class="achievement-wrap achievement-medium achievement-{$a->css_class}"></div>
                        <h3 class="a-title">{$a->short_title}
                            </h3>
                        <p class="a-desc">
                            {$a->how_to_get}
                        </p>
                        <p class="a-desc">
                            {if !isset($a->level)}
                                <span class="badge">Без уровней</span>
                            {/if}
                        </p>
                    </div>
                    <div class="span5">
                        {if !$stats[$a->css_class]}
                            <p class="lead-medium">
                                Этой ачивки пока ни у кого нет. Будьте первыми!
                            </p>

                        {else}
                            {if !isset($a->level)}
                                <p class="lead-medium">
                                    {include file="achievements/counter.tpl" stats=$stats[$a->css_class]}
                                </p>
                            {else}
                                <p class="lead-medium">
                                    В первой колонке указан уровень, во второй &mdash; {$a->column_description}.
                                </p>
                                <table class="a-stats">
                                    <tbody>
                                    {$grades = $a->grades()}
                                    {foreach range(1, 20) as $level}

                                        {$percent =
                                            ceil((count($stats[$a->css_class][$level]) * 100) /
                                            $stats['total_users'])}
                                        <tr>
                                            <td class="t-level">{$level}</td>
                                            <td class="t-count">{$grades[$level - 1]}</td>
                                            <td class="t-bar">
                                                <div class="a-bar-wrap">
                                                    <div class="a-bar height-5" data-level="{$level}"
                                                    style="width: {$percent}%">
                                                    </div>
                                                </div>
                                            </td>
                                            {if !count($stats[$a->css_class][$level])}
                                                <td class="t-text empty-text"></td>
                                            {else}
                                                <td class="t-text" data-placement="right"
                                                title='{include file="achievements/counter.tpl" stats=$stats[$a->css_class][$level] among_them=true}'>
                                                    ({$percent}%) {count($stats[$a->css_class][$level])}
                                                </td>
                                            {/if}
                                        </tr>
                                    {/foreach}
                                    </tbody>
                                </table>
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
        {/foreach}
    </div>
</div>


<script>{literal}
    $('.t-text:not(.empty-text)').tooltip({
        trigger: 'manual',
        template: '<div class="tooltip achievement-tooltip tooltip-white tooltip-wider"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        container: '.tab-content'
    }).on('mouseenter', function() {
        $('.t-text').not('.empty-text').not($(this)).tooltip('hide');
        $(this).tooltip('show');
    });

    $('[data-toggle=tab]').on('show', function() {
        $('.t-text').tooltip('hide');
    });

</script>{/literal}
{/block}
