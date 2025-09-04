// console.log('JS connected');


function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const createElements = (arr) =>{
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`)

    return htmlElements.join(" ");
}


const showLoading = () => {
    document.getElementById('loading').classList.remove('hidden')
}
const hideLoading = () => {
    document.getElementById('loading').classList.add('hidden')
}


const lessonsPost = () => {
    showLoading(); // loading শুরু 
const url = `https://openapi.programming-hero.com/api/levels/all`;
fetch(url)
.then((response) => response.json() )
.then((data) => {
    displayLessons(data.data)
    hideLoading(); // data আসার পর loading বন্ধ হবে
})
    .catch(() => {
        hideLoading(); //error হলেও বন্ধ হবে
    })
}


const loadLevelWord = (id) =>{
    // console.log(id)
    const url = `https://openapi.programming-hero.com/api/level/${id}` // etuku support session e bujhe nibo sokal 11
    fetch(url)
    .then(response => response.json())
    .then(data => {
        removeActive()
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        // console.log(clickBtn)
        clickBtn.classList.add("active")
        displayLevelWord(data.data)
    })
}

// {
// "id": 4,
// "level": 5,
// "word": "Diligent",
// "meaning": "পরিশ্রমী",
// "pronunciation": "ডিলিজেন্ট"
// },
const displayLevelWord = (words) =>{
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = "";

    if(words.length === 0){
        wordContainer.innerHTML =`  
            <div class="text-center col-span-full p-5 space-y-3 rounded-xl"> 
            <img class ="mx-auto" src="./assetsss/alert-error.png" />
            <p class="font-bangla text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bangla text-4xl font-semibold">নেক্সট Lesson এ যান</h2>
            </div>
        ` ;
        return;
    }

    words.forEach(word => {
        // console.log(word)
        const card = document.createElement('div')
        card.innerHTML = ` 
                <div class="bg-white rounded-xl px-5 py-14 text-center space-y-4 h-full "> 
                <h2 class="font-bold text-3xl">${word.word ? word.word: 'শব্দ পাওয়া যায়নি'}</h2>
                <p class="text-lg">Meaning / Pronunciation</p>
                <h2 class="font-bangla font-semibold text-2xl">"${word.meaning ? word.meaning : 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation: 'pronunciation পাওয়া যায়নি'}"</h2>
                <div class="flex justify-between"> 
                    <button onclick="loadWordDetails(${word.id})" class="bg-[#1A91FF20] p-3 hover:bg-[#1A91FF80] cursor-pointer rounded-lg"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="bg-[#1A91FF20] p-3 hover:bg-[#1A91FF80] cursor-pointer rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `
        wordContainer.appendChild(card)
    })
}

const loadWordDetails = async (id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const details = await res.json()
    displayLoadWordDetails(details.data)
}
const displayLoadWordDetails = (word) =>{
    const detailsContainer = document.getElementById('details-container')
    detailsContainer.innerHTML = `  
    
            <div> 
        <h2 class="text-3xl font-bold ">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
      </div>
      <div> 
        <h2 class="font-semibold text-xl">Meaning</h2>
        <p class="font-bangla text-lg">${word.meaning}</p>
      </div>
      <div> 
        <h2 class="font-semibold text-xl">Example</h2>
        <p class="text-lg">${word.sentence}</p>
      </div>
      <div> 
        <h2 class="font-semibold text-xl font-bangla">সমার্থক শব্দ গুলো</h2>
        <div>${createElements(word.synonyms)}</div>
      </div>
      <div> 
        <button class="btn btn-success">Complete Learning</button>
      </div>
    
    
    `
    document.getElementById('word_modal').showModal()
   
}


const removeActive = () =>{
    const lessonButtons = document.querySelectorAll('.lesson-btn')
    lessonButtons.forEach(button => {
        button.classList.remove('active')
    });
}
    

const displayLessons = lessons => {
    
    //1.
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = "";

    lessons.forEach(lesson => {
        // console.log(lesson);
        //2.
        const createElement = document.createElement('div')
        createElement.innerHTML = `  
            <button class="lesson-btn" id="lesson-btn-${lesson.level_no}" onclick ="loadLevelWord(${lesson.level_no})" ><li  class="btn btn-outline btn-primary">
            <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</li></button>
        `
        //3.
        levelContainer.appendChild(createElement)
    });
}

lessonsPost();

                                // Input Search 
document.getElementById('btn-search').addEventListener('click', () => {
    removeActive();
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    // console.log(searchValue);

    const url = `https://openapi.programming-hero.com/api/words/all`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const allWords = data.data
        // console.log(allWords)
        const filterWords = allWords.filter((word) => {
              return word.word.toLowerCase().includes(searchValue);
        });
        displayLevelWord(filterWords);
    })
});

