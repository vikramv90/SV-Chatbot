
<?php 
   session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="wstyle.css">
    <title>Welcome</title>
</head>
<body>
    
    <div class="container">
        <div class="box form-box">
            <header>
                Welcome To chatbot
            </header>
            <p>Welcome to our system! Please choose an option to proceed:</p>
            <!-- Guest Login Form -->
            <form action="index.php" method="post">
                <div class="field">
                    <input type="hidden" name="guest" value="true">
                    <input type="submit" class="btn" value="Login as Guest">
                </div>
            </form>
            <!-- Regular Login Form -->
            <form action="index.php" method="get">
                <div class="field">
                    <input type="submit" class="btn" value="Login Now">
                </div>
            </form>
        </div>
    </div>
</body>
</html>