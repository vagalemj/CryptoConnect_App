<?php
session_start();

if (!isset($_SESSION['user_id'])) 
{
    header("Location: index.php");
    exit();
}

// Redirect to http://localhost:5000/
header("Location: http://localhost:5000/");
exit();
?>
