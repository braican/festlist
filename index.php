
<?php include "util/functions.php"; ?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Beer Fest</title>

    <link rel="stylesheet" href="css/beerfest.css">

</head>
<body>

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
            <span class="user-info"></span>
            <div class="menu-trigger">
                <span class="top"></span>
                <span class="mid"></span>
                <span class="bottom"></span>
            </div>
        </div>

        <div class="util-nav">
            <ul>
                <li class="active" data-list="global"><?php include_svg('globe'); ?></li>
                <li data-list="hads"><?php include_svg('user'); ?></li>
                <li data-list="wishlist"><?php include_svg('star'); ?></li>
            </ul>
        </div>
    </div>
    
    <div id="authentication">
        <div class="login">
            <h2>Login</h2>
            <form id="login-form">
                <input type="text" name="user_email" placeholder="email address">
                <input type="password" name="user_password" placeholder="password">
                <button type="submit">Log in</button>
            </form>
        </div>
        
        <div class="register">
            or create an account

            <form id="register-form">
                <input type="text" name="user_email" placeholder="email address">
                <input type="password" name="user_password" placeholder="password">
                <button type="submit">Register</button>
            </form>
        </div>
    </div>


    <div id="slideout">
        <div id="side-banner">
            <ul id="scrollit"></ul>
        </div>

        <div class="menu">
            <ul>
                <li id="firebase-logout"><a href="#">Log Out</a></li>
                <!-- <li id="clearall"><a href="#">Clear Data</a></li> -->
            </ul>
        </div>
    </div>

    <div id="app-main">
        <header id="app-header">
            <h2 class="active" data-list="global">Global Beer List</h2>
            <h2 data-list="hads">My Hads</h2>
            <h2 data-list="wishlist">My Wishlist</h2>
        </header>

        <div id="beerlists">
            <ul id="beerlist" class="beer-list active" data-list="global"></ul>
            <ul id="my-beerlist" class="beer-list" data-list="hads"></ul>
            <ul id="my-wishlist" class="beer-list" data-list="wishlist"></ul>
        </div>
    </div>
</div>


<script src="https://cdn.firebase.com/js/client/2.1.2/firebase.js"></script>
<script src="js/jquery.js"></script>
<script src="js/util.js"></script>
<script src="js/beerfest.js"></script>

</body>
</html>