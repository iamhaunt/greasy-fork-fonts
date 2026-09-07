// ==UserScript==
// @name         Universal Google Sans
// @namespace    Violentmonkey Script
// @description  Apply Google Sans Universally (Including YouTube Captions)
// @version      v1.0
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
        .caption-window,
        .caption-visual-line,
        .ytp-caption-window-bottom,
        .ytp-caption-window-rollup {
            font-family: '${fontName}', sans-serif !important;
        }
    `;

    GM_addStyle(css);

    const forceCaptionFont = (node) => {
        if (!node || node.nodeType !== 1) return;
        
        if (node.classList && (node.classList.contains('ytp-caption-segment') || node.classList.contains('caption-window'))) {
            node.style.setProperty('font-family', `'${fontName}', sans-serif`, 'important');
        }

        const segments = node.querySelectorAll ? node.querySelectorAll('.ytp-caption-segment, .caption-window, .caption-visual-line') : [];
        for (let i = 0; i < segments.length; i++) {
            segments[i].style.setProperty('font-family', `'${fontName}', sans-serif`, 'important');
        }
    };

    const inject = (t) => {
        if (!t || t.querySelector(`style[data-f="${fontName}"]`)) return;
        const s = document.createElement('style');
        s.setAttribute('data-f', fontName);
        s.textContent = css;
        t.appendChild(s);
    };

    const process = (n) => {
        if (n.nodeType !== 1) return;
        
        forceCaptionFont(n);

        if (n.shadowRoot) {
            inject(n.shadowRoot);
            forceCaptionFont(n.shadowRoot);
        }

        const children = n.querySelectorAll('*');
        for (let i = 0; i < children.length; i++) {
            if (children[i].shadowRoot) {
                inject(children[i].shadowRoot);
                forceCaptionFont(children[i].shadowRoot);
            }
        }
    };

    new MutationObserver(ms => {
        for (let i = 0; i < ms.length; i++) {
            const added = ms[i].addedNodes;
            for (let j = 0; j < added.length; j++) process(added[j]);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    process(document.documentElement);
})();
