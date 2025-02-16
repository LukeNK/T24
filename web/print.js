const list = document.querySelector('dl');
let quizID = window.location.hash.substring(1) || prompt('Please input test ID');
    seed = '',
    random = '', // placeholder for global function
    checksum = 0;

quizID = quizID.split('-');

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

let loadQuiz = async () => {
    // clear
    list.innerHTML = '';
    checksum = 0;

    // load data
    let data = await fetch('data/' + quizID.join('/') + '.html');
    data = await data.text();
    for (const i in data) checksum ^= data[i].charCodeAt(0);
    checksum = checksum.toString(16).toUpperCase();
    data = parse(data);

    // set header
    document.getElementById('quiz').innerHTML = data.meta.name;
    document.getElementById('subID').innerHTML = quizID[0][0];
    document.getElementById('quizID').innerHTML = quizID[1];
    let date = new Date();
    document.getElementById('time').innerHTML =
        date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0') + ' '
        + date.getHours().toString().padStart(2, '0') + ':'
        + date.getMinutes().toString().padStart(2, '0')
        + '<br>Checksum: ' + checksum;
    document.getElementById('questCount').innerHTML =
        data.questions.filter(v => v.type == 0).length + ' + '
        + data.questions.filter(v => v.type == 1).length + ' + '
        + data.questions.filter(v => v.type == 2).length + ' + '
        + data.questions.filter(v => v.type == 3).length;

    // first time use checksum, if user reloads then ask for seed
    seed = seed? prompt('Please input seed') : checksum;
    random = new Math.seedrandom(seed);

    checksum = 0; // reset for answer checksum
    data.questions.forEach((quest, questNum) => {
        // display question, no number for flashcards
        if (quest.type == 2)
            list.innerHTML += `<dt>${quest.text}</dt>`;
        else {
            questNum = quest.num || questNum; // question number
            list.innerHTML += `<dt>${questNum}⟩ ${quest.text}</dt>`;
        }

        // get the longest answer, minimum is 4
        let ansLen = 4;
        Object.keys(quest.ans).forEach(e => {
            if (e.length > ansLen)
                ansLen = e.length;
        });

        if (quest.type != 3) {
            // skip showing answer for short answer questions
            let letters = 'ABCD', order = 0;
            shuffle(Object.keys(quest.ans)).forEach(ans => {
                if (ans != CHECKMARK && ans != XMARK) {
                    let insert = (quest.type == 1)?
                        order + 1 : letters[order]

                    let dd = document.createElement('dd');
                    dd.innerHTML = `${insert}. ${ans}`;
                    if (ansLen > 30) dd.classList.add('long');
                    else if (ansLen > 15) dd.classList.add('mid');

                    list.appendChild(dd);

                    if (quest.ans[ans])
                        for (const char of ans) checksum ^= char.charCodeAt(0);
                    else
                        list.lastElementChild.classList.add('wAns');

                    order++
                }
            })
        } else {
            let answers = '';
            Object.keys(quest.ans).forEach(ans => answers += ans + ' ' );
            list.innerHTML += `<dd class="sAns"> = ${answers}</dd>`;
        }

        let answerSpace = '<dd class="wAns" style="text-align: right; flex-basis: 100%;">';
        switch (quest.type) {
            case 0:
                answerSpace += '◯ ◯ ◯ ◯';
                break;
            case 1:
                answerSpace += '◯◯—◯◯—◯◯—◯◯';
                break;
            case 3:
                answerSpace += '<table><tr>';
                for (; ansLen > 0; ansLen--)
                    answerSpace += '<td></td>'
                answerSpace += '</tr></table>';
                break;
        }
        if (quest.writeLine)
            for (; quest.writeLine > 0; quest.writeLine--)
                answerSpace += '<hr class=""wAns>';

        list.innerHTML += answerSpace + '</dd>';
    });

    document.title = '[' + quizID.join('-').toUpperCase() + '] ' + data.meta.name;
    document.querySelectorAll('details').forEach(e => e.setAttribute('open', 'true'))
    document.getElementById('time').innerHTML += ' / ' + checksum.toString(16).toUpperCase()
    document.getElementById('questCount').innerHTML += `<br>Code de réponse: ${seed}`;
};
loadQuiz();

new QRCode(
    document.getElementById("qrcode"),
    'http://lukenk.github.io/T24' + window.location.hash);

let quoteID = Math.floor(Math.random() * Quotes.length);
document.querySelector('footer').innerHTML =
    `<hr>
    « ${Quotes[quoteID][1].replaceAll('\n', '<br>')} »<br>
    — ${Quotes[quoteID][0]}`;