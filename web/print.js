const list = document.querySelector('dl');
let checksum = 0;

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

let quizID = window.location.hash.substring(1) || prompt('Please input test ID');
quizID = quizID.replaceAll('-', '/') + '.html';

let data = await fetch('data/' + quizID);
data = await data.text();
for (const i in data) checksum ^= data[i].charCodeAt(0);
data = parse(data);

// set header
quizID = quizID.split('/');
document.getElementById('quiz').innerHTML = data.meta.name;
document.getElementById('subID').innerHTML = quizID[0][0];
document.getElementById('quizID').innerHTML = quizID[1].split('.')[0];
let date = new Date();
document.getElementById('time').innerHTML =
    date.getFullYear() + '-'
    + date.getMonth().toString().padStart(2, '0') + '-'
    + date.getDate().toString().padStart(2, '0') + ' '
    + date.getHours().toString().padStart(2, '0') + ':'
    + date.getMinutes().toString().padStart(2, '0')
    + `<br>Data: ${checksum.toString(16).toUpperCase()}`;
document.getElementById('questCount').innerHTML =
    data.questions.filter(v => v.type == 0).length + ' + '
    + data.questions.filter(v => v.type == 1).length + ' + '
    + data.questions.filter(v => v.type == 2).length + ' + '
    + data.questions.filter(v => v.type == 3).length;

checksum = 0; // reset for answer checksum
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
                if (quest.ans[ans])
                    for (const char of ans) checksum ^= char.charCodeAt(0);
                else
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
            answerKey += '◯◯—◯◯—◯◯—◯◯';
            break;
        case 3:
            answerKey += '<table><tr>';
            // get the longest answer, minimum is 4
            let ansLen = 4;
            Object.keys(quest.ans).forEach(e => {
                if (e.length > ansLen)
                    ansLen = e.length;
            });
            for (; ansLen > 0; ansLen--)
                answerKey += '<td></td>'
            answerKey += '</tr></table>';
            break;
    }
    list.innerHTML += answerKey + '</dd>';
});

document.querySelectorAll('details').forEach(e => e.setAttribute('open', 'true'))
document.getElementById('questCount').innerHTML += `<br>Réponses: ${checksum.toString(16).toUpperCase()}`;

})();

new QRCode(
    document.getElementById("qrcode"),
    'http://lukenk.github.io/T24' + window.location.hash);

let quoteID = Math.floor(Math.random() * Quotes.length);
document.querySelector('footer').innerHTML =
    `<hr>
    « ${Quotes[quoteID][1]} »<br>
    — ${Quotes[quoteID][0]}`;