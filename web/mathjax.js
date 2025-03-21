window.MathJax = {
    loader: {
        load: [
            'input/tex-base', 'output/chtml', 'ui/menu',
            '[tex]/ams'
        ]
    },
    tex: {
        packages: { '[+]': ['ams'] }
    }
};

(function () {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);
})();