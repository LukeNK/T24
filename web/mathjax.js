window.MathJax = {
    loader: {
        load: [
            'input/tex-base', 'output/chtml', 'ui/menu',
            '[tex]/ams'
        ]
    },
    tex: {
        packages: { '[+]': ['ams'] }
    },
    startup: {
        pageReady: () => {
            // note that this will prevent default behaviour
            if (typeof(loadQuiz) == 'function') loadQuiz();
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    script.async = true;
    document.head.appendChild(script);
});