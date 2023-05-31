
var activeSelectX, isOnMobile;
var S_EXTENDED = true;

var pageElements = [...document.querySelectorAll('page:not([class="auxPage"])')];
var pageAuxElements = [...document.querySelectorAll('page.auxPage')];
var scrollTooltips = document.getElementsByClassName('scrollTooltip');
var surveyNavLinks = document.getElementsByClassName('surveyNavLink');

var currentNormalPageIndex = 0, currentPage = pageElements[0], currentNavlink, navlinks = [];

var siteStructure = [
    {
        chTitle: "",
        pages: [
            ["Приветствие", 0]
        ]
    },
    {
        chTitle: "Основы",
        pages: [
            ["Пиксель", 1],
            ["Разрешение", 2],
            ["Цвета", 3],
            ["Виды графики", 4],
            ["Больше фракталов!", 100, S_EXTENDED],
            ["Сжатие", 5],
            ["Файлы, форматы и расширения", 6],
        ]
    },
    {
        chTitle: "Форматы",
        pages: [
            ["BMP", 7],
            ["GIF", 8],
            ["TIFF", 9],
            ["PNG", 10],
            ["JPEG", 11],
            ["WebP", 12],
            ["HEIF", 13],
            ["AVIF", 14],
            ["RAW", 15],
        ]
    },
    {
        chTitle: "Сравнение и итоги",
        pages: [
            ["Сравнение", 16],
            ["Что делать дальше", 17],
            ["Инструкция по Squoosh", 101, S_EXTENDED],
        ]
    }
];


function goToPage(index) {
    let navTempIndex = index;
    if (index === '+') navTempIndex = currentNormalPageIndex+1;
    if (currentNavlink) {
        currentNavlink.classList.remove('navlink_current');
    }
    let targetNavlink = navlinks.find((element => element.pageid == navTempIndex));
    if (targetNavlink) {
        targetNavlink.classList.add('navlink_current');
        targetNavlink.classList.add('navlink_completed');
        currentNavlink = targetNavlink;
    }
    for (let element of pageElements) {
        element.classList.add('page_displaynone');
    }
    for (let element of pageAuxElements) {
        element.classList.add('page_displaynone');
    }
    for (let videoElement of currentPage.getElementsByTagName('video')) {
        videoElement.oncansee = () => {}
    }
    for (let galleryElement of currentPage.getElementsByTagName('gallery')) {
        galleryElement.galleryInt.autoScrollInterval.pause();
    }
    if (index >= 100) {
        index -= 100;
        currentPage = pageAuxElements[index];
        document.body.classList.add('onAuxPage');
    }
    else {
        if (index === '+') index = currentNormalPageIndex+1;
        currentPage = pageElements[index];
        currentNormalPageIndex = index;
        document.body.classList.remove('onAuxPage');
        let progress = Math.round((index / (pageElements.length-1))*100) / 100;
        navbar_progress_text.innerText = progress * 100 + "% пройдено";
        navbar_progress_bar.value = progress;
    }
    currentPage.classList.remove('page_displaynone');
    for (let videoElement of currentPage.getElementsByTagName('video')) {
        videoElement.oncansee = () => {
            videoElement.play();
        }
        videoScrollAutoPlayPause(videoElement, window.innerHeight);
        currentPage.onscroll = () => {
            videoScrollAutoPlayPause(videoElement, window.innerHeight);
        }
    }
    for (let galleryElement of currentPage.getElementsByTagName('gallery')) {
        galleryElement.galleryInt.autoScrollInterval.resume();
    }
}

function getParentPage(element) {
    var current = element;
    while (current.tagName != "PAGE" || current.tagName != "HTML") {
        current = current.parentElement;
    }
    return current;
}

function checkClickPath(etarget, searchFor) {
    if (etarget == searchFor || etarget.parentElement == searchFor || etarget.parentElement.parentElement == searchFor) return true
    else return false;
}

window.onclick = (event) => {
	if ( checkClickPath(event.target, navOpenButton) ) document.body.classList.add('navbarVisible')
	else if (!checkClickPath(event.target, navbar) || checkClickPath(event.target, navbar_header_closeButton)) document.body.classList.remove('navbarVisible')
}

auxBackButton.onclick = () => {
    goToPage(currentNormalPageIndex);
}

[...document.getElementsByTagName('d')].forEach(element => {
    element.addEventListener('click', () => {
        element.classList.toggle('dExpl_opened');
        document.body.classList.remove('explNotUsed')
    })
});

