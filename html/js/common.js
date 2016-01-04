(function(global, doc, $){

	// XP, IE10 미만 브라우저 접근 금지
	var isXP = window.navigator.appVersion.indexOf('NT 5.1') > -1;
	var isW2000 = window.navigator.appVersion.indexOf("Windows NT 5.0")!=-1;
	if (isXP || isW2000) {
		document.documentElement.className += ' ie-xp';
		// 접근 불가능 코드
	}

	var $html = $('html'),
	_html = global.html = doc.documentElement,
	_ua = global.UA = global.navigator.userAgent;

	// IE 10, 11 체크
	function checkSetClassPropIE() {
		// IE 10 => 문서에서 ('MSIE 10')를 찾아서 class=ie10 를 적용
		if (_ua.indexOf('MSIE 10') > -1) {
			$html.addClass('lt-ie11 ie10'); // IE10 버전 체크하여 <html> 요소에 class=lt-ie11 ie10 을 적용
		// IE 11 => 문서에서 ('rv:11') 를 찾아서 class=ie11 를 적용
		} else if (_ua.indexOf('rv:11') > -1) {
			$html.addClass('lt-ie11 ie11'); // IE11 버전 체크하여 <html> 요소에 class=lt-ie11 ie11 을 적용

		}
	}

	// 초기 수행코드 실행
	$(doc).ready(init);

	// 사업자 등록증 및 인증서 이미지 ie 대응하여 확장자 변경.
	// window.onload = init;
	// ie9, 10, 11 버전 체크하여 'png' 확장자 대입
	function init() {
		// 동적으로 생성된 코드를 담을 요소
		var $wrapper = $('.archives-wrap');
		// HTML 코드 생성
		var htmlCode = generateHTML();
		// $wrapper 요소 내부에 htmlCode 추가/생성
		$wrapper.html ( htmlCode );
	}

	// 템플릿 코드 생성 함수
	function generateHTML() {
		var dynamicCode = [];
		for(var i=0, l=IMU.data1.length; i<l; i++) {
			var _d = IMU.data1[i];
			_d.img_src  += ( $html.hasClass('ie') ) ? '.png': '.jpg';
			dynamicCode.push([
				'<div class="archives">',
					'<a href="'+ _d.a_href  +'" target="_blank">',
						'<img src="../images/common/blank.gif" alt="' +_d.img_alt + '" data-echo="'+ _d.img_src +'">',
						'<span>' +_d.span_text + '</span>',
					'</a>',
				'</div>'
				].join(''));
		}
		return dynamicCode.join('') ;
	}

	//메인 네비게이션
	var $openLink = $("#open_nav_link");
	$openLink.click(function(){
		$("#open_nav").slideToggle(250);
	});

	// SVGInjector : Style 설정
	var svgInjection = function() {
		// IE8, console.log() 오류 안나게
		if (!window.console){ console = {log: function() {}}; };
		// img.inject-me 요소 수집해서 mySVGsToInject 변수에 참조
		var mySVGsToInject = document.querySelectorAll('img.inject-svg');
		// SVG 주입(Injector) 설정 옵션
		var injectorOptions = {
			evalScripts: 'once', // always, once, never
			pngFallback: 'assets/png', // PNG 대체 폴더 설정
			each: function (svg) {
				// svg는 수집된 개별 img.inject-me를 가리킴
				// console.log(svg.id);
			}
		};
		// SVGInjector 함수에 연결
		SVGInjector(
			// 수집된 img.inject-me 요소
			mySVGsToInject,
			// SVG 주입(Injector) 설정 옵션
			injectorOptions,
			// 콜백 함수
			function (totalSVGsInjected) {
				// totalSVGsInjected는 SVG 주입된 설정 개수를 출력
				// console.log(totalSVGsInjected);
		});
	};

	// IMG => SVG로 변환, ie9 이하 버전 PNG로 대체
	svgInjection();

	// IE 10, 11 초기 수행코드 실행
	checkSetClassPropIE();

	// 부드럽게 스크롤 움직임
	smoothScroll.init();

	// echo 초기화
	echo.init({
		offset: 10,
		throttle: 250 // 불러오는 시간
	});

	// Main 슬라이드 배너
	$('#main_bn').ulslide({
		statusbar: true,
		affect: 'slide',
		axis: 'x',
		navigator: '#main_bn_bt a',
		duration: 400,
		autoslide: 3000,
		height: 'auto'
	});

	// Lazy Load Plugin for jQuery
	$("img.lazy").lazyload();

})(window, document, window.jQuery);