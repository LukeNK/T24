const list = document.querySelector('dl');

(async () => {

let quizID = window.location.hash.substring(1);
quizID = quizID.replaceAll('-', '/') + '.html';

let data = await fetch('data/' + quizID);
data = await data.text();
data = parse(data);

data.questions.forEach(quest => {
    list.innerHTML += `<dt>${quest.text}</dt>`;
    Object.keys(quest.ans).forEach(ans => {
        if (quest.ans[ans] && ans != CHECKMARK)
            list.innerHTML += `<dd>${ans}</dd>`;
    })
});

document.querySelectorAll('details').forEach(e => e.setAttribute('open', 'true'))

})();