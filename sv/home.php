<?php
session_start();


if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: index.php");
    exit();
}


$_SESSION['user_type'] = $_SESSION['user_type'] ?? 'registered';

$isGuest = ($_SESSION['user_type'] === 'guest');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHATBOT</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="main-wrapper">
        <button class="mobile-nav-toggle">
            <i class="fa-solid fa-bars" style="color: white;"></i>
        </button>
        
        <div class="sideNavigation"> 
            <div class="topBarAction">
                <i class="fa-solid fa-bars" id="sideNavToggle"></i>
            </div>
            
            <div class="sideNavButton">
                <button id="newChatBtn">
                    <i class="fa-solid fa-plus"></i>
                    <span class="collapseText">New chat</span>
                </button>
            </div>
            
            <div class="chatHistory">
                <h5>Recent</h5>
                <ul id="chatHistoryList">
                    <!-- Chat history items will be added here dynamically -->
                </ul>
            </div>
            
            <div class="actionlist">
           
                <button id="helpBtn">
                    <i class="fa-regular fa-circle-question"></i>
                    <span class="collapseText">Help</span>
                </button>
                <button id="activityBtn">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <span class="collapseText">Activity</span>
                </button>
                <button id="settingsBtn">
                    <i class="fa-solid fa-gear"></i>
                    <span class="collapseText">Settings</span>
                </button>
                <button id="settingsbtn">
                    <a href="index.php"> Logout
                    </a>
                    <i class="fa-solid fa-log-out"></i>
                </button>
            </div>
        </div>
        
        <div class="content-wrapper">
            <div class="chat-container" id="chatContainer">
                <p>
                    <?php
                    if ($isGuest) {
                        echo "Welcome, Guest! You are logged in as a guest.";
                    } else {
                        echo "Welcome, " . htmlspecialchars($_SESSION['username']) . "! You are logged in as a registered user.";
                    }
                    ?>
                </p>
            </div>
            
            <div class="prompt-area">
                <div class="prompt-container">
                    <div class="file-input-wrapper">
                        <button id="imageBtn">
                            <i class="fa-solid fa-image" style="color: white;"></i>
                        </button>
                        <input type="file" id="imageInput" accept="image/*" hidden>
                    </div>
                    <div class="file-input-wrapper">
                        <button id="cameraBtn">
                            <i class="fa-solid fa-camera" style="color: white;"></i>
                        </button>
                        <input type="file" id="cameraInput" accept="image/*" capture="environment" hidden>
                    </div>
                    <div class="file-input-wrapper">
                        <button id="voiceBtn">
                            <i class="fa-solid fa-microphone" style="color: white;"></i>
                        </button>
                    </div>
                    <input type="text" id="promptInput" placeholder="Message...">
                    <button id="submitBtn">
                        <i class="fa-solid fa-paper-plane" style="color: white;"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal" id="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modalTitle">Modal Title</h2>
            <div id="modalContent">
                
            </div>
        </div>
    </div>

    <div class="voice-recording-modal" id="voiceModal">
        <div class="voice-modal-content">
            <div class="voice-animation" id="voiceAnimation">
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
            </div>
            <p>Listening... Speak now</p>
            <button id="stopVoiceBtn">Stop Recording</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>