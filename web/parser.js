let SUBJECTS = {
    'h': 'Lịch Sử',
    'l': 'Ngữ văn',
    'p': 'Vật Lý'
}

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
                curQuestion.add('✔', true);
                curQuestion.add('✘', false);
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