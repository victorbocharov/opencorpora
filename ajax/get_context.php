<?php
require_once('../lib/header.php');
require_once('../lib/lib_annot.php');
header('Content-type: text/xml; charset=utf-8');
$tf_id = (int)$_GET['tf_id'];
$dir = isset($_GET['dir']) ? (int)$_GET['dir'] : 0;
echo '<?xml version="1.0" encoding="utf-8" standalone="yes"?><context>';
if ($tf_id && $dir) {
    $wds = get_context_for_word($tf_id, -1, $dir, 0);
    foreach ($wds['context'] as $word) {
        echo "<w>".htmlspecialchars($word)."</w>";
    }
}
echo '</context>';
?>
