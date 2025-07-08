<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");

include("php/config.php");

$error = "";
$email = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (isset($_POST['submit'])) {
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $password = $_POST['password'] ?? '';

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $error = "Invalid email format";
            } elseif (empty($password)) {
                $error = "Password is required";
            } else {
                $stmt = $con->prepare("SELECT id, username, password FROM users WHERE email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    $user = $result->fetch_assoc();
                    if (password_verify($password, $user['password'])) {
                        session_regenerate_id(true);
                        $_SESSION = [
                            'loggedin' => true,
                            'user_id' => $user['id'],
                            'username' => $user['username'],
                            'ip' => $_SERVER['REMOTE_ADDR'],
                            'user_agent' => $_SERVER['HTTP_USER_AGENT']
                        ];
                        header("Location: home.php");
                        exit();
                    } else {
                        $error = "Invalid password";
                    }
                } else {
                    $error = "Email not found";
                }
            }
        } elseif (isset($_POST['guest'])) {
            session_regenerate_id(true);
            $_SESSION = [
                'loggedin' => true,
                'user_type' => 'guest',
                'username' => "Guest",
                'ip' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT']
            ];
            header("Location: home.php");
            exit();
        }
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        $error = "A system error occurred. Please try again later.";
    }
}
unset($password);
?>

<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
    <link rel="stylesheet" href="index.css">
    <title>Secure Login</title>
   
</head>
<body>
    <div class="login-container">
        <h1>Welcome Back</h1>

        <?php if (!empty($error)): ?>
            <div class="alert"><?= htmlspecialchars($error, ENT_QUOTES) ?></div>
        <?php endif; ?>

        <form method="POST" autocomplete="on">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" 
                       value="<?= htmlspecialchars($email, ENT_QUOTES) ?>" 
                       required autocomplete="email">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" 
                       required autocomplete="current-password" 
                       minlength="8">
            </div>

            <button type="submit" name="submit">Sign In</button>
        </form>

        <form method="POST">
            <button type="submit" name="guest" class="guest-login">
                Continue as Guest
            </button>
        </form>

        <div class="links">
            New user? <a href="register.php">Create account</a><br>
            
        </div>
    </div>
</body>
</html>