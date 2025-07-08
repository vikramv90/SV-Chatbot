<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/style.css">
    <title>Register</title>
</head>
<body>
      <div class="container">
        <div class="box form-box">

        <?php
include("php/config.php");
if(isset($_POST['submit'])){
    $username = mysqli_real_escape_string($con, $_POST['username']);
    $email = mysqli_real_escape_string($con, $_POST['email']);
    $age = mysqli_real_escape_string($con, $_POST['age']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $verify_query = mysqli_query($con, "SELECT Email FROM users WHERE Email='$email'");
    if(mysqli_num_rows($verify_query) > 0){
        echo "<div class='message'><p>This email is already in use.</p></div>";
        echo "<a href='javascript:self.history.back()'><button class='btn'>Go Back</button>";
    } else {
        mysqli_query($con, "INSERT INTO users(Username, Email, Age, Password) VALUES('$username', '$email', '$age', '$password')") or die(mysqli_error($con));
        echo "<div class='message'><p>Registration successful!</p></div>";
        echo "<a href='index.php'><button class='btn'>Login Now</button>";
    }
} else {
?>

            <header>Sign Up</header>
            <form action="" method="post">
                <div class="field input">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" autocomplete="off" required>
                </div>

                <div class="field input">
                    <label for="email">Email</label>
                    <input type="text" name="email" id="email" autocomplete="off" required>
                </div>

                <div class="field input">
                    <label for="age">Age</label>
                    <input type="number" name="age" id="age" autocomplete="off" required>
                </div>
                <div class="field input">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" autocomplete="off" required>
                </div>

                <div class="field">
                    
                    <input type="submit" class="btn" name="submit" value="Register" required>
                </div>
                <div class="links">
                    Already a member? <a href="index.php">Sign In</a>
                </div>
            </form>
        </div>
        <?php } ?>
      </div>
<style>
    /* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body with background image */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-image: url('regi.jpg'); /* path adjust karein agar img2.jpeg parent folder me hai */
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Container */
.container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Form Box */
.box.form-box {
    background: rgba(62, 43, 43, 0.85); /* White with transparency */
    padding: 40px 30px;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Header */
header {
    font-size: 2rem;
    color: #2563eb;
    text-align: center;
    margin-bottom: 20px;
    font-weight: 700;
}

/* Fields */
.field.input {
    margin-bottom: 18px;
}

label {
    display: block;
    margin-bottom: 7px;
    color:  #2563eb;
    font-weight: 500;
}
/* Username label */
label[for="username"] {
    color: #e91e63; 
}
/* Email label */
label[for="email"] {
    color: #4caf50; 
}
/* Age label */
label[for="age"] {
    color: #ff9800; 
}
/* Password label */
label[for="password"] {
    color: #3f51b5; 
}

input[type="text"],
input[type="number"],
input[type="password"] {
    width: 100%;
    padding: 12px 10px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
}

/* Button */
.btn {
    width: 100%;
    padding: 12px 0;
    background:rgb(233, 235, 241);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 10px;
}

.btn:hover {
    background: #174ea6;
}

/* Message */
.message {
    background: #fee2e2;
    color: #dc2626;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 15px;
    font-size: 1rem;
}

/* Links */
.links {
    text-align: center;
    margin-top: 10px;
    font-size: 0.95rem;
}

.links a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
}

.links a:hover {
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
    .box.form-box {
        padding: 25px 10px;
    }
    header {
        font-size: 1.5rem;
    }
}
</style>
</body>

</html>