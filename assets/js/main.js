window.scrollReveal = new scrollReveal();  

jQuery(document).ready(function () {



    jQuery(function() {
        jQuery('#menu-top-menu').smartmenus({
            mainMenuSubOffsetX: 5,
            mainMenuSubOffsetY: -5,
            subMenusSubOffsetX: 5,
            subMenusSubOffsetY: -5
        });
    });


    jQuery(".post-content").fitVids();



});


