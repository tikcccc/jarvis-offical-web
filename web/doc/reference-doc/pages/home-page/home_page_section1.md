
網站架構：

 


section1:
header
加上
背景是mp4自動播放，中間有titile文字，文字是用 GSAP 為這段文字製作一個滑入（從下往上滑入）的進場動畫（需要在ainimations 裡面加入文字專用的動畫組件嗎？）,文字用C:\Projects\isBIM_Offical_Web\isbim-official-web\fonts文件夾裡的文字，mp4路徑：C:\Projects\isBIM_Offical_Web\isbim-official-web\public\videos\HERO_REEL_13_1.mp4

palantir html參考：
<div><header class="ptcom-design__hero__1q0gmo7"><div class="ptcom-design__heroContent__1q0gmo7"><h1><span class="ptcom-design__word__1q0gmo7">AI-Powered </span><span class="ptcom-design__word__1q0gmo7">Automation </span><br><span class="ptcom-design__word__1q0gmo7">for </span><span class="ptcom-design__word__1q0gmo7">Every </span><span class="ptcom-design__word__1q0gmo7">Decision </span></h1><div class="ptcom-design__arrow__1q0gmo7"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 242.07 238.58" fill="#ffffff"><title></title><path d="M135.85,0v187.55l106.22-93.17v38.53l-121.31,105.67L0,132.91v-38.53l105.67,93.17V0"></path></svg></div><p>Scroll to Explore</p></div></header><div class="ptcom-design__heroVideoFrame__1q0gmo7"><video poster="/assets/xrfr7uokpv1b/7fDpzgucHBJ7ev2bIjf7NP/524ea299bd87ab124d215167bb7b1030/first_frame.jpg" class="ptcom-design__heroVideo__1q0gmo7" playsinline="" loop="" autoplay=""><source src="/assets/xrfr7uokpv1b/6M2JKHlAX0hBQGNo0frl73/c7a20bce307ce95ddbbf88abb9b62e0e/HERO_REEL_13_1.mp4" type="video/mp4"></video></div></div>

