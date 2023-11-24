jQuery(document).ready(function($) {
    // Displays the slider for recent posts
    $(".post-slider").owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            },
        },
    });

    // Runs the slide up and down toggle on hover for image tiles
    $(".large-img-tile").on({
        mouseenter: function() {
            $(this).find(".wpb_text_column").slideDown(200);
            $(this).find(".nectar-button").slideDown(200);
        },
        mouseleave: function() {
            $(this).find(".wpb_text_column").slideUp(200);
            $(this).find(".nectar-button").slideUp(200);
        },
    });

    // Runs the click and drag for horizontal scroll
    var clicked = false,
        clickX;

    $(".scroll-wrapper").on({
        mousemove: function(e) {
            clicked && updateScrollPos(e, $(this));
        },
        mousedown: function(e) {
            e.preventDefault();
            clicked = true;
            clickX = e.pageX;
        },
        mouseup: function() {
            clicked = false;
            $("html").css("cursor", "auto");
        },
    });

    var updateScrollPos = function(e, curElement) {
        $("html").css("cursor", "grabbing");
        $(curElement).scrollLeft(
            $(curElement).scrollLeft() + (clickX - e.pageX),
            8000
        );
    };

    $(".share-btn").on("click", function(e) {
        e.preventDefault();
        $("#social-sharing-container").toggle("slide", { direction: "left" }, 500);
    });

    // Function to redirect filter page to category page
    $("#filter_by").on("change", function() {
        window.location.href = $(this).val();
    });

    // Function to redirect to sort page
    $("#sort_by").on("change", function() {
        var websiteUrl =
            "https://" +
            window.location.hostname +
            window.location.pathname +
            "?sort_by=" +
            $(this).val();
        window.location.href = websiteUrl;
    });

    // Function to redirect to taxonomy page
    $("#location_filter").on("change", function() {
        var websiteUrl =
            "https://" + window.location.hostname + "/location/" + $(this).val();
        window.location.href = websiteUrl;
    });

    // Function to redirect to taxonomy page
    $("#method_filter").on("change", function() {
        var websiteUrl =
            "https://" + window.location.hostname + "/method/" + $(this).val();
        window.location.href = websiteUrl;
    });

    // Function to redirect to taxonomy page
    $("#project_location_filter").on("change", function() {
        var websiteUrl = "https://" + window.location.hostname + $(this).val();
        window.location.href = websiteUrl;
    });

    // Function to redirect to taxonomy page
    $("#project_method_filter").on("change", function() {
        var websiteUrl = "https://" + window.location.hostname + $(this).val();
        window.location.href = websiteUrl;
    });
    // Function get get URL parameters
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split("&"),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split("=");

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ?
                    true :
                    decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    // Function to set the chosen sort on post page
    var sort_by = getUrlParameter("sort_by");
    if (sort_by != "") {
        var selectedID = "#sort_by option[value=" + sort_by + "]";
        $(selectedID).attr("selected", "selected");
    }

    // Function to close the team profile block
    $(".mobile-close").on("click", function(e) {
        e.preventDefault();
        var bioID = $(this).attr("data-ref");
        $(bioID).slideToggle(500);
    });

    // AJAX function to display team bio
    $(".team-member").on("click", function(e) {
        e.preventDefault();
        // Class Toggles
        $(".team-member").removeClass("active");
        $(this).addClass("active");
        $(".single-bio").hide();

        var postID = $(this).attr("data-id");
        var singlebioID = "#" + $(this).attr("data-bio");
        $(singlebioID).slideToggle(500);

        $.ajax({
            type: "POST",
            url: "https://greencollar.com.au/wp-admin/admin-ajax.php",
            data: {
                post_id: postID,
                action: "get_member_data",
            },
            success: function(result) {
                $(singlebioID)
                    .find(".image-profile .profile-img")
                    .css("background-image", "url(" + result.featured_image + ")");

                // Member info
                $(singlebioID).find(".member-name").html(result.member_name);
                $(singlebioID).find(".position").html(result.position_title);
                $(singlebioID)
                    .find(".member-description")
                    .html(result.member_description);

                // Icon Logic to show/hide
                if (result.linkedin_url != "") {
                    $(singlebioID).find(".linkedin-icon").show();
                    $(singlebioID)
                        .find(".linkedin-icon")
                        .attr("href", result.linkedin_url);
                } else {
                    $(singlebioID).find(".linkedin-icon").hide();
                }
                if (result.email_address != "") {
                    $(singlebioID).find(".email-icon").show();
                    $(singlebioID)
                        .find(".email-icon")
                        .attr("href", "mailto:" + result.email_address);
                } else {
                    $(singlebioID).find(".email-icon").hide();
                }
            },
            error: function() {
                alert("error");
            },
        });
    });

    // Function to toggle between the timelines accordions
    $(".milestone-title").on("click", function(e) {
        e.preventDefault();

        // Removes all active status
        $(".milestone-title").each(function() {
            $(this).removeClass("active");
        });

        // Add active status
        $(this).addClass("active");

        var contentID = $(this).attr("data-ref");
        $(".show-block").removeClass("show-block");
        $(contentID).addClass("show-block");
    });

    // Function to toggle the active year
    $(".timeline-sidebar li").on("click", function(e) {
        e.preventDefault();
        $(".timeline-sidebar li").each(function() {
            $(this).removeClass("active");
        });

        $(this).addClass("active");
    });

    // Function to toggle the active year
    $(".timeline-sidebar li span").on("click", function(e) {
        e.preventDefault();

        var elementID = $(this).attr("data-ref");

        $([document.documentElement, document.body]).animate({
                scrollTop: $(elementID).offset().top - 150,
            },
            1000
        );

        console.log(elementID);
    });

    // Function to stick the sidebar for milestone to top of page after scrolling past
    $(window).scroll(function(e) {
        if ($(document).hasClass(".timeline-row")) {
            var topofTimeline = $(".timeline-row").offset().top;
            var topofContent = $(".scrolling-tab-content").offset().top;
            var height = $(".scrolling-tab-content").outerHeight() - 350;

            // Only activate on desktop
            if ($(window).width() > 1100) {
                if (
                    $(window).scrollTop() > topofTimeline &&
                    $(window).scrollTop() < topofContent + height
                ) {
                    $(".timeline-row").addClass("fixed");
                } else {
                    $(".timeline-row").removeClass("fixed");
                }
            }
        }
    });
});