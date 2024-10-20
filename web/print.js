const list = document.querySelector('dl');

(async () => {

let quizID = window.location.hash.substring(1);
if (!window.location.hash.substring(1)) window.location.href = 'https://lukenk.github.io/T24';
quizID = quizID.replaceAll('-', '/') + '.html';

let data = await fetch('data/' + quizID);
data = await data.text();
data = parse(data);

document.getElementById('quiz').innerHTML =
    `[${SUBJECTS[quizID[0]]}] ` + data.meta.name;

data.questions.forEach(quest => {
    list.innerHTML += `<dt>${quest.text}</dt>`;
    Object.keys(quest.ans).forEach(ans => {
        if (ans != CHECKMARK && ans != XMARK) {
            list.innerHTML += `<dd>${ans}</dd>`;
            if (!quest.ans[ans])
                list.lastElementChild.classList.add('wAns');
        }
    })
});

document.querySelectorAll('details').forEach(e => e.setAttribute('open', 'true'))

})();

new QRCode(
    document.getElementById("qrcode"),
    'http://lukenk.github.io/T24' + window.location.hash);

let quoteID = Math.floor(Math.random() * Quotes.length);
document.querySelector('footer').innerHTML =
    `<hr>
    « ${Quotes[quoteID][1]} »<br>
    — ${Quotes[quoteID][0]}`;
