<?php
define('SEC_PER_DAY', 24 * 60  * 60);
define('MSEC_PER_DAY', SEC_PER_DAY * 1000);

define('MA_POOLS_STATUS_FOUND_CANDIDATES', 1);
define('MA_POOLS_STATUS_NOT_STARTED', 2);
define('MA_POOLS_STATUS_IN_PROGRESS', 3);
define('MA_POOLS_STATUS_ANSWERED', 4);
define('MA_POOLS_STATUS_MODERATION', 5);
define('MA_POOLS_STATUS_MODERATED', 6);
define('MA_POOLS_STATUS_TO_MERGE', 7);
define('MA_POOLS_STATUS_MERGING', 8);
define('MA_POOLS_STATUS_ARCHIVED', 9);

define('NE_STATUS_NOT_STARTED', 0);
define('NE_STATUS_IN_PROGRESS', 1);
define('NE_STATUS_FINISHED', 2);
define('NE_STATUS_MODERATED', 3);

define('NE_ANNOT_TIMEOUT', 24 * 60 * 60);  // 24 hours
define('NE_ANNOTATORS_PER_TEXT', 4);
?>
