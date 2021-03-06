// from syntax_groups.js
function check_adjacency($token) {
   var $p = $token.prev();
   if ($p.length && $p.hasClass('ner-token-selected'))
      return true;
   $p = $token.next();
   if ($p.length && $p.hasClass('ner-token-selected'))
      return true;
   return false;
}

function is_uttermost($target) {
   var selected = $target.parent().find('.ner-token-selected');
   var i = selected.index($target);
   return (i == 0 || i == (selected.length-1));
}

function click_handler($target) {
   if (!$target.hasClass('ner-token-selected')) {
     if (!check_adjacency($target)) {
         $target.parent().find('.ner-token-selected').removeClass('ner-token-selected');
     }
     $target.addClass('ner-token-selected');
   }
   else {
     if (is_uttermost($target)) $target.removeClass('ner-token-selected');
   }
}

// end from syntax_groups.js

var miscTypeId = 6;
var colorStep = 2;

var clearHighlight = function() {
    $(document).find('.ner-token-selected').removeClass('ner-token-selected');
};

var clearSelectedTypes = function() {
    $('.type-selector').find('.btn').removeClass('active');
};

var hideTypeSelector = function() {
   $('.floating-block').fadeOut(100, deactivateHotKeys);
};

var showTypeSelector = function(x, y) {
   var l = x - $('.floating-block').width() / 2;
   var t = y - $('.floating-block').height() - 10;
   if (l < 0) l = 3;
   $('.floating-block').css('left', l)
                       .css('top', t);

   $('.floating-block').fadeIn(100, activateHotKeys);
};

var activateHotKeys = function() {
   $('.type-selector > .btn').each(function(i, btn) {
      var btn = $(btn);
      Mousetrap.bind([btn.attr('data-hotkey') + ' ' + btn.attr('data-hotkey'),
                      'alt+' + btn.attr('data-hotkey')], function() {

         $('body').append(d = $("<div>").addClass("kbd-visual").text(btn.text()));
         d.fadeIn(100).delay(1000).fadeOut(100, function() { d.remove(); });
         btn.click();
      });
   });
};

var deactivateHotKeys = function() {
   $('.type-selector > .btn').each(function(i, btn) {
      var btn = $(btn);
      Mousetrap.unbind(btn.attr('data-hotkey') + ' ' + btn.attr('data-hotkey'));
      Mousetrap.unbind('alt+' + btn.attr('data-hotkey'));
   });
};

var log_event = function(type, message, id, extra_data_as_string) {
    $.post('/ajax/ner.php', {
        act: 'logEvent',
        type: type,
        id: id,
        event: message,
        data: extra_data_as_string
    });
}

var paragraph__textSelectionHandler = function(e) {
    clearHighlight();
    clearSelectedTypes();

    var sel = rangy.getSelection();
    var range = sel.getRangeAt(0);
    if (range.collapsed) {
        log_event("selection", "text selection in paragraph removed", $(e.target).parents('.ner-paragraph').attr('data-par-id'));
        hideTypeSelector();
        return;
    }

    var nodes = range.getNodes();
    var spans = (nodes.length == 1) ? $(nodes[0].parentElement) : $(nodes).filter('span');
    if (!spans.hasClass('ner-entity')) {
        spans.addClass('ner-token-selected');
        var offset = spans.last().offset();
        var X = offset.left + $(spans.last()).width() / 2;
        var Y = offset.top;
        showTypeSelector(X, Y);
        log_event("selection", "text selection in paragraph", $(e.target).parents('.ner-paragraph').attr('data-par-id'), spans.text());
    }
    sel.removeAllRanges();
};

var token__clickHandler = function(e) {
    var in_other = $('.ner-paragraph').not($(this).parent()).find('.ner-token-selected');
    if (in_other.length > 0) {
        log_event("selection", "removed selection by clicking in another paragraph", $(e.target).parents('.ner-paragraph').attr('data-par-id'));
        in_other.removeClass('ner-token-selected');
        clearSelectedTypes();
    }

    click_handler($(this));

    if ($('.ner-token-selected').length == 0) {
        log_event("selection", "removed selection", $(e.target).parents('.ner-paragraph').attr('data-par-id'));
        hideTypeSelector();
        clearSelectedTypes();
    } else {
        log_event("selection", "selection updated by clicking", $(e.target).parents('.ner-paragraph').attr('data-par-id'),
            $('.ner-token-selected').text());
        var offset = $(e.target).offset();
        var X = offset.left + $(e.target).width() / 2;
        var Y = offset.top;
        showTypeSelector(X, Y);
    }
};

