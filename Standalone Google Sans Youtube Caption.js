// ==UserScript==
// @name         Standalone GoogleSans YouTube Captions
// @namespace    Violentmonkey Script
// @description  Force Custom Google Sans globally and lock YouTube captions to the same font
// @version      1.0
// @match        *://*/*
// @author       iamhaunt
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     myFont https://raw.githubusercontent.com/iamhaunt/greasy-fork-fonts/main/GoogleSans.woff2
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const fontUrl = GM_getResourceURL('myFont');
    const fontName = 'CustomGoogleSans';

    const css = `
        @font-face {
            font-family: '${fontName}';
            src: url('${fontUrl}') format('woff2');
            font-display: swap;
        }

        *:not(i):not([class*="icon"]):not([class*="fa"]):not([class*="material-icons"]):not([class*="symbol"]):not(svg):not(path) {
            font-family: '${fontName}', sans-serif !important;
        }

        .ytp-caption-segment,
        .ytp-caption-segment *,
        .caption-window,
        .caption-visual-line {
            font-family: '${fontName}', sans-serif !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    if (window.location.hostname.includes('youtube.com')) {
        const fixCaptions = () => {
            const segments = document.querySelectorAll('.ytp-caption-segment');
            for (let i = 0; i < segments.length; i++) {
                if (segments[i].style.fontFamily !== `'${fontName}', sans-serif`) {
                    segments[i].style.setProperty('font-family', `'${fontName}', sans-serif`, 'important');
                }
            }
        };

        const observer = new MutationObserver(fixCaptions);

        const startObserver = () => {
            const target = document.body || document.documentElement;
            if (target) {
                observer.observe(target, { childList: true, subtree: true });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserver);
        } else {
            startObserver();
        }
    }
})();