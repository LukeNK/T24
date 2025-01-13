const CHECKMARK = '✔',
    XMARK = '✘',
    WMARK = '●'; // wrong answer mark on the progress bar

let SUBJECTS = {
    'm': 'Les maths',
    'p': 'La physique',
    'l': 'La littérature',
    'b': 'La biologie',
    'g': 'La geographie',
    'h': "L'histoire",
    'e': "L'économique",

    'c': 'Collège',

    'f': 'Français',
}

function decodeEntities(html) {
    // function to decode HTML entities
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

/**
 * A quiz object
 * @typedef {Object} Quiz
 * @property {Object} meta Key pair value of the meta of the quiz
 * @property {Question[]} questions An array of questions in the list
 */


class Question {
    constructor(text) {
        this.text = text;
        this.type = 0; // 0 multiple choice, 1 true/false, 2 flashcard, 3 short answer
        this.ans = {};

        return this;
    }
    add(answer, correct) {
        if (
            correct === undefined
            && this.type === 0
            && Object.keys(this.ans) == 0
        )
            correct = true; // default first answer as correct

        this.ans[answer] = correct || false;

        return this;
    }
}

/**
 * Parse result according to format
 * @param {String} data
 * @returns {Quiz} The result quiz after parsing
 */
function parse(data) {
    let questions = [], meta = {},
        curQuestion;

    // clean absolute path
    data = data.replaceAll('<img src="/', '<img src="');
    // clean HTML entities so the result can check directly from innerHTML
    data = decodeEntities(data);

    data = data + '\nEND-OF-INPUT, OVERFLOW FOR SAVING LAST QUESTION';
    data = data.split('\n');

    data.forEach((line, lineNumber) => {
        if (line.trim() == '' || line.trim().startsWith('//')) {
            // empty line and comment
            return;
        } else if (line[0] == '#') {
            // quiz name
            meta.name = line.substring(1).trim();
        } else if (line.trim().startsWith('<')) {
            // html code, ignore white space, only apply to question text
            curQuestion.text += line;
        } else if (line.startsWith('    ') || line.startsWith('\t')) {
            // answer
            line = line.trim();
            if (line.startsWith('+') || line.startsWith('-')) {
                // true false
                curQuestion.type = 1;
                curQuestion.add(
                    line.substring(1).trim(),
                    line[0] == "+" ? true : false
                );
            } else if (line.startsWith('>')) {
                // flashcard
                curQuestion.type = 2;
                curQuestion.text =
                    `<details>
                        <summary>${curQuestion.text}</summary>
                        ${line.substring(1).trim()}`; // will close when push
                curQuestion.add(CHECKMARK, true);
                curQuestion.add(XMARK, false);
            } else if (line.startsWith('=')) {
                curQuestion.type = 3;
                curQuestion.add(line.substring(1).trim(), true);
            } else if (line.startsWith('_')) {
                // space for written response
                curQuestion.writeLine = Number(line.substring(1).trim());
            } else {
                // multiple choices as default
                curQuestion.add(line);
            }
        } else if (line.trim().length >= 1) {
            // new question
            if (curQuestion) {
                if (curQuestion.type == 2)
                    curQuestion.text += '</details>';
                questions.push(curQuestion); // only push if there is an old question
            }
            curQuestion = new Question(line);
        } else {
            throw SyntaxError('Parser code failure at ' + lineNumber + '\n' + line);
        }
    });

    return { meta, questions }
}