// Max inclusive
function getRandomInt(min = 0, max = 512) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getExpandedNotation(number, base) {
    let base10 = 0;
    let digits = number.toString().split('');
    let part1 = '';
    let part2 = '';
    let part3 = '';
    let i = digits.length-1;
    for (let entry of digits) {
        part1 += `${entry} * ${base}^${i}`;
        part2 += `${entry} * ${Math.pow(base, i)}`;
        part3 += `${entry * Math.pow(base, i)}`;
        base10 += entry * Math.pow(base, i);
        if (i != 0) {
            part1 += " + ";
            part2 += " + ";
            part3 += " + ";
        }
        i--;
    }
    let tempString = `${number}@${base} = ${part1} = ${part2} = ${part3} = ${base10}@10`;
    return tempString;
}


function completeStringWithZeroes(input, targetLength) {
    if (typeof input == 'number') input = input.toString();
    if (targetLength <= input.length) return input;
    if (targetLength == 12) console.log(targetLength, input.length);
    let tempString = '';
    for (let i = 0; i < targetLength - input.length; i++) {
        tempString += '0';
    }
    return tempString + input;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log(Math.floor(window.outerHeight / 48));

    function generateHTMLContentForMarquee() {
        let titleBackground_tempString = ``;
        let fontSize = 12;
        let bases = [2, 8, 10, 16, 36];
        for (let i = 0; i < Math.floor(window.outerHeight / 2 / (56+16)); i++) {
            let tempString = "";
            for (let b = 0; b < 12; b++) {
                let currentBase = bases[getRandomInt(0, 4)]
                let random = getRandomInt(24, 4095);
                tempString += `<marquee_element class="titleScreen_marqueeElement_base${currentBase}">${completeStringWithZeroes(random.toString(currentBase).toUpperCase(), 4)}</marquee_element>`;
            }
            titleBackground_tempString += `<div class="titleScreen_marqueeLine titleScreen_marqueeLine_mode${i%2}" style="font-size: ${fontSize}px">
                <div class="marquee">
                    <div class="marquee__inner" aria-hidden="true">
                        <span>${tempString}</span><span>${tempString}</span><span>${tempString}</span><span>${tempString}</span>
                    </div>
                </div>
            </div>`;
            fontSize += 6;
        }
        return titleBackground_tempString;
    }

    
    [...document.querySelectorAll('.titleScreen_marqueeGroup')].forEach(element => element.innerHTML = generateHTMLContentForMarquee());
});

titleScreen_startButton_button.addEventListener('click', () => {
    let scaleFactor;
    let rectInfo = titleScreen_startButton_pageTransitionRipple.getBoundingClientRect()
    if (window.innerHeight > window.innerWidth) {
        scaleFactor = (window.innerHeight + rectInfo.bottom * 2) * 1.5;
    }
    else {
        scaleFactor = (window.innerWidth + rectInfo.left * 2) * 1.5;
    }
    titleScreen_startButton_pageTransitionRipple.style.transform = `scale(${scaleFactor})`;
    document.body.classList.add('titlescreenRippleTransitionActive');
    setTimeout(() => {
        titleScreen_startButton_pageTransitionRipple.style.transform = '';
        document.body.classList.remove('titlescreenRippleTransitionActive');
    }, 3000);
    setTimeout(() => {
        goToPage(1);
    }, 2500);
});

function division_getRemainders(number, divider) {
    let remainder = number % divider;
    let remainders = [];
    while (number >= divider) {
        remainders.push(remainder);
        number = ~~(number / divider);
        remainder = number % divider;
    }
    return remainders;
}

function division_getResults(number, divider) {
    let remainder = number % divider;
    let results = [];
    results.push(number);
    while (number >= divider) {
        number = ~~(number / divider);
        results.push(number);
        remainder = number % divider;
    }
    return results;
}

