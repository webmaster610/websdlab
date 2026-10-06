 AOS.init({
 	duration: 800,
 	easing: 'slide'
 });

(function($) {

	"use strict";

	// Dismiss loader immediately so content is never blocked
	var loader = function() {
		if ($('#ftco-loader').length > 0) {
			$('#ftco-loader').removeClass('show');
		}
	};
	loader();
	setTimeout(loader, 1);
	setTimeout(loader, 500);

	// Polyfill $(window).offset for Stellar.js compatibility in jQuery 3
	if ($.fn && $.fn.offset) {
		var _origOffset = $.fn.offset;
		$.fn.offset = function() {
			if (!this[0] || this[0] === window || this[0] === document) {
				return { top: window.pageYOffset || 0, left: window.pageXOffset || 0 };
			}
			return _origOffset.apply(this, arguments);
		};
	}

	try {
		$(window).stellar({
			responsive: true,
			parallaxBackgrounds: true,
			parallaxElements: true,
			horizontalScrolling: false,
			hideDistantElements: false,
			scrollProperty: 'scroll'
		});
	} catch(e) {
		console.warn('Stellar initialization skipped:', e);
	}

	var fullHeight = function() {
		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});
	};
	fullHeight();

	// Scrollax
   $.Scrollax();

	var carousel = function() {
		$('.home-slider').owlCarousel({
	    loop:true,
	    autoplay: true,
	    margin:0,
	    animateOut: 'fadeOut',
	    animateIn: 'fadeIn',
	    nav:false,
	    autoplayHoverPause: false,
	    items: 1,
	    navText : ["<span class='ion-md-arrow-back' aria-hidden='true'></span><span class='sr-only'>Slide Sebelumnya</span>","<span class='ion-chevron-right' aria-hidden='true'></span><span class='sr-only'>Slide Berikutnya</span>"],
	    responsive:{
	      0:{
	        items:1
	      },
	      600:{
	        items:1
	      },
	      1000:{
	        items:1
	      }
	    }
		});
		$('.carousel-testimony').owlCarousel({
			autoplay: true,
			center: true,
			loop: true,
			items:1,
			margin: 30,
			stagePadding: 0,
			nav: false,
			navText: ['<span class="ion-ios-arrow-back" aria-hidden="true"></span><span class="sr-only">Slide Sebelumnya</span>', '<span class="ion-ios-arrow-forward" aria-hidden="true"></span><span class="sr-only">Slide Berikutnya</span>'],
			responsive:{
				0:{
					items: 1
				},
				600:{
					items: 1
				},
				1000:{
					items: 2
				}
			}
		});

		$('.carousel-prestasi').owlCarousel({
			autoplay: true,
			autoplayTimeout: 4500,
			autoplayHoverPause: true,
			loop: true,
			margin: 24,
			stagePadding: 0,
			nav: true,
			dots: true,
			navText: ['<span class="ion-ios-arrow-back" aria-hidden="true"></span><span class="sr-only">Slide Sebelumnya</span>', '<span class="ion-ios-arrow-forward" aria-hidden="true"></span><span class="sr-only">Slide Berikutnya</span>'],
			responsive:{
				0:{
					items: 1
				},
				768:{
					items: 2
				},
				1000:{
					items: 3
				}
			}
		});

		function updateCarouselA11y() {
			$('.owl-carousel').each(function() {
				var $carousel = $(this);
				$carousel.find('.owl-prev').removeAttr('role').attr('aria-label', 'Slide Sebelumnya');
				$carousel.find('.owl-next').removeAttr('role').attr('aria-label', 'Slide Berikutnya');
				$carousel.find('.owl-dot').removeAttr('role').each(function(index) {
					$(this).attr('aria-label', 'Pindah ke slide ' + (index + 1));
				});
			});
		}

		$('.home-slider, .carousel-testimony, .carousel-prestasi').on('initialized.owl.carousel refreshed.owl.carousel translated.owl.carousel', function() {
			updateCarouselA11y();
		});

		setTimeout(updateCarouselA11y, 100);
		setTimeout(updateCarouselA11y, 500);

	};
	carousel();

	$('nav .dropdown').hover(function(){
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function(){
		var $this = $(this);
			// timer;
		// timer = setTimeout(function(){
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
			$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
	  console.log('show');
	});

	// scroll
	var scrollWindow = function() {
		$(window).scroll(function(){
			var $w = $(this),
					st = $w.scrollTop(),
					navbar = $('.ftco_navbar'),
					sd = $('.js-scroll-wrap');

			if (st > 150) {
				if ( !navbar.hasClass('scrolled') ) {
					navbar.addClass('scrolled');	
				}
			} 
			if (st < 150) {
				if ( navbar.hasClass('scrolled') ) {
					navbar.removeClass('scrolled sleep');
				}
			} 
			if ( st > 350 ) {
				if ( !navbar.hasClass('awake') ) {
					navbar.addClass('awake');	
				}
				
				if(sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if ( st < 350 ) {
				if ( navbar.hasClass('awake') ) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if(sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	
	var counter = function() {
		
		$('#section-counter').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();

	var contentWayPoint = function() {
		var i = 0;
		$('.ftco-animate').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .ftco-animate.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};
	contentWayPoint();


	// magnific popup
	$('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
     gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });


  if ($.fn.datepicker) {
    $('.appointment_date').datepicker({
	    'format': 'm/d/yyyy',
	    'autoclose': true
	  });
  }

	if ($.fn.timepicker) {
		$('.appointment_time').timepicker();
	}




})(jQuery);

