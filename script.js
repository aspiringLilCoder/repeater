

//saveToLocal function
const saveToLocal = function() {
    localStorage.setItem('wordList', JSON.stringify(wordList));
}

//onload
let wordList = []

const object = JSON.parse(localStorage.getItem('wordList'));

if (localStorage.getItem('wordList')) {
    wordList = object;

    console.log('there is local todo list!');
    let localWordList = JSON.parse(localStorage.getItem('wordList'));
    for (const el in localWordList) {
        createWord(localWordList[el], true);
    }
}

//adding a new word
const addWordBtn = document.querySelector('#addWordBtn');
addWordBtn.addEventListener('click', () => {
    if (document.querySelector('#word').value == '') return;
    createWord(document.querySelector('#word').value);
    document.querySelector('#word').value = '';
});

function createWord(word, boo) {
    let div = document.createElement('div');
    div.classList.add('word');

    let p = document.createElement('p');
    p.classList.add('word-text');
    p.textContent = word;

    let svg = '<svg class="delete-word " onclick="deleteWord(this)" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    div.innerHTML = svg;
    div.appendChild(p);

    div.addEventListener('click', speak);

    document.querySelector('#words').appendChild(div);

    if (boo != true) {
        wordList.push(word);
        saveToLocal();
    }

}

//deleting a word

let wordDelete;

function deleteWord(e) {
    document.querySelector('.modal').style.display = 'block';
    wordDelete = e;
}

document.querySelector('#yes').addEventListener('click', () => {
    (wordDelete.parentNode).remove();
    const index = wordList.indexOf(wordDelete.nextElementSibling.textContent);
    wordList.splice(index, 1); 
    saveToLocal();
    document.querySelector('.modal').style.display = 'none';
    console.log('deleted');
})

document.querySelector('#no').addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'none';
    console.log('not deleted');
})

//resetSelected 
function resetSelected() {
    document.querySelectorAll('.word').forEach(el => {
        el.classList.remove('selected');
    });
}


//making a word speak

function speak(e) {
    if (e.target.tagName == 'svg' || e.target.tagName == 'line') {
        console.log('not safe');
    } else {
        let textValue = e.currentTarget.children[1].textContent;

        document.querySelector('#stop').addEventListener('click', stopText)

        const speedInput = document.getElementById('speed');
        const repeatInput = document.getElementById('repeat')

        const utterance = new SpeechSynthesisUtterance()

        playText(textValue)


        resetSelected();

        e.currentTarget.classList.add('selected');

        let currentCharacter;

        utterance.addEventListener('boundary', e => {
            currentCharacter = e.charIndex
        })

        function playText(text) {
            if (speechSynthesis.speaking) return
          
            if (repeatInput.value > 1) {
                let repeatedText = '';
                for (let i = 0; i < repeatInput.value; i++) {
                    repeatedText += ` ${text}`;
                }
                utterance.text = repeatedText;
            } else {
                utterance.text = text
            }
            utterance.rate = speedInput.value || 1
          
            speechSynthesis.speak(utterance)
            console.log(utterance.text);
          }

          function stopText() {
            speechSynthesis.cancel()
            resetSelected();
          }
          
    }
}

