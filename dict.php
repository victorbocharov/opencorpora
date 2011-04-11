<?php
require('lib/header.php');
require('lib/lib_dict.php');
if (isset($_GET['act']))
    $action = $_GET['act'];
else $action = '';
switch($action) {
    case 'add_gram':
        if (is_admin()) {
            $name = mysql_real_escape_string($_POST['g_name']);
            $group = (int)$_POST['parent_gram'];
            $outer_id = mysql_real_escape_string($_POST['outer_id']);
            $descr = mysql_real_escape_string($_POST['descr']);
            add_grammem($name, $group, $outer_id, $descr);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'move_gram':
        if (is_admin()) {
            $grm = (int)$_GET['id'];
            $dir = $_GET['dir'];
            move_grammem($grm, $dir);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'del_gram':
        if (is_admin()) {
            $grm = (int)$_GET['id'];
            del_grammem($grm);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'edit_gram':
        if (is_admin()) {
            $id = (int)$_POST['id'];
            $inner_id = mysql_real_escape_string($_POST['inner_id']);
            $outer_id = mysql_real_escape_string($_POST['outer_id']);
            $descr = mysql_real_escape_string($_POST['descr']);
            edit_grammem($id, $inner_id, $outer_id, $descr);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'clear_errata':
        if (is_admin()) {
            clear_dict_errata(isset($_GET['old']));
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'not_error':
        if (is_admin()) {
            mark_dict_error_ok((int)$_GET['error_id'], $_POST['comm']);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'add_restr':
        if (is_admin()) {
            add_dict_restriction($_POST);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'del_restr':
        if (is_admin()) {
            del_dict_restriction((int)$_GET['id']);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'update_restr':
        if (is_admin()) {
            calculate_gram_restrictions();
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'save':
        if (is_admin()) {
            dict_save($_POST);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'add_link':
        if (is_admin()) {
            if (add_link((int)$_POST['from_id'], (int)$_POST['lemma_id'], (int)$_POST['link_type'])) {
                header("Location:dict.php?act=edit&id=".(int)$_POST['from_id']);
            } else
                show_error();
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'del_link':
        if (is_admin()) {
            if (del_link((int)$_GET['id'])) {
                header("Location:dict.php?act=edit&id=".(int)$_GET['lemma_id']);
            } else
                show_error();
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'del_lemma':
        if (is_admin()) {
            del_lemma((int)$_GET['lemma_id']);
        } else
            show_error($config['msg_notadmin']);
        break;
    case 'lemmata':
        $smarty->assign('search', get_dict_search_results($_POST));
        $smarty->display('dict/lemmata.tpl');
        break;
    case 'gram':
        if (isset($_GET['order']))
            $order = $_GET['order'];
        else
            $order = '';
        $smarty->assign('grammems', get_grammem_editor($order));
        $smarty->assign('select', dict_get_select_gram());
        $smarty->display('dict/gram.tpl');
        break;
    case 'gram_restr':
        $smarty->assign('restrictions', get_gram_restrictions(isset($_GET['hide_auto'])));
        $smarty->display('dict/restrictions.tpl');
        break;
    case 'edit':
        $lid = (int)$_GET['id'];
        $smarty->assign('editor', get_lemma_editor($lid));
        $smarty->assign('link_types', get_link_types());
        $smarty->display('dict/lemma_edit.tpl');
        break;
    case 'errata':
        $smarty->assign('errata', get_dict_errata(isset($_GET['all']), isset($_GET['rand'])));
        $smarty->display('dict/errata.tpl');
        break;
    default:
        $smarty->assign('stats', get_dict_stats());
        $smarty->display('dict/main.tpl');
}
?>
