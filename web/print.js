const list = document.querySelector('dl'),
    params = new URLSearchParams(document.location.search);
let MainSeed = 
    (~~params.get('seed'))
    || Date.now() % 10000;

function seedRand() {
    var x = Math.sin(MainSeed++) * 10000;
    return x - Math.floor(x);
}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(seedRand() * currentIndex);
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
document.getElementById('quiz').innerHTML = data.meta.name;
document.getElementById('subID').innerHTML = quizID[0];
document.getElementById('quizID').innerHTML = quizID[1];
let date = new Date();
document.getElementById('time').innerHTML =
    date.getFullYear() + '-'
    + date.getMonth().toString().padStart(2, '0') + '-'
    + date.getDate().toString().padStart(2, '0') + ' '
    + date.getHours().toString().padStart(2, '0') + ':'
    + date.getMinutes().toString().padStart(2, '0')
    + `<br>Seed: ${MainSeed.toString(16).toUpperCase()}`;
document.getElementById('questCount').innerHTML =
    data.questions.filter(v => v.type == 0).length + ' + '
    + data.questions.filter(v => v.type == 1).length + ' + '
    + data.questions.filter(v => v.type == 2).length + ' + '
    + data.questions.filter(v => v.type == 3).length;

// parse questions
data.questions.forEach(quest => {
    list.innerHTML += `<dt>${quest.text}</dt>`;

    // check sum
    MainSeed += quest.text.length;

    if (quest.type != 3) {
        // skip showing answer for short answer questions
        let letters = 'ABCD', order = 0;
        shuffle(Object.keys(quest.ans))
        .forEach(ans => {
            if (ans != CHECKMARK && ans != XMARK) {
                let insert = (quest.type == 1)?
                    order + 1 : letters[order]

                list.innerHTML += `<dd>${insert}. ${ans}</dd>`;
                if (!quest.ans[ans])
                    list.lastElementChild.classList.add('wAns');
                else
                    MainSeed += ans.length * (order + 1); // check sum correct answer

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
            answerKey += '◯◯—◯◯—◯◯—◯◯';
            break;
        case 3:
            answerKey += '<table><tr><td></td><td></td><td></td><td></td></tr></table';
            break;
    }
    list.innerHTML += answerKey + '</dd>';
});

document.querySelectorAll('details').forEach(e => e.setAttribute('open', 'true'))
document.getElementById('questCount').innerHTML += `<br>Checksum: ${MainSeed.toString(16).toUpperCase()}`;

})();

new QRCode(
    document.getElementById("qrcode"),
    'http://lukenk.github.io/T24' + window.location.hash);

let quoteID = Math.floor(Math.random() * Quotes.length);
document.querySelector('footer').innerHTML =
    `<hr>
    « ${Quotes[quoteID][1]} »<br>
    — ${Quotes[quoteID][0]}`;