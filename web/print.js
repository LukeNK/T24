const list = document.querySelector('dl');

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

(async () => {

let quizID = window.location.hash.substring(1);
if (!window.location.hash.substring(1)) window.location.href = 'https://lukenk.github.io/T24';
quizID = quizID.replaceAll('-', '/') + '.html';

let data = await fetch('data/' + quizID);
data = await data.text();
data = parse(data);

// set header
document.getElementById('quiz').innerHTML =
    `[${SUBJECTS[quizID[0]]}] ` + data.meta.name;
document.getElementById('subID').innerHTML = quizID[0];
document.getElementById('quizID').innerHTML = quizID[1];
document.getElementById('questCount').innerHTML =
    data.questions.filter(v => v.type == 0).length + ' + '
    + data.questions.filter(v => v.type == 1).length + ' + '
    + data.questions.filter(v => v.type == 2).length + ' + '
    + data.questions.filter(v => v.type == 3).length;

document.getElementById('totalCount').innerHTML = data.questions.length;

data.questions.forEach(quest => {
    list.innerHTML += `<dt>${quest.text}</dt>`;

    if (quest.type != 3) {
        // skip showing answer for short answer questions
        let letters = 'ABCD', order = 0;
        shuffle(Object.keys(quest.ans)).forEach(ans => {
            if (ans != CHECKMARK && ans != XMARK) {
                let insert = (quest.type == 1)?
                    order + 1 : letters[order]

                list.innerHTML += `<dd>${insert}. ${ans}</dd>`;
                if (!quest.ans[ans])
                    list.lastElementChild.classList.add('wAns');

                order++
            }
        })
    }

    let answerKey = '<dd class="wAns" style="text-align: right;">';
    switch (quest.type) {
        case 0:
            answerKey += '◯ ◯ ◯ ◯';
            break;
        case 1:
            answerKey += '◯◯ ◯◯ ◯◯ ◯◯';
            break;
        case 3:
            answerKey += '<table><tr><td></td><td></td><td></td><td></td></tr></table';
            break;
    }
    list.innerHTML += answerKey + '</dd>';
});

document.querySelectorAll('details').forEach(e => e.setAttribute('open', 'true'))

})();

new QRCode(
    document.getElementById("qrcode"),
    'http://lukenk.github.io/T24' + window.location.hash);

let date = new Date();
document.getElementById('time').innerText =
    date.getFullYear() + '-'
    + date.getMonth().toString().padStart(2, '0') + '-'
    + date.getDate().toString().padStart(2, '0') + ' '
    + date.getHours().toString().padStart(2, '0') + ':'
    + date.getMinutes().toString().padStart(2, '0');

let quoteID = Math.floor(Math.random() * Quotes.length);
document.querySelector('footer').innerHTML =
    `<hr>
    « ${Quotes[quoteID][1]} »<br>
    — ${Quotes[quoteID][0]}`;