function getConversionVisualization_10toN(number, radix) {
    let results = division_getResults(number, radix);
    let remainders = division_getRemainders(number, radix);
    let tableElements = [];
    let table = document.createElement('table');
    table.className = "visualization_10toN";
    for (let a = 0; a < results.length+1; a++) {
        let row = document.createElement('tr');
        let rowElements = [];
        for (let b = 0; b < results.length; b++) {
            let cell = document.createElement('td');
            rowElements.push(cell);
            row.appendChild(cell);
        }
        tableElements.push(rowElements);
        table.appendChild(row);
    }
    for (let a = 0; a < results.length-1; a++) {
        let remainder = results[a] - (radix * results[a+1]);
        tableElements[a][a].innerHTML = results[a];
        tableElements[a][a+1].innerHTML = radix + `<div class="lineLeft"></div><div class="lineTop"></div>`;
        tableElements[a+1][a].innerHTML = radix * results[a+1]+ `<div class="cornerOperationSymbol">-</div>`;
        if (remainder > 9) {
            tableElements[a+2][a].innerHTML = `${remainder.toString(radix)} (${remainder})<div class="cornerOperationSymbol">=</div>`;
        }
        else {
            tableElements[a+2][a].innerHTML = remainder + `<div class="cornerOperationSymbol">=</div>`;
        }
        //tableElements[a][a+1].classList.add("divisionCell_divider");
        //tableElements[a][a].classList.add("divisionCell_result");
        tableElements[a+2][a].classList.add("blink");
        tableElements[a+2][a].style.animationDelay = `0.${results.length-a}s`
        if (a != 0) {
            tableElements[a][a].innerHTML = results[a] + `<div class="lineLeft"></div>`;
        }
    }
    let lastIndex = results.length-1;
    tableElements[lastIndex][lastIndex].innerHTML = results[lastIndex] + `<div class="lineLeft"></div>`;
    tableElements[lastIndex][lastIndex].classList.add("blink");
    return table;
}

/*
function getConversionVisualization_Nto10(number, radix) {
    let tempString = `${number}<sub>${radix}</sub> = `;
    let components = [];
    for (let i = number.length-1; i >= 0; i--) {
        let digit = number[number.length-1-i];
        components.push(`${parseInt(digit, radix)} × ${radix}<sup>${i}</sup>`);
    }
    tempString += components.join(' + ') + " = ";
    components = [];
    for (let i = 0; i < number.length; i++) {
        let digit = number[number.length-1-i];
        components.push(`${parseInt(digit, radix)} × ${radix * i}`);
    }
    tempString += components.join(' + ') + " = ";
    components = [];
    for (let i = 0; i < number.length; i++) {
        let digit = number[number.length-1-i];
        components.push(`${parseInt(digit, radix) * radix * i}`);
    }
    tempString += components.join(' + ') + " = ";
    tempString += `${parseInt(number, radix)}<sub>10</sub>`;
    let element = document.createElement('div');
    element.innerHTML = tempString;
    return element;
}
*/


function getConversionVisualization_Nto10(number, radix) {
    let digits = number.toString();
    let letterDecodings = [];
    let partContents = [`${number}<sub>${radix}</sub>`, ``, ``, ``, ``, `${parseInt(digits, radix)}<sub>10</sub>`];
    let i = digits.length-1;
    for (let digit of digits) {
        let decimal = parseInt(digit, radix);
        if (decimal.toString() != digit) letterDecodings.push(`${digit}<sub>${radix}</sub> = ${decimal}`);
        partContents[2] += `${decimal} × ${radix}<sup>${i}</sup>`;
        partContents[3] += `${decimal} × ${Math.pow(radix, i)}`;
        partContents[4] += `${decimal * Math.pow(radix, i)}`;
        if (i != 0) {
            partContents[2] += " + ";
            partContents[3] += " + ";
            partContents[4] += " + ";
        }
        i--;
    }
    if (letterDecodings.length == 0) partContents.splice(1, 1);
    else partContents[1] = `| ${letterDecodings.join(', ')} |`;

    let parentElement = document.createElement('div');
    parentElement.className = "visualization_Nto10";
    i = 0;
    partContents.forEach(part => {
        let element = document.createElement('div');
        if (i != 0) element.innerHTML = " = ";
        element.innerHTML += part;
        i += 1;
        parentElement.appendChild(element);
    })
    return parentElement;
}


mediaContent_unary2_input.addEventListener('input', (e) => {
    let tempString = "";
    let value = parseInt(e.target.value);
    for (let i = 0; i < value; i++) {
        tempString += "1";
    }
    console.log(value);
    mediaContent_unary2_result.innerText = tempString;
    //mediaContent_unary2_result.style.fontSize = 90000 / (value + 1000) + "px";
})


const digits = "0123456789";
const alphabet = "abcdefghijklmnopqrstuvwxyz";

class MediaConvertSide {

    #currentBase;

