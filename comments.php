<?php
require('lib/header.php');
require('lib/lib_history.php');

$skip = isset($_GET['skip']) ? $_GET['skip'] : 0;

$smarty->assign('comments', get_latest_comments($skip));
$smarty->assign('skip', $skip);
$smarty->display('comments.tpl');
log_timing();
?>