$(document).ready(function() {
    $.fn.mapGetter = function(prop) {
        return $(this).map(function(i, e) {
            return $(e).attr(prop);
        }).get();
    };

    $.fn.filterByAttr = function(attr, val) {
        return $(this).filter(function(i, e) {
            return $(e).attr(attr) == val;
        });
    };

    var originalAddClassMethod = $.fn.addClass;
    var originalRemoveClassMethod = $.fn.removeClass;

    $.fn.addClass = function() {
        var result = originalAddClassMethod.apply(this, arguments);
        $(this).trigger('cssClassAdded', arguments);
        return result;
    }

    $.fn.removeClass = function() {
        var result = originalRemoveClassMethod.apply(this, arguments);
        $(this).trigger('cssClassRemoved', arguments);
        return result;
    }

    // $(el).syncByClass(other-el)
    // when el gets new classes, other-el gets them too
    $.fn.syncByClass = function(that) {
        $(this).on('cssClassAdded', function(e, className) {
            if ($(e.target).is(this)) $(that).addClass(className);

        });
        $(this).on('cssClassRemoved', function(e, className) {
            if ($(e.target).is(this)) $(that).removeClass(className);
        });
    };

    $.fn.removeClassRegex = function(regex) {
      return $(this).removeClass(function(index, classes) {
        return classes.split(/\s+/).filter(function(c) {
          return regex.test(c);
        }).join(' ');
      });
    };

    $.fn.selectpicker.defaults = {
      noneSelectedText: '',
      noneResultsText: 'Не найдено совпадений',
      countSelectedText: 'Выбрано {0} из {1}',
      maxOptionsText: ['Достигнут предел ({n} {var} максимум)', 'Достигнут предел в группе ({n} {var} максимум)', ['items', 'item']],
      multipleSeparator: ', '
    };

});