    set currentBase(value) {
        if (value > 36 || value < 2) return;
        var decimalNumber = parseInt(this.input.value, this.#currentBase);
        this.#currentBase = value;
        this.inputCurrentBase.innerText = `${value} (0-${(value-1).toString(value)})`;
        [...this.baseButtons.children].forEach(element => {
            if (element.innerText == value.toString()) element.classList.add('active');
            else element.classList.remove('active');
        });

        let newPatternString;
        alphabet.indexOf((value-1).toString(value))
        if (value <= 10) {
            newPatternString = `[0-${digits[value-1]}]+`;
        }
        else if (value > 10) {
            newPatternString = `[a-${alphabet[value-11]}A-${alphabet[value-11].toUpperCase()}\\d]+`;
        }
        this.input.setAttribute('pattern', newPatternString);

        let newMaxLength = 0;
        if (value > 24) newMaxLength = 4;
        else if (value > 12) newMaxLength = 5;
        else if (value > 8)  newMaxLength = 6;
        else if (value > 2)  newMaxLength = 8;
        else if (value == 2) newMaxLength = 16;
        this.input.setAttribute('maxLength', newMaxLength);

        if (decimalNumber) {
            this.input.value = decimalNumber.toString(this.#currentBase);
        }
        else {
            this.input.value = '0';
        }
        this.input.previousValue = '0';
        this.onChange();
    }
    get currentBase() {
        return this.#currentBase;
    }

    onChange;

    constructor(idPrefix, classPrefix, defaultBase) {
        this.onChange = () => {};
        this.container = document.createElement("div");
        this.container.id = idPrefix + "_container";
        this.baseButtons = document.createElement("div");
        this.baseButtons.id = idPrefix + "_baseButtons";
        this.baseButtons.className = classPrefix + "_baseButtons roundButtonStrip";
        this.inputContainer = document.createElement("div");
        this.inputContainer.id = idPrefix + "_inputContainer";
        this.inputContainer.className = classPrefix + "_inputContainer";
        this.input = document.createElement("input");
        this.input.id = idPrefix + "_input";
        this.input.className = classPrefix + "_input";
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('maxlength', '10');
        this.inputCurrentBase = document.createElement("div");
        this.inputCurrentBase.id = idPrefix + "_inputCurrentBase";
        this.inputCurrentBase.className = classPrefix + "_inputCurrentBase";

        this.baseButtons.addEventListener('wheel', (event) => horizontalScroll(event, this.baseButtons));

        this.input.previousValue = "";
        this.input.addEventListener('input', (event) => {
            console.log(this.input.checkValidity());
            if (this.input.checkValidity()) {
                this.input.previousValue = this.input.value;
                this.onChange();
            } 
            else {
                event.preventDefault();
                this.input.value = this.input.previousValue;
            }
            // parseInt(string, radix)
            // number.toString(radix)
        });

        for (let i = 2; i <= 36; i++) {
            let button = document.createElement('button');
            button.innerText = i;
            button.addEventListener('wheel', (event) => horizontalScroll(event, this.baseButtons));
            button.addEventListener('click', (event) => {
                this.currentBase = i;
            });
            this.baseButtons.appendChild(button);
        }

        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.inputCurrentBase);
        this.container.appendChild(this.baseButtons);
        this.container.appendChild(this.inputContainer);

        this.baseButtons.children[defaultBase-2].click();
    }
}

mediaContent_convert_exampleNto10.appendChild(getConversionVisualization_Nto10('1d7e', 16));
mediaContent_convert_exampleNto10.appendChild(getConversionVisualization_Nto10('10101', 2));
mediaContent_convert_example10toN.appendChild(getConversionVisualization_10toN('7550', 16));

class MediaConvert {

    #build() {
    }

    updateBottom() {
        this.bottomContainer.innerHTML = "";
        if (this.leftSide.currentBase != 10) this.bottomContainer.appendChild(getConversionVisualization_Nto10(this.leftSide.input.value, this.leftSide.currentBase));
        if (this.rightSide.currentBase != 10) this.bottomContainer.appendChild(getConversionVisualization_10toN(parseInt(this.leftSide.input.value, this.leftSide.currentBase), this.rightSide.currentBase));
    }

    constructor(_containerElement) {
        this.containerElement = _containerElement;
        this.leftSide = new MediaConvertSide("mediaContent_convert_left", "mediaContent_convert", 10);
        this.rightSide = new MediaConvertSide("mediaContent_convert_right", "mediaContent_convert", 16);
        this.bottomContainer = document.createElement('div');
        this.bottomContainer.id = "mediaContent_convert_bottom_container";
        this.containerElement.appendChild(this.leftSide.container);
        this.containerElement.appendChild(this.rightSide.container);
        this.containerElement.appendChild(this.bottomContainer);
        this.#build();

        this.leftSide.onChange = () => {
            var decimalNumber = parseInt(this.leftSide.input.value, this.leftSide.currentBase);
            if (!decimalNumber) decimalNumber = 0;
            console.log(decimalNumber);
            this.rightSide.input.value = decimalNumber.toString(this.rightSide.currentBase);
            this.updateBottom();
        }
        this.rightSide.onChange = () => {
            var decimalNumber = parseInt(this.rightSide.input.value, this.rightSide.currentBase);
            if (!decimalNumber) decimalNumber = 0;
            console.log(decimalNumber);
            this.leftSide.input.value = decimalNumber.toString(this.leftSide.currentBase);
            this.updateBottom();
        }

        //this.LeftContainer.className = "mediaContent_convert_container";
    }
}

