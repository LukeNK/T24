const CHECKMARK = '✔',
    XMARK = '✘',
    WMARK = '●'; // wrong answer mark on the progress bar

let SUBJECTS = {
    'l': 'Ngữ Văn',
    'p': 'Vật Lý',
    'h': 'Lịch Sử',
    'g': 'Địa Lý',
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
        this.type = 0; // 0 for multiple choice, 1 for true/false
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
        if (line == '')
            return; // skip empty lines
        else if (line[0] == '#')
            meta.name = line.substring(1).trim();
        else if (line.startsWith('    ') || line.startsWith('\t')) {
            line = line.trim();
            if (line.startsWith('+') || line.startsWith('-')) {
                curQuestion.type = 1;
                curQuestion.add(
                    line.substring(1).trim(),
                    line[0] == "+" ? true : false
                );
            } else if (line.startsWith('>')) {
                // flashcard
                curQuestion.text =
                    `<details>
                        <summary>${curQuestion.text}</summary>
                        ${line.substring(1).trim()}
                    </details`;
                curQuestion.add(CHECKMARK, true);
                curQuestion.add(XMARK, false);
            } else
                curQuestion.add(line);
        } else if (line.trim().length > 3) { // new question, check length just to be sure
            if (curQuestion)
                questions.push(curQuestion); // only push if there is an old question
            curQuestion = new Question(line);
        } else
            throw SyntaxError('Parser code failure at ' + lineNumber + '\n' + line);
    });

    return { meta, questions }
}