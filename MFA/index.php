<?php
session_start();
include 'conn.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer/src/Exception.php';
require './PHPMailer/src/PHPMailer.php';
require './PHPMailer/src/SMTP.php';

if (isset($_SESSION['user_id'])) 
{
    header("Location: dashboard.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) 
{
    $email = $_POST['email'];
    $password = $_POST['password'];
    $_SESSION['email'] = $email;

    $sql = "SELECT * FROM users WHERE email='$email'";
    $query = mysqli_query($conn, $sql);
    $data = mysqli_fetch_array($query);

    if ($data && password_verify($password, $data['password'])) 
    {
        $otp = rand(100000, 999999);
        $otp_expiry = date("Y-m-d H:i:s", strtotime("+3 minute"));
        $subject = "Your OTP for Login";
        $message = "Your OTP is: $otp";

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'mj.vagale@gmail.com';
        $mail->Password = 'djvqgeefelktwwvh';
        $mail->Port = 465;
        $mail->SMTPSecure = 'ssl';
        $mail->isHTML(true);
        $mail->setFrom('mj.vagale@gmail.com', 'Administrator-No_Reply');
        $mail->addAddress($email, $name);
        $mail->Subject = ("$subject");
        $mail->Body = $message;
        $mail->send();

        $sql1 = "UPDATE users SET otp='$otp', otp_expiry='$otp_expiry' WHERE id=" . $data['id'];
        $query1 = mysqli_query($conn, $sql1);

        $_SESSION['temp_user'] = ['id' => $data['id'], 'otp' => $otp];
        header("Location: otp_verification.php");
        exit();
    } 
    else 
    {
?>
        <script>
            alert("Invalid Email or Password. Please try again.");

            function navigateToPage() 
            {
                window.location.href = 'index.php';
            }
            window.onload = function() 
            {
                navigateToPage();
            }
        </script>
<?php

    }
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login</title>
    <style>
        body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 0px;
        padding: 0px;
        text-decoration: none;
        box-sizing: border-box;
        min-height: 100vh;
        background: linear-gradient(to right top, #a1a1a1, #84b4d7, #00d1e3, #00e7a2, #a8eb12);
        }
        form{
            background: #989898ce;
            width: 350px;
            height: 280px;
            padding: 40px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        h1 {
            text-align: center;
            margin-bottom: 65px;
            color: black;
            font-size: 80px;
        }
        .textBoxdiv {
            border-bottom: 2px solid white;
            position: relative;
            margin: 50px;
        }
        .textBoxDiv input{
            background: none;
            border: none;
            outline:none;
            width:100%;
            color: white;
            height: 30px;
            font-size: 20px;
        }
        .loginBtn {
            height: 45px;
            width: 100%;
            border: none;
            outline: none;
            background: linear-gradient(to right top, #a1a1a1, #84b4d7, #00d1e3, #00e7a2, #a8eb12);
        }
    </style>
         
</head>

<body>
    <h1>Login</h1>
    <div id="container">
        <form method="post" action="index.php">
            <label for="email">Email:</label><br><br>
            <input type="text" name="email" placeholder="Enter Your Email" required><br><br>
            <label for="password">Password:</label><br><br>
            <input type="password" name="password" placeholder="Enter Your Password" required><br><br><br>
            <input type="submit" name="login" value="Login"><br><br>
            <label>Don't have an account? </label><a href="registration.php">Sign Up</a>
        </form>
    </div>
</body>

</html>