var mediaConvert = new MediaConvert(mediaContent_convert_container);

function horizontalScroll(event, target) {
    event.preventDefault();
    target.scrollLeft += event.deltaY * 0.5;
    //target.scrollTo({left: target.scrollLeft + (event.deltaY*2), behavior: 'smooth'});
}

class CodeTabs {
    constructor(containerElement, buildObject) {
        this.containerElement = containerElement;
        this.containerElement.classList.add('codeTabs_container');
        this.tabStrip = document.createElement('div');
        this.tabStrip.classList.add('codeTabs_tabStrip');
        this.tabStrip.classList.add('roundButtonStrip');
        this.textArea = document.createElement('textarea');
        this.textArea.classList.add('codeTabs_textArea');

        for (let entry of buildObject) {
            let button = document.createElement('button');
            button.innerText = entry.language;
            button.addEventListener('click', () => {
                this.textArea.value = entry.content;
            });
            this.tabStrip.appendChild(button);
        }

        this.containerElement.appendChild(this.tabStrip);
        this.containerElement.appendChild(this.textArea);
    }
}

let iqtit1 = new CodeTabs(mediaConvert_codeExamples_10toN, [
    {language: "Python", content: "123\n111\n222\n123\n\n333"},
    {language: "C++", content: "sh5d"},
    {language: "Pascal", content: "w8lp"}
]);

let iqtit2 = new CodeTabs(mediaConvert_codeExamples_Nto10, [
    {language: "Python", content: "123\n111\n222\n123\n\n333"},
    {language: "C++", content: "sh5d"},
    {language: "Pascal", content: "w8lp"}
]);



var question = {
    isRandom: true,
    questionText: `123`,
    solutionText: ``,
    answerInputType: 'input',
}


var questionTemplates = [
    `Вычислите: %%%. Ответ запишите в системе с основанием %%%.`,
    `Соедините экивалентные числа.`,
    `Укажите основание системы счисления, в которой %%% %%% %%% = %%%`,
    `Сколько единиц содержится в сумме чисел *** и ***?`,
    `Сравните числа и укажите для каждой пары соответсвующий знак.`,
    `Переведите десятичное число *** в *** систему счисления. Сколько цифр *** содержится в полученной записи?`,
    `Найдите верное равенство.`,
    `Найдите наибольшее число среди ***, ***, *** и ***.`,
    `Число *** в десятичной системе счисления равно:`,
    `В алфавите *** системы счисления по сравнению с десятичной...`,
];

/*
https://inf-oge.sdamgia.ru/test?theme=23
https://inf-ege.sdamgia.ru/test?theme=274
https://inf-ege.sdamgia.ru/test?theme=239
https://inf-ege.sdamgia.ru/test?theme=220
https://inf-ege.sdamgia.ru/test?theme=247
*/

let currentDate = new Date();

mediaContent_base60_gradientSeconds.style.rotate = `${currentDate.getMilliseconds() / 1000 * 360}deg`;
mediaContent_base60_gradientMinutes.style.rotate = `${currentDate.getSeconds() / 60 * 360}deg`;
mediaContent_base60_gradientHours.style.rotate = `${currentDate.getMinutes() / 60 * 360}deg`;

setInterval(() => {
    let date = new Date();
    let millis_second = date.getMilliseconds();
    let millis_minute = date.getSeconds() * 1000 + millis_second;
    let millis_hour = date.getMinutes() * 60 * 1000 + millis_minute;
    let secondsString = date.getSeconds().toString() + "“";
    let minutesString = date.getMinutes().toString() + "‘";
    if (secondsString.length < 2) secondsString = "0" + secondsString;
    if (minutesString.length < 2) minutesString = "0" + minutesString;
    mediaContent_base60_textSecondsTime.innerText = date.getMilliseconds();
    mediaContent_base60_textSecondsDegrees.innerText = Math.floor(millis_second / 1000 * 360 * 100) / 100 + "°";
    mediaContent_base60_textMinutesTime.innerText = secondsString;
    mediaContent_base60_textMinutesDegrees.innerText = Math.floor(millis_minute / 60000 * 360 * 100) / 100 + "°";
    mediaContent_base60_textHoursTime.innerText = minutesString;
    mediaContent_base60_textHoursDegrees.innerText = Math.floor(millis_hour / 3600000 * 360 * 100) / 100 + "°";
}, 24);

goToPage(3);