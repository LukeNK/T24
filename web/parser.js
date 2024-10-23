const CHECKMARK = '✔',
    XMARK = '✘',
    WMARK = '●'; // wrong answer mark on the progress bar

let SUBJECTS = {
    'l': 'Ngữ Văn',
    'p': 'Vật Lý',
    'b': 'Sinh Học',
    'h': 'Lịch Sử',
    'g': 'Địa Lý',
    'e': 'Kinh Tế - Pháp Luật'
}

/**
 * A quiz object
 * @typedef {Object} Quiz
 * @property {Object} meta Key pair value of the meta of the quiz
 * @property {Question[]} questions An array of questions in the list
 */


class Question {
    constructor(text) {
        this.text = text;
        this.type = 0; // 0 multiple choice, 1 true/false, 2 flashcard
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
            } else {
                // multiple choices as default
                curQuestion.add(line);
            }
        } else if (line.trim().length > 3) {
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