$(document).ready(function() {

    $('.selectpicker').selectpicker();

    $('.ner-row').each(function() {
        $(this).find('.ner-paragraph-wrap').syncByClass($(this).find('.ner-table-wrap'));
    });

   $('.ner-paragraph-wrap').not('.ner-mine').not('.ner-disabled').click(function(e) {

      var parwrap = $(this);
      var par = parwrap.find('.ner-paragraph');

      $.post('/ajax/ner.php', {
         act: 'newAnnotation',
         paragraph: par.attr('data-par-id')
      }, function(response) {
         parwrap.addClass('ner-mine').attr('data-annotation-id', response.id);
      });

   });

    $('button.ner-btn-finish').click(function(e) {
        var btn = $(this);
        e.preventDefault();
      e.stopPropagation();

      if ($('.floating-block').is(':visible')) {
         notify("У вас есть несохраненная сущность.", 'error');
         return false;
      }

        $.post('/ajax/ner.php', {
            act: 'finishAnnotation',
            paragraph: btn.parents('.ner-paragraph-wrap').attr('data-annotation-id')
        }, function(response) {
            btn.parents('.ner-paragraph-wrap').removeClass('ner-mine').addClass('ner-disabled');
            btn.parents('.ner-row').find('td.ner-entity-type').each(function(index, td) {
                var td = $(td);
                // this is bad
                td.html(td.find('.bootstrap-select').find('.filter-option').html().replace(',', ''));
            });
        });

    });

   $('button.ner-btn-finish-all').click(function(e) {

      if ($('.floating-block').is(':visible')) {
         notify("У вас есть несохраненная сущность.", 'error');
         return false;
      }

      $('.ner-paragraph-wrap.ner-mine').each(function() {
         var parwrap = $(this);

         // this block of code suddenly throws errors when put inside $.post callback
         // so we clean up everything here and send the request afterwards
         parwrap.removeClass('ner-mine').addClass('ner-disabled');
         parwrap.parents('.ner-row').find('td.ner-entity-type').each(function(index, td) {
            var td = $(td);
            // this is bad
            td.html(td.find('.bootstrap-select').find('.filter-option').html().replace(',', ''));
         });

         $.post('/ajax/ner.php', {
            act: 'finishAnnotation',
            paragraph: parwrap.attr('data-annotation-id')
         });

      });

   });


    if ($('.ner-mode-fast').hasClass('active'))
        $(document).on('mouseup', '.ner-paragraph-wrap:not(.ner-disabled) > .ner-paragraph', paragraph__textSelectionHandler);
    else
        $(document).on('click', '.ner-paragraph-wrap:not(.ner-disabled) .ner-token:not(.ner-entity)', token__clickHandler)


   $('.ner-mode-basic').click(function() {
      $(document).on('click', '.ner-paragraph-wrap:not(.ner-disabled) .ner-token:not(.ner-entity)', token__clickHandler);
      $(document).off('mouseup', '.ner-paragraph-wrap:not(.ner-disabled) > .ner-paragraph');
      $.post('/ajax/set_option.php', {option: 5, value: 0});
   });

   $('.ner-mode-fast').click(function() {
      $(document).on('mouseup', '.ner-paragraph-wrap:not(.ner-disabled) > .ner-paragraph', paragraph__textSelectionHandler);
      $(document).off('click', '.ner-paragraph-wrap:not(.ner-disabled) .ner-token:not(.ner-entity)');
      $.post('/ajax/set_option.php', {option: 5, value: 1});
   });

    $('.ner-table-wrap').on('change', '.selectpicker', function(e) {
        if ($(this).val() == null) {
            $(this).selectpicker('val', miscTypeId);
        }

        var entityId = $(this).parents('tr').attr('data-entity-id');

        if ($(this).val().length > 1) {
            $('.ner-entity').filterByAttr('data-entity-id', entityId)
                .removeClassRegex(/border-bottom-palette-\d/)
                .addClass('ner-multiple-types');
        }
        else {
            $('.ner-entity').filterByAttr('data-entity-id', entityId)
                .removeClass('ner-multiple-types')
            .removeClassRegex(/border-bottom-palette-\d/)
                .addClass('border-bottom-palette-' + $(this).val()[0] * colorStep);
        }

        log_event("entity", "updated types", entityId, $(this).val().toString());
        $.post('/ajax/ner.php', {
            act: 'setTypes',
            entity: entityId,
            types: $(this).val()
        }, function(response) {
            notify("Типы сущности сохранены.");
        });
    });

    $('.ner-table-wrap').on('click', '.ner-remove', function(e) {
        if (window.confirm("Вы действительно хотите удалить эту сущность?")) {
            var tr = $(this).parents('tr');
            var entityId = tr.attr('data-entity-id');
            log_event("entity", "deleting entity", entityId, tr.find('td.ner-entity-text').text().trim());

            $.post('/ajax/ner.php', {
                    act: 'deleteEntity',
                    entity: entityId
                },
                function(response) {
                    notify("Сущность удалена.");
                    $('.ner-entity').filterByAttr('data-entity-id', entityId)
                        .removeAttr('data-entity-id')
                        .removeClass('ner-entity ner-multiple-types border-bottom-palette-*');
                    tr.remove();
            });
        }
    });

    $('.type-selector > .btn').click(function() {
        var selected = $('.ner-token-selected');
        var paragraph = selected.parents('.ner-paragraph');
        var typesIds = ($(this).hasClass('composite-type') ?
            $(this).attr('data-type-ids').split(',') : [$(this).attr('data-type-id')]);
        var selectedIds = selected.mapGetter('data-tid');

        $.post('/ajax/ner.php', {
            act: 'newEntity',
            tokens: selectedIds,
            types: typesIds,
            paragraph: paragraph.parents('.ner-paragraph-wrap').attr('data-annotation-id')
        }, function(response) {
            var t = $('table').filterByAttr('data-par-id', paragraph.attr('data-par-id'));

            selected.addClass('ner-entity').attr('data-entity-id', response.id);

            if (typesIds.length == 1) {
                selected.addClass('border-bottom-palette-' + typesIds[0] * colorStep);
            } else {
                selected.addClass('ner-multiple-types');
            }

            var tr = $('.templates').find('.tr-template').clone().removeClass('tr-template');
            tr.add(tr.find('.remove-entity')).add(tr.find('.selectpicker-tpl')).attr('data-entity-id', response.id);
            tr.find('.selectpicker-tpl').find('option').each(function(i, o) {
                if (typesIds.indexOf($(o).text()) != -1) $(o).attr('selected', true);
            });

            tr.find('.selectpicker-tpl').removeClass('selectpicker-tpl').addClass('selectpicker').selectpicker();
            tr.find('td.ner-entity-text').text(selected.text());
            t.append(tr);

            clearHighlight();
            clearSelectedTypes();
            hideTypeSelector();
        });

    });


}); // document.ready
