
<?php include "util/functions.php"; ?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Beer Fest</title>

    <link rel="stylesheet" href="css/beerfest.css">

</head>
<body class="global">

<div class="loader">
    <div class="preloader">
      <div class="preloader-container">
        <span class="animated-preloader"></span>
      </div>
    </div>
</div>

<div id="app">

    <div id="banner" class="app-banner">
        <div class="branding">
            <span class="app-name"><?php include_svg('logo'); ?></span>

            <div class="menu-trigger">
                <span class="top"></span>
                <span class="mid"></span>
                <span class="bottom"></span>
            </div>

            <span class="user-email"></span>
        </div>

        <div class="util-nav">
            <ul>
                <li class="active" data-list="global"><?php include_svg('globe'); ?></li>
                <li data-list="hads"><?php include_svg('user'); ?></li>
                <li data-list="wishlist"><?php include_svg('star'); ?></li>
            </ul>
        </div>
    </div>


    <div id="drawer" class="secondary">
        <div id="side-banner">
            <ul id="scrollit"></ul>
        </div>
        

        <div class="secondary-container">
            <div class="secondary-slide">
                <div class="menu slide">
                    <div id="user-info">Not logged in<br><small>You can still save data on your device.</small></div>
                    <ul>
                        <li id="firebase-login"><a href="#" class="js-trigger-prompt-login">Log In</a></li>
                        <li id="firebase-logout"><a href="#">Log Out</a></li>
                    </ul>
                </div>

                <div class="slide authentication">
                    <div class="login">
                        <h2>Login</h2>
                        <form id="login-form">
                            <input type="text" name="user_email" placeholder="email address">
                            <input type="password" name="user_password" placeholder="password">
                            <div class="actions">
                                
                                <div class="loader">
                                    <div class="preloader">
                                      <div class="preloader-container">
                                        <span class="animated-preloader"></span>
                                      </div>
                                    </div>
                                </div>
                                
                                <button type="submit">Log in</button>
                            </div>
                            <a href="#" class="js-trigger-prompt-login">Cancel</a>
                        </form>

                        <div class="about">
                            <p>This app in still in limited beta. For a user account, contact Nick Braica at <a href="mailto:nick.braica@gmail.com">nick.braica@gmail.com</a>.</p>
                            <p>The app will save your data without a login; it will simply save to the device you are using.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div id="app-main">
        <header id="app-header">
            <h2 class="active" data-list="global">Global Beer List</h2>
            <h2 data-list="hads">My Hads</h2>
            <h2 data-list="wishlist">My Wishlist</h2>
        </header>

        <ul id="beerlist" class="beer-list active" data-list="global"></ul>
        
    </div>

</div>


<script src="https://cdn.firebase.com/js/client/2.1.2/firebase.js"></script>
<script src="js/jquery.js"></script>
<script src="js/util.js"></script>
<script src="js/beerfest.js"></script>

</body>
</html>