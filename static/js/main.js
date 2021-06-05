jQuery(function($) {
	// DOM Elements
	var Body = $("body");
	var EarthSection = $("#EarthSection");
	var EarthContainer = $("#Earth");
	var Menu = $("#MainNav")
	var MenuHover = $("#MenuHover")
	var MenuItems = $("#MainNav li");
	var Noise = $(".Noise");
	var Sections = $(".Section");
	var LinesContainer = $("#Lines");
	var Lines = $("#Lines > div");
	var Intro = $("#Intro");
	var IntroComingSoon = $("#IntroComingSoon");
	var IntroBtn = $("#IntroBtn");
	var IntroBtnProgress = $("#IntroBtnProgress");
	var Preloader = $("#Preloader");
	var PreloaderAnim = $("#PreloaderAnim");
	var OverlayLogo = $("#OverlayLogo");
	var SectionLines = $("#SectionLines");
	var SectionBack = $(".SectionBack");
	var SubscribeFormEmail =  $("#SubscribeFormEmail");
	var SubscribeForm =  document.getElementById('SubscribeForm'); // $('').method / $('').action = undefined
	var SubscribeSubmit =  $("#SubscribeSubmit");
	var SubscribeFormStatus =  $("#SubscribeFormStatus");
	var Countdown =  $("#Countdown");
	var BackgroundPicsContainer =  $("#BackgroundPics");
	var BackgroundPics =  $("#BackgroundPics > div");
	var MobileNav;
	
	// Global variables
	var DocumentLoaded = false;
	var ThreeLoaded = false;
	
	var Map;
	
	var MenuPressed = false;
	
	// Functions
	MenuF();
	EarthF();
	IntroF();
	SectionsF();
	NotifyF();
	CountdownF();
	PreloaderF();
	
	// Background slideshow
	function BackgroundPicsF() {		
		if (BackgroundPics.length) {
			if (!BackgroundPicsContainer.find("div.Active").length) { setTimeout(function() { BackgroundPics.eq(0).addClass("Active"); }, 2000); }
			setInterval(function() {
				var Current = BackgroundPicsContainer.find("div.Active");
				var Next = Current.next();
				if (!Next.length) { Next = BackgroundPics.eq(0); }
				
				Current.removeClass("Active");
				setTimeout(function() { Next.addClass("Active") }, 1000);
			}, parseInt(BackgroundPicsContainer.attr("data-interval"), 10));
		}
	}
	
	// Countdown
	function CountdownF() {
		if (Countdown.length) {
			var austDay = new Date();
			austDay = new Date(Countdown.attr("data-moment") * 1000);
			Countdown.countdown({until: austDay, layout:Countdown.attr("data-layout")});
		}
	}
	// Notify section
	function NotifyF() {
		var Regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		
		SubscribeFormEmail.on("click keypress",function() {
			SubscribeFormEmail.removeClass("FailedValidation"); 
			SubscribeFormStatus.removeClass("Active");
		});
		SubscribeSubmit.on("click",function() {
			if (Regex.test(SubscribeFormEmail.val())) {
					var xhr = new XMLHttpRequest();
					xhr.open(SubscribeForm.method, SubscribeForm.action, true);
					xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
					xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
					// Send the collected data as JSON
					xhr.send(JSON.stringify({"email": SubscribeFormEmail.val()}));
					xhr.onloadend = response => {
						if (response.target.status === 200) {
							SubscribeFormStatus.html(SubscribeFormStatus.attr("data-success"));
							SubscribeFormStatus.addClass("Active");
							SubscribeFormEmail.val("");
						} else {
							SubscribeFormStatus.html(SubscribeFormStatus.attr("data-fail"));
							SubscribeFormStatus.addClass("Active");
						}
					};
			} else {
				SubscribeFormEmail.addClass("FailedValidation");
				SubscribeFormStatus.removeClass("Active");
			}
			return false;
		});
	}
	
	// Preloader
	function PreloaderF() {
		var PreloaderInterval = setInterval(function() {
			if (DocumentLoaded && ThreeLoaded) { 
				window.clearInterval(PreloaderInterval);
				PreloaderAnim.animate({opacity:0}, 500, function() {
					Preloader.animate({opacity:0}, 900, function() {
						Preloader.remove();
					});
				});
			}
		}, 100);
		
		$(window).load(function() { DocumentLoaded = true; });
	}
	
	// Intro overlay
	function IntroF() {
		$.fn.IntroButton = function() {
			var It = this;
			
			var	FillBtn;
			var FillBtnProgress = 0;
			var FillBtnState = false;
			var FillBtnFull = false;
			
			$(document).bind("keydown", KeyDown);
			$(document).bind("keyup", KeyUp);
			$(It).on("mousedown touchstart", "span", MouseDown);
			$(It).on("mouseup touchend", "span", MouseUp);
					
			function Change() {
				$(document).unbind("keydown", KeyDown);
				$(document).unbind("keyup", KeyUp);
				Sections.css("display","block");
				Intro.find(".IntroBtnWrapper").animate({opacity:0}, 300, function() {
					BackgroundPicsF();
					Menu.addClass("AfterIntro");
					IntroBtnProgress.animate({opacity:0}, 600, function() {
						Body.addClass("AfterIntro");
						Intro.animate({opacity:0}, 600, function() {
							Noise.addClass("AfterIntro");
							Intro.remove();
						});
					});
				});
			}
			
			function KeyDown(e) {
				if (e.keyCode == '32') {
					MouseDown();
				}
			}
			function KeyUp() {
				MouseUp();
			}
			
			function MouseDown() {
				if(FillBtnFull) { return false; }				
				if(FillBtnState == "DOWN") { return false; }
				$(It).addClass("Active");
				clearInterval(FillBtn);
				FillBtnState = "DOWN";
				FillBtn = setInterval(function() {
					if (FillBtnProgress < 100) {
						FillBtnProgress += 1;
						IntroComingSoon.css("opacity",1 - FillBtnProgress/100);
						IntroBtnProgress.css("transform","scaleX("+FillBtnProgress/100+")").css("-webkit-transform","scaleX("+FillBtnProgress/100+")");
					} else {
						FillBtnState = false;
						FillBtnFull = true;
						clearInterval(FillBtn);
						Change();
					}
				}, 7);
			}
			function MouseUp() {				
				if(FillBtnFull) { return false; }
				if(FillBtnState == "UP") { return false; }
				$(It).removeClass("Active");
				clearInterval(FillBtn);
				FillBtnState = "UP";
				FillBtn = setInterval(function() {
					if (FillBtnProgress > 0) {
						FillBtnProgress -= 4;
						IntroComingSoon.css("opacity",1 - FillBtnProgress/100);
						IntroBtnProgress.css("transform","scaleX("+FillBtnProgress/100+")").css("-webkit-transform","scaleX("+FillBtnProgress/100+")");
					} else {
						FillBtnState = false;
						clearInterval(FillBtn);
					}
				}, 7);
			}
		}
		IntroBtn.IntroButton();
	}
	
	// Sections
	function SectionsF() {
		$.fn.SectionBackItem = function() {
			var It = this;
			
			var	FillBtn;
			var FillBtnProgress = 0;
			var FillBtnState = false;
			var FillBtnFull = false;
			
			$(It).on("mousedown touchstart", "div > div > span", MouseDown);
			$(It).on("mouseup touchend", "div > div > span", MouseUp);
			function Change() {
				var ItChange = $(".Section.Active");			
				
				Body.removeClass("OnSection");
				OverlayLogo.removeClass("Active");
				SectionLines.removeClass("Active");
				
				$(ItChange).removeClass("Active");
				FillBtnProgress = 0;
				FillBtnFull = false;
				FillBtnState = false;
				$(It).find(".SectionBackProgress").css("transform","scaleY(0)").css("-webkit-transform","scaleY(0)");
				setTimeout(function() {
					$(ItChange).removeClass("Expand");
				}, 1800);	
			}
			function MouseDown() {
				if(FillBtnFull) { return false; }				
				if(FillBtnState == "DOWN") { return false; }
				clearInterval(FillBtn);
				FillBtnState = "DOWN";
				FillBtn = setInterval(function() {
					if (FillBtnProgress < 100) {
						FillBtnProgress += 1;
						$(It).children("span").css("transform","scaleY("+FillBtnProgress/100+")").css("-webkit-transform","scaleY("+FillBtnProgress/100+")");
					} else {
						FillBtnState = false;
						FillBtnFull = true;
						clearInterval(FillBtn);
						Change();
					}
				}, 7);
			}
			function MouseUp() {				
				if(FillBtnFull) { return false; }
				if(FillBtnState == "UP") { return false; }
				clearInterval(FillBtn);
				FillBtnState = "UP";
				FillBtn = setInterval(function() {
					if (FillBtnProgress > 0) {
						FillBtnProgress -= 4;
						$(It).children("span").css("transform","scaleY("+FillBtnProgress/100+")").css("-webkit-transform","scaleY("+FillBtnProgress/100+")");
					} else {
						FillBtnState = false;
						clearInterval(FillBtn);
					}
				}, 7);
			}
		}
		SectionBack.each(function() { 
			$(this).SectionBackItem(); 
		});
	}
	
	// Menu
	function MenuF() {		
	
		Menu.on("mouseover", "div > div > span", function() { Body.addClass("MenuHovered"); });
		Menu.on("mouseleave", "div > div > span", function() { Body.removeClass("MenuHovered"); });
		$.fn.MenuItem = function() {
			var It = this;
			
			var	FillBtn;
			var FillBtnProgress = 0;
			var FillBtnState = false;
			var FillBtnFull = false;
			
			$(It).on("mouseover", "div > div > span", MouseOver);
			$(It).on("mouseleave", "div > div > span", MouseOut);
			$(It).on("mousedown touchstart", "div > div > span", MouseDown);
			$(It).on("mouseup touchend", "div > div > span", MouseUp);
			function Change() {
				MenuPressed = false;
				setTimeout(function() {
					FillBtnProgress = 0;
					FillBtnFull = false;
					$(It).children("span").css("transform","scaleY("+FillBtnProgress/100+")").css("-webkit-transform","scaleY("+FillBtnProgress/100+")");
				}, 100);
				$($(It).find("div > div > span").attr("data-section")).addClass("Expand");
				setTimeout(function() {		
					$($(It).find("div > div > span").attr("data-section")).addClass("Active");
					OverlayLogo.addClass("Active");
					SectionLines.addClass("Active");
					Body.addClass("OnSection");
				}, 900);
			}
			function MouseOver() {
				MenuHover.css("transform","translate(-" + (100 / MenuItems.length * $(It).index()) + "%,-50%)");
				MenuHover.css("-webkit-transform","translate(-" + (100 / MenuItems.length * $(It).index()) + "%,-50%)");
				MenuHover.addClass("Active");
			}
			function MouseOut() {
				MenuHover.removeClass("Active");
			}
			function MouseDown() {
				if(MenuPressed) { return false; }
				if(FillBtnFull) { return false; }				
				if(FillBtnState == "DOWN") { return false; }
				clearInterval(FillBtn);
				FillBtnState = "DOWN";
				MenuPressed = true;
				FillBtn = setInterval(function() {
					if (FillBtnProgress < 100) {
						FillBtnProgress += 1;
						$(It).children("span").css("transform","scaleY("+FillBtnProgress/100+")").css("-webkit-transform","scaleY("+FillBtnProgress/100+")");
					} else {
						FillBtnState = false;
						FillBtnFull = true;
						clearInterval(FillBtn);
						Change();
					}
				}, 7);
			}
			function MouseUp() {				
				if(FillBtnFull) { return false; }
				if(FillBtnState == "UP") { return false; }
				clearInterval(FillBtn);
				FillBtnState = "UP";				
				MenuPressed = false;
				FillBtn = setInterval(function() {
					if (FillBtnProgress > 0) {
						FillBtnProgress -= 4;
						$(It).children("span").css("transform","scaleY("+FillBtnProgress/100+")").css("-webkit-transform","scaleY("+FillBtnProgress/100+")");
					} else {
						FillBtnState = false;
						clearInterval(FillBtn);
					}
				}, 7);
			}
		}
		EarthSection.append('<nav class="MobileNav" id="MobileNav"><ul></ul></nav>');
		MobileNav = $("#MobileNav");
		
		MenuItems.each(function() { 
			$(this).MenuItem(); 
			MenuHover.append("<div>" + $(this).find("div > div > span").html() + "</div>");
			MobileNav.children("ul").append('<li><a href="' + $(this).find("div > div > span").attr("data-section") + '" data-section="' + $(this).find("div > div > span").attr("data-section") + '">' + $(this).find("div > div > span").html() + '</a></li>');
		});
		MenuHover.css("width", (MenuItems.length * 100) + "%");
		MenuHover.children("div").css("width", (100 / MenuItems.length) + "%");
		
		MobileNav.on("click", "a", function() {
			Body.animate({scrollTop: $($(this).attr("data-section")).offset().top }, 500);
		});
	}
	
	// Earth animation
	function EarthF() {
		if (!EarthContainer.length) {
			ThreeLoaded = true;
			return false;
		}
		
		var container, stats;

		var camera, scene, renderer;

		var mouseX = 0, mouseY = 0;

		var windowHalfX = EarthSection.width() / 2;
		var windowHalfY = EarthSection.height() / 2;

		init();


		function init() {
			container = EarthContainer[0];

			camera = new THREE.PerspectiveCamera( 45, EarthSection.width() / EarthSection.height(), 1, 2000 );
			camera.position.z = 220;


			scene = new THREE.Scene();

			var ambient = new THREE.AmbientLight( 0x777777 );
			scene.add( ambient );

			var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
			dirLight.position.set(100, 100, 50);
			scene.add(dirLight);

			var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
			dirLight2.position.set(-100, -100, 50);
			scene.add(dirLight2);

			var onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				}
			};

			var onError = function ( xhr ) { };

			THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

			var mtlLoader = new THREE.MTLLoader();
			mtlLoader.load( '_models/earth.mtl', function( materials ) {

				materials.preload();
				materials.materials.EarthGreen.shininess = 0;
				materials.materials.Water.shininess = 190;
				var objLoader = new THREE.OBJLoader();
				objLoader.setMaterials( materials );
				objLoader.load( '_models/earth.obj', function ( object ) {
					object.position.y = 0;
					scene.add( object );
					ThreeLoaded = true;
					animate();
				}, onProgress, onError );

			});

			renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true});
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( EarthSection.width(), EarthSection.height() );
			container.appendChild( renderer.domElement );

			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			window.addEventListener( 'resize', onWindowResize, false );
		}

		function onWindowResize() {
			var windowHalfX = EarthSection.width() / 2;
			var windowHalfY = EarthSection.height() / 2;

			camera.aspect =  EarthSection.width() / EarthSection.height();
			camera.updateProjectionMatrix();

			renderer.setSize(  EarthSection.width(), EarthSection.height() );
		}

		function onDocumentMouseMove( event ) {
			mouseX = ( event.clientX - windowHalfX ) / 2;
			mouseY = ( event.clientY - windowHalfY ) / 2;
		}
		function animate() {
			requestAnimationFrame( animate );
			render();
		}

		function render() {
			camera.position.x += ( mouseX - camera.position.x * 3 ) * .01;
			camera.position.y += ( - mouseY - camera.position.y * 3 ) * .01;

			camera.lookAt( scene.position );
			
			/* 
				3D SCENE ANIMATION
				Remove all rotation changes if you want to change 3d model to another
			*/
			
			// Plane
			scene.children[3].children[60].rotation.x += 0.005;
			scene.children[3].children[61].rotation.x += 0.005;
			scene.children[3].children[60].rotation.y = 5.8;
			scene.children[3].children[60].rotation.z = -0.04;
			scene.children[3].children[61].rotation.y = 5.8;
			scene.children[3].children[61].rotation.z = -0.04;
			
			// Cloud 1
			scene.children[3].children[266].rotation.y -= 0.01;
			scene.children[3].children[267].rotation.y -= 0.01;
			scene.children[3].children[268].rotation.y -= 0.01;
			scene.children[3].children[269].rotation.y -= 0.01;
			scene.children[3].children[270].rotation.y -= 0.01;
			scene.children[3].children[271].rotation.y -= 0.01;
			
			// Cloud 2
			scene.children[3].children[251].rotation.y += -0.002;
			scene.children[3].children[252].rotation.y += -0.002;
			scene.children[3].children[253].rotation.y += -0.002;
			scene.children[3].children[254].rotation.y += -0.002;
			scene.children[3].children[255].rotation.y += -0.002;
			scene.children[3].children[256].rotation.y += -0.002;
			
			// Cloud 3
			scene.children[3].children[226].rotation.y += 0.012;
			scene.children[3].children[227].rotation.y += 0.012;
			scene.children[3].children[228].rotation.y += 0.012;
			scene.children[3].children[229].rotation.y += 0.012;
			scene.children[3].children[230].rotation.y += 0.012;
			scene.children[3].children[231].rotation.y += 0.012;
			scene.children[3].children[232].rotation.y += 0.012;
			scene.children[3].children[233].rotation.y += 0.012;
			scene.children[3].children[234].rotation.y += 0.012;
			
			// Cloud 4
			scene.children[3].children[257].rotation.y -= 0.003;
			scene.children[3].children[258].rotation.y -= 0.003;
			scene.children[3].children[259].rotation.y -= 0.003;
			scene.children[3].children[260].rotation.y -= 0.003;
			scene.children[3].children[261].rotation.y -= 0.003;
			scene.children[3].children[262].rotation.y -= 0.003;
			scene.children[3].children[263].rotation.y -= 0.003;
			scene.children[3].children[264].rotation.y -= 0.003;
			scene.children[3].children[265].rotation.y -= 0.003;
			
			// Cloud 5
			scene.children[3].children[219].rotation.y -= -0.003;
			scene.children[3].children[220].rotation.y -= -0.003;
			scene.children[3].children[221].rotation.y -= -0.003;
			scene.children[3].children[222].rotation.y -= -0.003;
			scene.children[3].children[223].rotation.y -= -0.003;
			scene.children[3].children[224].rotation.y -= -0.003;
			scene.children[3].children[225].rotation.y -= -0.003;
			
			// Cloud 6
			scene.children[3].children[245].rotation.y -= -0.008;
			scene.children[3].children[246].rotation.y -= -0.008;
			scene.children[3].children[247].rotation.y -= -0.008;
			scene.children[3].children[248].rotation.y -= -0.008;
			scene.children[3].children[249].rotation.y -= -0.008;
			scene.children[3].children[250].rotation.y -= -0.008;
			
			// Cloud 7
			scene.children[3].children[209].rotation.y -= -0.003;
			scene.children[3].children[210].rotation.y -= -0.003;
			scene.children[3].children[211].rotation.y -= -0.003;
			scene.children[3].children[212].rotation.y -= -0.003;
			scene.children[3].children[213].rotation.y -= -0.003;
			scene.children[3].children[214].rotation.y -= -0.003;
			scene.children[3].children[215].rotation.y -= -0.003;
			scene.children[3].children[216].rotation.y -= -0.003;
			scene.children[3].children[217].rotation.y -= -0.003;
			scene.children[3].children[218].rotation.y -= -0.003;
			// Cloud 7
			scene.children[3].children[235].rotation.y -= 0.005;
			scene.children[3].children[236].rotation.y -= 0.005;
			scene.children[3].children[237].rotation.y -= 0.005;
			scene.children[3].children[238].rotation.y -= 0.005;
			scene.children[3].children[239].rotation.y -= 0.005;
			scene.children[3].children[240].rotation.y -= 0.005;
			scene.children[3].children[241].rotation.y -= 0.005;
			scene.children[3].children[242].rotation.y -= 0.005;
			scene.children[3].children[243].rotation.y -= 0.005;
			scene.children[3].children[244].rotation.y -= 0.005;
			
			renderer.render( scene, camera );

		}
	}
});