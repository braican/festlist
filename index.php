
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
                <div class="icon-user">
                    <?php include_svg('icon-user'); ?>
                </div>
                <div class="icon-close">
                    <?php include_svg('icon-close'); ?>
                </div>
            </div>

            <span class="user-email"></span>
        </div>

        <div class="util-nav">
            <ul>
                <li class="active" data-list="global" data-title="Beer List" data-module="beerlist"><?php include_svg('icon-bottles'); ?></li>
                <li data-list="hads" data-title="My Hads" data-module="beerlist"><?php include_svg('icon-hads'); ?></li>
                <li data-list="wishlist" data-title="My Wishlist" data-module="beerlist"><?php include_svg('icon-star'); ?></li>
                <li data-list="search" data-title="Search" data-module="beerlist"><?php include_svg('icon-search'); ?></li>
                <li data-list="more" data-title="More" data-module="more-content" class="hide-if-anonymous"><?php include_svg('icon-more'); ?></li>
            </ul>
        </div>
    </div>


    <div id="drawer" class="secondary">
        <div id="side-banner">
            <ul id="scrollit"></ul>
        </div>
        

        <div class="secondary-container">
            
            <div class="slide">
                <div id="user-info">Not logged in<br><small>You can still save data on your device.</small></div>

                <div class="authentication">
                    <form id="login-form">
                        <h2>Log In</h2>
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
                        <p class="not-special">This app in still in limited beta. For a user account, contact Nick Braica at <a href="mailto:nick.braica@gmail.com">nick.braica@gmail.com</a>.</p>
                        <p>The app will save your data without a login; it will simply save to the device you are using.</p>
                    </div>
                </div>


                <ul>
                    <li id="firebase-logout"><a href="#">Log Out</a></li>
                </ul>


                <div class="copyright">All data pulled from <a href="http://www.beeradvocate.com" target="_blank">BeerAdvocate.com</a></div>
            </div>

        </div>
    </div>

    <div id="app-main">
        <header id="app-header">
            <h2>Global Beer List</h2>
        </header>

        <div class="app-main-container">
            <div id="beerlist" class="app-content active">
                <div class="search-header">
                    <ul class="search-nav app-cf">
                        <li class="active" data-search="beer" data-placeholder="Search for a beer">Beer</li>
                        <li data-search="brewery" data-placeholder="Search for a brewery">Brewery</li>
                    </ul>
                    <div class="input-container">
                        <span class="clear-input"><?php include_svg('icon-remove'); ?></span>
                        
                        <div class="input-wrapper">
                            <input data-search="beer" type="text" id="input-search" placeholder="Search for a beer">
                        </div>
                    </div>
                </div>
                <ul class="beer-list"></ul>    
            </div>

            <div id="more-content" class="app-content">
                
                <div class="more-element">
                    <div class="option">Add a Beer <span class="expand">+</span><span class="collapse">-</span></div>
                    <div class="content">
                        <form class="add-new-beer">
                            <div class="choose-brewery">
                                <input type="text" placeholder="Brewery" id="input-choose-brewery" autocomplete="off">
                                <div class="list-holder">
                                    <ul class="choose-list" id="brewery-choose-list"></ul>
                                </div>
                            </div>

                            <div class="choose-beer">
                                <div class="chosen-brewery"></div>
                                <div><a href="#" class="change-brewery">Change Brewery</a></div>
                                <input type="text" placeholder="Beer name" id="input-choose-beer" autocomplete="off">
                            </div>

                            <div class="actions">
                                <button type="submit">Add Beer</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="more-element">
                    <div class="option">Spin the Wheel <span class="expand">+</span><span class="collapse">-</span></div>
                    <div class="content">
                        Spin DAT WHEEL
                    </div>
                </div>
                
            </div>
        </div>
        
    </div>

</div>


<script src="https://cdn.firebase.com/js/client/2.1.2/firebase.js"></script>
<script src="js/jquery.js"></script>
<script src="js/util.js"></script>
<script src="js/beerfest.js"></script>

</body>
</html>