palantir網站的樣式（用來做參考）：
element.style {
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    scroll-behavior: smooth;
    scroll-margin-block: 0;
    scroll-padding-block: 0;
}
body, html {
    background: var(--body-color);
    min-height: 100%;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
html[Attributes Style] {
    -webkit-locale: "en";
}
user agent stylesheet
:root {
    view-transition-name: root;
}
user agent stylesheet
html {
    display: block;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}



body:

element.style {
    overflow: unset;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body, html {
    background: var(--body-color);
    min-height: 100%;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
blockquote, body, dd, dl, figure, h1, h2, h3, h4, ol, p, ul {
    margin: 0;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
body {
    display: block;
    margin: 8px;
}

div#_next
element.style {
}
[id] {
    scroll-margin-top: 150px;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
div {
    display: block;
    unicode-bidi: isolate;
}


div.home-page


element.style {
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
div {
    display: block;
    unicode-bidi: isolate;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}




element.style {
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
div {
    display: block;
    unicode-bidi: isolate;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}


ptcom-design__hero__1q0gmo7:
element.style {
}
@media (min-width: 35em) {
    .ptcom-design__hero__1q0gmo7 {
        padding: 40px;
    }
}
.ptcom-design__hero__1q0gmo7 {
    color: #efefef;
    display: grid;
    min-height: 100vh;
    padding: 100px 40px;
    position: relative;
    z-index: 5;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
header {
    display: block;
    unicode-bidi: isolate;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}


ptcom-design__heroContent__1q0gmo7

element.style {
}
@media (min-width: 47.5em) {
    .ptcom-design__heroContent__1q0gmo7 {
        display: block;
    }
}
.ptcom-design__heroContent__1q0gmo7 {
    font-family: var(--headline-200-family);
    font-size: var(--headline-200-size);
    letter-spacing: var(--headline-200-letter);
    line-height: var(--headline-200-line);
    font-family: Alliance No\.2, Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 70px;
    overflow: hidden;
    text-align: center;
    width: 100%;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
div {
    display: block;
    unicode-bidi: isolate;
}
.ptcom-design__hero__1q0gmo7 {
    color: #efefef;
    display: grid;
    min-height: 100vh;
    padding: 100px 40px;
    position: relative;
    z-index: 5;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}

h1:
element.style {
}
@media (min-width: 47.5em) {
    .ptcom-design__heroContent__1q0gmo7>h1 {
        font-size: 80px;
        letter-spacing: -3.4px;
        line-height: 78px;
        padding: 35vh 0;
    }
}
.ptcom-design__heroContent__1q0gmo7>h1 {
    font-feature-settings: "ss04" on;
    font-size: 30px;
    line-height: 1.2;
    padding: 5vh 0 10vh;
    position: relative;
}
button, h1, h2, h3, h4, h5, h6, input, select, textarea {
    font: inherit;
}
blockquote, body, dd, dl, figure, h1, h2, h3, h4, ol, p, ul {
    margin: 0;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
}
.ptcom-design__heroContent__1q0gmo7 {
    font-family: var(--headline-200-family);
    font-size: var(--headline-200-size);
    letter-spacing: var(--headline-200-letter);
    line-height: var(--headline-200-line);
    font-family: Alliance No\.2, Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 70px;
    overflow: hidden;
    text-align: center;
    width: 100%;
}
.ptcom-design__hero__1q0gmo7 {
    color: #efefef;
    display: grid;
    min-height: 100vh;
    padding: 100px 40px;
    position: relative;
    z-index: 5;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
.ptcom-design__heroContent__1q0gmo7>h1:before {
    background: transparent;
    bottom: 0;
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    z-index: 1;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}

span:

ptcom-design__popUp__1q0gmo7 animation {
    transform: translateY(0px);
    clip-path: inset(0px 0px 0%);
}
element.style {
}
.ptcom-design__heroContent__1q0gmo7>h1 .ptcom-design__word__1q0gmo7:first-child, .ptcom-design__heroContent__1q0gmo7>h1 .ptcom-design__word__1q0gmo7:nth-child(2), .ptcom-design__heroContent__1q0gmo7>h1 .ptcom-design__word__1q0gmo7:nth-child(3) {
    animation-delay: .2s;
}
@media (min-width: 47.5em) {
    .ptcom-design__heroContent__1q0gmo7>h1 .ptcom-design__word__1q0gmo7 {
        padding: 0 10px;
    }
}
.ptcom-design__heroContent__1q0gmo7>h1 .ptcom-design__word__1q0gmo7 {
    animation: ptcom-design__popUp__1q0gmo7 .5s forwards;
    clip-path: inset(0 0 100% 0);
    display: inline-block;
    mix-blend-mode: difference;
    padding: 0 3px;
    position: relative;
    transform: translateY(100%);
    z-index: 2;
}
*, :after, :before {
    box-sizing: border-box;
}
@media (min-width: 47.5em) {
    .ptcom-design__heroContent__1q0gmo7>h1 {
        font-size: 80px;
        letter-spacing: -3.4px;
        line-height: 78px;
        padding: 35vh 0;
    }
}
.ptcom-design__heroContent__1q0gmo7>h1 {
    font-feature-settings: "ss04" on;
    font-size: 30px;
    line-height: 1.2;
    padding: 5vh 0 10vh;
    position: relative;
}
button, h1, h2, h3, h4, h5, h6, input, select, textarea {
    font: inherit;
}
user agent stylesheet
h1 {
    font-size: 2em;
    font-weight: bold;
}
.ptcom-design__heroContent__1q0gmo7 {
    font-family: var(--headline-200-family);
    font-size: var(--headline-200-size);
    letter-spacing: var(--headline-200-letter);
    line-height: var(--headline-200-line);
    font-family: Alliance No\.2, Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 70px;
    overflow: hidden;
    text-align: center;
    width: 100%;
}
.ptcom-design__hero__1q0gmo7 {
    color: #efefef;
    display: grid;
    min-height: 100vh;
    padding: 100px 40px;
    position: relative;
    z-index: 5;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}
100% {
    clip-path: inset(0);
    transform: translateY(0);
}


.ptcom-design__heroVideoFrame__1q0gmo7 {
    background-color: #0d0e10;
    inset: 0;
    position: fixed;
    z-index: 1;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
div {
    display: block;
    unicode-bidi: isolate;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}


.ptcom-design__heroVideo__1q0gmo7 {
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: right bottom;
    object-position: right bottom;
    width: 100%;
}
video {
    width: 100%;
}
img, video {
    display: block;
    height: auto;
    max-width: 100%;
}
*, :after, :before {
    box-sizing: border-box;
}
user agent stylesheet
video {
    object-fit: contain;
    overflow-clip-margin: content-box;
    overflow: clip;
}
.home-page {
    background-color: var(--light);
    color: var(--dark);
}
.aip-page, .home-page {
    --dark: #1e1f2b;
    --light: #efefef;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
body {
    font-family: Alliance No\.1, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3888888889;
    margin: 0;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
body {
    line-height: 1.5;
    min-height: 100vh;
    text-rendering: optimizeSpeed;
}
:root {
    --nhs-black: #202426;
    --nhs-black-rgb: 32 36 38;
   --brand-blue: #4e8af7;
   --brand-blue-rgb: 78 138 247;
    --nhs-white: #fff;
    --bg-white-rgb: 255 255 255;
    --height-nav: 86px;
    --nhs-max-width: 1480px;
    --nhs-link: var(--nhs-blue);
    --nhs-link-hover: rgba(var(--nhs-blue-rgb) / var(--hover-opacity));
}
@media (min-width: 60em) {
    :root {
        --gutter: 1.6666666667rem;
        --h-spacing: 1.6666666667rem;
        --section-v-spacing: 5.5555555556rem;
    }
}
@media (min-width: 35em) {
    :root {
        --gutter: 0.8333333333rem;
        --v-gutter: 1.6666666667rem;
        --section-v-spacing: 4.4444444444rem;
    }
}
:root {
    --zero: 0 * 1rem;
    --max-width: 80rem;
    --grid: repeat(12, minmax(10px, 1fr));
    --gutter: 0.5555555556rem;
    --v-gutter: 1.1111111111rem;
    --h-spacing: 1.1111111111rem;
    --section-v-spacing: 3.3333333333rem;
    --spacing-tiny: 0.1666666667rem;
    --spacing-xs: 0.5555555556rem;
    --spacing-s: 1.1111111111rem;
    --spacing-m: calc(var(--gutter) * 2);
    --spacing-l: calc(var(--gutter) * 4);
    --h-contain: max(calc((100% - var(--max-width)) / 2), var(--h-spacing));
    --h-contain-no-bleed: max(calc((100% - var(--max-width)) / 2), var(--zero));
}
@media (min-width: 60em) {
    :root {
        --headline-100-size: 2.7777777778rem;
        --headline-200-size: 4rem;
        --headline-200-line: 1.1944;
        --headline-200-letter: -0.02em;
        --headline-200-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 5.5555555556rem;
        --headline-300-line: 1.15;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-400-size: 1.8888888889rem;
        --body-400-line: 1.1765;
    }
}
@media (min-width: 35em) {
    :root {
        --headline-100-size: 2.2222222222rem;
        --headline-100-line: 1;
        --headline-100-letter: -0.02em;
        --headline-100-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --headline-300-size: 2.7777777778rem;
        --headline-300-line: 1.2;
        --headline-300-letter: -0.02em;
        --headline-300-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --body-300-size: 1.1111111111rem;
        --body-300-line: 1.3;
    }
}
:root {
    --border-color: currentColor;
    --input-border-color: var(--text-color-medium);
    --hover-opacity: 0.33;
    --error-color: #ff4136;
    --accent-color: #2b5945;
    --accent10-color: rgba(43, 89, 69, .1);
    --accent05-color: rgba(43, 89, 69, .05);
    --accent05-opaque-color: #f4f7f6;
    background: var(--body-color);
    color: var(--text-color);
    --body-color: #fff;
    --body-color-medium: #f3f3f3;
    --body-color-light: #f9f9f9;
    --text-color: #1e2124;
    --text-color-medium: #636363;
    --text-color-light: #767676;
    --hover-color: rgba(30, 33, 36, var(--hover-opacity));
    --headline-100-size: 1.8888888889rem;
    --headline-100-line: 1;
    --headline-100-letter: normal;
    --headline-100-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-200-size: 1.8888888889rem;
    --headline-200-line: 1.1765;
    --headline-200-letter: normal;
    --headline-200-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --headline-300-size: 1.8888888889rem;
    --headline-300-line: 1.1765;
    --headline-300-letter: normal;
    --headline-300-family: "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --body-100-size: 0.8888888889rem;
    --body-100-line: 1.4286;
    --body-200-size: 1rem;
    --body-200-line: 1.3889;
    --body-300-size: 1rem;
    --body-300-line: 1.3;
    --body-400-size: 1.1111111111rem;
    --body-400-line: 1.3;
    --details-captions-size: 0.5555555556rem;
    --details-captions-line: 1.6;
    --details-captions-letter: 0.05em;
    --details-captions-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --details-earmark-family: "Alliance No.2", "Alliance No.1", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --form-placeholder-size: 0.7777777778rem;
}
html {
    font-size: 1.125em;
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}


