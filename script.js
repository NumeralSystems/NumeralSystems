"use strict";

const digits = "0123456789";
const alphabet = "abcdefghijklmnopqrstuvwxyz";

/*
    Навигация
*/

var pageElements = [...document.querySelectorAll('page')],
    goToCards = [...document.querySelectorAll('.goToCard')];;
var currentNormalPageIndex = 0,
    currentPage = pageElements[0],
    currentNavlink, navlinks = [];

goToCards.forEach(element => createNextPageCard(element));

function createSiteStructureObject() {
    let tempArray = [];
    let i = 0;
    pageElements.forEach(page => {
        if (page.getAttribute('data-excludefromstructure') == true) return;
        let visible = true;
        if (page.getAttribute("visible") === "false") visible = false;
        let tempObject = {
            element: page,
            title: page.getAttribute("pagetitle"),
            index: i,
            visible: visible
        };
        tempArray.push(tempObject);
        i++;
    });
    return tempArray;
}

var siteStructure = createSiteStructureObject();

function createNavbarLinks() {
    let fragment = document.createDocumentFragment();
    for (let pageObject of siteStructure) {
        if (pageObject.visible == false) continue;
        let pageElement = document.createElement("div");
        pageElement.className = "navbar_link";
        pageElement.pageIndex = pageObject.index;
        pageElement.addEventListener('click', () => goToPage(pageObject.index));

        let indicatorElement = document.createElement("div");
        indicatorElement.className = "navbar_link_indicator";

        let textElement = document.createElement("div");
        textElement.className = "navbar_link_text";
        textElement.innerText = pageObject.title;
        
        pageElement.appendChild(indicatorElement);
        pageElement.appendChild(textElement);
        fragment.appendChild(pageElement);
        navlinks.push(pageElement);
    }
    navbar_links.appendChild(fragment);
}
createNavbarLinks();

function goToPage(index) {
    let navTempIndex = index;
    if (currentNavlink) {
        currentNavlink.classList.remove('navbar_linkCurrent');
    }
    let targetNavlink = navlinks.find((element => element.pageIndex == navTempIndex));
    if (targetNavlink) {
        targetNavlink.classList.add('navbar_linkCurrent');
        targetNavlink.classList.add('navbar_linkCompleted');
        currentNavlink = targetNavlink;
    }
    for (let element of pageElements) {
        element.classList.add('page_displaynone');
        currentPage.classList.remove('page_current');
    }
    currentNormalPageIndex = parseInt(currentNormalPageIndex);
    if (index === '+') index = currentNormalPageIndex + 1;
    if (index === '-') index = currentNormalPageIndex - 1;
    currentPage = pageElements[index];
    currentNormalPageIndex = index;
    let progress = Math.round((index / (pageElements.length - 1)) * 100) / 100;
    navbar_progress_text.innerText = progress * 100 + "% пройдено";
    navbar_progress_bar.value = progress;

    currentPage.classList.remove('page_displaynone');
    currentPage.classList.add('page_current');
    revealTick(currentPage);
    localStorage.setItem('lastVisitedPageIndex', index);
}

function checkClickPath(etarget, searchFor) {
    if (etarget == searchFor || etarget.parentElement == searchFor || etarget.parentElement.parentElement == searchFor) return true
    else return false;
}

window.onclick = (event) => {
    if (checkClickPath(event.target, navOpenButton)) document.body.classList.add('navbarVisible')
    else if (!checkClickPath(event.target, navbar) || checkClickPath(event.target, navbar_header_closeButton)) document.body.classList.remove('navbarVisible')
}

/*

                <div class="goToCard" onclick="goToPage('+')">
                    <div class="goToCardText">Система тестирования</div>
                    <div class="goToCardIconContainer">
                        <div class="goToCardIconBackground"></div>
                        <div class="goToCardIconSymbol">
                            <icon>navigate_next</icon>
                        </div>
                    </div>
                </div>
*/

function createNextPageCard(container) {
    container.innerHTML = `<div class="goToCardText">${container.getAttribute('data-label')}</div>
    <div class="goToCardIconContainer">
        <div class="goToCardIconBackground"></div>
        <div class="goToCardIconSymbol">
            <icon>navigate_next</icon>
        </div>
    </div>`;
    container.addEventListener('click', () => goToPage('+'))
}

var lastVisitedPageIndex = localStorage.getItem('lastVisitedPageIndex');

if (lastVisitedPageIndex && lastVisitedPageIndex != 0) {
    titleScreen_savedPositionContainer.addEventListener('click', () => {
        goToPage( lastVisitedPageIndex );
        titleScreen_savedPositionContainer.classList.add('displaynone');
    })
    titleScreen_savedPositionContainer.classList.remove('displaynone');
}

/*
    Базовые функции
*/

function getRandomInt(min = 0, max = 512, exclude = []) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let result = Math.floor(Math.random() * (max - min + 1) + min);
    while (exclude.includes(result)) result = getRandomInt(min, max);
    return result;
}

function completeStringWithZeros(input, targetLength) {
    if (typeof input == 'number') input = input.toString();
    if (targetLength <= input.length) return input;
    let tempString = '';
    for (let i = 0; i < targetLength - input.length; i++) {
        tempString += '0';
    }
    return tempString + input;
}

function generateHTMLContentForMarquee() {
    let titleBackground_tempString = ``;
    let fontSize = 12;
    let bases = [2, 8, 10, 16, 36];
    for (let i = 0; i < Math.floor(window.outerHeight / 2 / (56 + 16)); i++) {
        let tempString = "";
        for (let b = 0; b < 12; b++) {
            let currentBase = bases[getRandomInt(0, 4)]
            let random = getRandomInt(24, 4095);
            tempString += `<marquee_element class="titleScreen_marqueeElement_base${currentBase}">${completeStringWithZeros(random.toString(currentBase).toUpperCase(), 4)}</marquee_element>`;
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

document.addEventListener("DOMContentLoaded", () => {
    [...document.querySelectorAll('.titleScreen_marqueeGroup')].forEach(element => element.innerHTML = generateHTMLContentForMarquee());
});

titleScreen_startButton_button.addEventListener('click', () => {
    let scaleFactor;
    let rectInfo = titleScreen_startButton_pageTransitionRipple.getBoundingClientRect()
    if (window.innerHeight > window.innerWidth) {
        scaleFactor = (window.innerHeight + rectInfo.bottom * 2) * 1.5;
    } else {
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

function getConversionVisualization_10toN(number, radix) {
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

    let results = division_getResults(number, radix);
    let remainders = division_getRemainders(number, radix);
    let tableElements = [];
    let table = document.createElement('table');
    table.className = "visualization_10toN";
    for (let a = 0; a < results.length + 1; a++) {
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
    for (let a = 0; a < results.length - 1; a++) {
        let remainder = results[a] - (radix * results[a + 1]);
        tableElements[a][a].innerHTML = results[a];
        tableElements[a][a + 1].innerHTML = radix + `<div class="lineLeft"></div><div class="lineTop"></div>`;
        tableElements[a + 1][a].innerHTML = radix * results[a + 1] + `<div class="cornerOperationSymbol">-</div>`;
        if (remainder > 9) {
            tableElements[a + 2][a].innerHTML = `${remainder.toString(radix)} (${remainder})<div class="cornerOperationSymbol">=</div>`;
        } else {
            tableElements[a + 2][a].innerHTML = remainder + `<div class="cornerOperationSymbol">=</div>`;
        }
        //tableElements[a][a+1].classList.add("divisionCell_divider");
        //tableElements[a][a].classList.add("divisionCell_result");
        tableElements[a + 2][a].classList.add("blink");
        let wholeSeconds = Math.floor((results.length-a) / 10);
        tableElements[a + 2][a].style.animationDelay = `${wholeSeconds}.${results.length - wholeSeconds * 10 - a}s`
        if (a != 0) {
            tableElements[a][a].innerHTML = results[a] + `<div class="lineLeft"></div>`;
        }
    }
    let lastIndex = results.length - 1;
    tableElements[lastIndex][lastIndex].innerHTML = results[lastIndex] + `<div class="lineLeft"></div>`;
    tableElements[lastIndex][lastIndex].classList.add("blink");
    return table;
}

function getConversionVisualization_Nto10(number, radix) {
    let digits = number.toString();
    let letterDecodings = [];
    let partContents = [`${number}<sub>${radix}</sub>`, ``, ``, ``, ``, `${parseInt(digits, radix)}<sub>10</sub>`];
    let i = digits.length - 1;
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

function getArithmeticVisualization_Addition(number1, number2, radix) {
    number1 = number1.toString();
    number2 = number2.toString();
    let result = (parseInt(number1, radix) + parseInt(number2, radix)).toString(radix);
    let maxLength = Math.max(Math.max(number1.length, number2.length), result.length);
    let tableElements = [];
    let rows = [];
    let table = document.createElement('table');
    table.className = "visualization_Addition";
    for (let a = 0; a < 4; a++) {
        let row = document.createElement('tr');
        rows.push(row);
        let rowElements = [];
        for (let b = 0; b < maxLength; b++) {
            let cell = document.createElement('td');
            rowElements.push(cell);
            row.appendChild(cell);
        }
        tableElements.push(rowElements);
        table.appendChild(row);
    }
    for (let b = maxLength - 1; b >= 0; b--) {
        let currentDigit1 = '0',
            currentDigit2 = '0',
            currentResultDigit = '0';
        if (number1[b - (maxLength - number1.length)]) {
            currentDigit1 = number1[b - (maxLength - number1.length)];
            tableElements[1][b].innerText = currentDigit1;
        }
        if (number2[b - (maxLength - number2.length)]) {
            currentDigit2 = number2[b - (maxLength - number2.length)];
            tableElements[2][b].innerText = currentDigit2;
        }
        if (result[b - (maxLength - result.length)]) {
            currentResultDigit = result[b - (maxLength - result.length)];
            tableElements[3][b].innerText = currentResultDigit;
        }
        let additionDecimal = parseInt(currentDigit1, radix) + parseInt(currentDigit2, radix);
        if (additionDecimal >= radix) {
            tableElements[0][b - 1].innerText = "+" + (Math.floor(additionDecimal / radix)).toString(radix);
        }
    }
    rows[2].classList.add('arithmeticVisualization_borderBottom');
    tableElements[2][0].insertAdjacentHTML('afterbegin', `<div class="cornerOperationSymbol">+</div>`);
    return table;
}

function getArithmeticVisualization_Subtraction(number1, number2, radix) {
    if (parseInt(number2, radix) > parseInt(number1, radix)) {
        let temp = number1;
        number1 = number2;
        number2 = temp;
    }
    number1 = number1.toString();
    number2 = number2.toString();
    let result = (parseInt(number1, radix) - parseInt(number2, radix)).toString(radix);
    let maxLength = Math.max(Math.max(number1.length, number2.length), result.length);
    let tableElements = [];
    let rows = [];
    let table = document.createElement('table');
    table.className = "visualization_Addition";
    for (let a = 0; a < 4; a++) {
        let row = document.createElement('tr');
        rows.push(row);
        let rowElements = [];
        for (let b = 0; b < maxLength; b++) {
            let cell = document.createElement('td');
            rowElements.push(cell);
            row.appendChild(cell);
        }
        tableElements.push(rowElements);
        table.appendChild(row);
    }
    for (let b = maxLength - 1; b >= 0; b--) {
        let currentDigit1 = '0',
            currentDigit2 = '0',
            currentResultDigit = '0';
        if (number1[b - (maxLength - number1.length)]) {
            currentDigit1 = number1[b - (maxLength - number1.length)];
            tableElements[1][b].innerText = currentDigit1;
        }
        if (number2[b - (maxLength - number2.length)]) {
            currentDigit2 = number2[b - (maxLength - number2.length)];
            tableElements[2][b].innerText = currentDigit2;
        }
        if (result[b - (maxLength - result.length)]) {
            currentResultDigit = result[b - (maxLength - result.length)];
            tableElements[3][b].innerText = currentResultDigit;
        }
        let subtractionDecimal = parseInt(currentDigit1, radix) - parseInt(currentDigit2, radix);
        if (subtractionDecimal < 0) {
            tableElements[0][b - 1].innerText = "-1"; // + (Math.floor(additionDecimal / radix)).toString(radix);
        }
    }
    rows[2].classList.add('arithmeticVisualization_borderBottom');
    tableElements[2][0].insertAdjacentHTML('afterbegin', `<div class="cornerOperationSymbol">-</div>`);
    return table;
}

function getArithmeticVisualization_Multiplication(number1, number2, radix) {
    number1 = number1.toString();
    number2 = number2.toString();
    let result = (parseInt(number1, radix) * parseInt(number2, radix)).toString(radix);
    let maxLength = Math.max(Math.max(number1.length, number2.length), result.length);
    let tableElements = [];
    let rows = [];
    let table = document.createElement('table');
    table.className = "visualization_Multiplication";
    for (let a = 0; a < (3 + number2.length); a++) {
        let row = document.createElement('tr');
        rows.push(row);
        let rowElements = [];
        for (let b = 0; b < maxLength; b++) {
            let cell = document.createElement('td');
            rowElements.push(cell);
            row.appendChild(cell);
        }
        tableElements.push(rowElements);
        table.appendChild(row);
    }
    for (let b = maxLength - 1; b >= 0; b--) {
        let currentDigit1 = '0',
            currentDigit2 = '0',
            currentResultDigit = '0';
        if (number1[b - (maxLength - number1.length)]) {
            currentDigit1 = number1[b - (maxLength - number1.length)];
            tableElements[0][b].innerText = currentDigit1;
        }
        if (number2[b - (maxLength - number2.length)]) {
            currentDigit2 = number2[b - (maxLength - number2.length)];
            tableElements[1][b].innerText = currentDigit2;
        }
        if (result[b - (maxLength - result.length)]) {
            currentResultDigit = result[b - (maxLength - result.length)];
            tableElements[tableElements.length-1][b].innerText = currentResultDigit;
        }
    }
    for (let a = 0; a < number2.length; a++) {
        let currentResult = result = (parseInt(number1, radix) * parseInt(number2[number2.length - 1 - a], radix)).toString(radix);
        for (let b = currentResult.length - 1; b >= 0; b--) {
            maxLength - currentResult.length;
            let currentResultDigit = currentResult[b - (maxLength - currentResult.length)];
            tableElements[2+a][(maxLength - currentResult.length)-a+b].innerText = currentResult[b];
        }
        if (a != 0) tableElements[2+a][0].insertAdjacentHTML('afterbegin', `<div class="cornerOperationSymbol">+</div>`);
    }
    tableElements[1][0].insertAdjacentHTML('afterbegin', `<div class="cornerOperationSymbol">×</div>`);
    rows[rows.length-2].classList.add('arithmeticVisualization_borderBottom');
    rows[1].classList.add('arithmeticVisualization_borderBottom');
    return table;
}

function getArithmeticVisualization_Division(number1, number2, radix) {
    number1 = number1.toString();
    number2 = number2.toString();
    let decimal1 = parseInt(number1, radix);
    let decimal2 = parseInt(number2, radix);
    let result = (Math.floor(decimal1 / decimal2)).toString(radix);
    let tableElements = [];
    let table = document.createElement('table');
    table.className = "visualization_Division";
    for (let a = 0; a < result.length*2 + 1; a++) {
        let row = document.createElement('tr');
        let rowElements = [];
        for (let b = 0; b < 2; b++) {
            let cell = document.createElement('td');
            rowElements.push(cell);
            row.appendChild(cell);
        }
        tableElements.push(rowElements);
        table.appendChild(row);
    }
    tableElements[0][0].innerHTML = number1.toString(radix);
    tableElements[0][1].innerHTML = number2 + `<div class="lineLeft"></div><div class="lineTop"></div>`;
    tableElements[1][1].innerHTML = result + `<div class="lineLeft"></div>`;
    let number = decimal1;
    for (let a = 0; a < result.length; a++) {
        let currentNNumber = result[a];
        for (let b = 0; b < result.length - a - 1; b ++) {
            currentNNumber += '0';
        }
        let currentDecimal = parseInt(currentNNumber, radix);
        let remainder = number - (decimal2 * currentDecimal);
        tableElements[2*a + 1][0].innerHTML = (decimal2 * result[a]).toString(radix) + `<div class="cornerOperationSymbol">-</div>`;
        tableElements[2*a + 2][0].innerHTML = `${remainder.toString(radix)}<div class="cornerOperationSymbol">=</div>`;
        number -= remainder;
    }
    return table;
}

function updateMedia_unary() {
    if (!mediaContent_unary2_input.value) mediaContent_unary2_input.value = 0;
    let tempString = "";
    let value = parseInt(mediaContent_unary2_input.value);
    for (let i = 0; i < value; i++) {
        tempString += "1";
    }
    mediaContent_unary2_result.innerText = tempString;
}

function initMedia_unary() {
    let fragment = document.createDocumentFragment();
    let numbers = [1, 50, 200, 1000, 5000, 10000, 25000];
    numbers.forEach(number => {
        let newButton = document.createElement('button');
        newButton.innerText = number;
        newButton.addEventListener('click', () => {
            mediaContent_unary2_input.value = number;
            updateMedia_unary();
        });
        fragment.appendChild(newButton);
    })
    mediaContent_unary2_buttonContainer.appendChild(fragment);
    mediaContent_unary2_input.addEventListener('input', (e) => updateMedia_unary());
    mediaContent_unary2_input.value = "20";
    updateMedia_unary();
}
initMedia_unary();

class NumberInputWidget {

    #currentBase;

    set currentBase(value) {
        if (value > 36 || value < 2) return;
        var decimalNumber = parseInt(this.input.value, this.#currentBase);
        this.#currentBase = value;
        this.inputCurrentBase.innerText = `${value} (0-${(value-1).toString(value)})`;

        let newPatternString;
        alphabet.indexOf((value - 1).toString(value))
        if (value <= 10) {
            newPatternString = `[0-${digits[value-1]}]+`;
        } else if (value > 10) {
            newPatternString = `[a-${alphabet[value-11]}A-${alphabet[value-11].toUpperCase()}\\d]+`;
        }
        this.input.setAttribute('pattern', newPatternString);

        if (decimalNumber) {
            this.input.value = decimalNumber.toString(this.#currentBase);
        } else {
            this.input.value = '0';
        }
        this.input.previousValue = '0';
        this.onBaseChange();
        this.onChange();
    }
    get currentBase() {
        return this.#currentBase;
    }

    onChange;

    constructor(idPrefix, classPrefix, defaultBase, maxDecimalValue) {
        this.onChange = () => {};
        this.onBaseChange = () => {};
        this.container = document.createElement("div");
        this.container.id = idPrefix + "_container";
        this.container.className = classPrefix + "_container NumberInputWidget_container";
        this.inputContainer = document.createElement("div");
        this.inputContainer.id = idPrefix + "_inputContainer";
        this.inputContainer.className = classPrefix + "_inputContainer NumberInputWidget_inputContainer";
        this.input = document.createElement("input");
        this.input.id = idPrefix + "_input";
        this.input.className = classPrefix + "_input NumberInputWidget_input";
        this.input.setAttribute('type', 'text');
        //this.input.setAttribute('maxDecimalValue', maxDecimalValue);
        this.inputCurrentBase = document.createElement("div");
        this.inputCurrentBase.id = idPrefix + "_inputCurrentBase";
        this.inputCurrentBase.className = classPrefix + "_inputCurrentBase NumberInputWidget_inputCurrentBase";

        this.input.previousValue = "";
        this.input.addEventListener('input', (event) => {
            if (this.input.value[0] == "0") this.input.value = this.input.value.replace("0", "");
            if (this.input.value == "") this.input.value = "0";
            if (this.input.checkValidity()) {
                if (parseInt(this.input.value, this.currentBase) <= maxDecimalValue) {
                }
                else {
                    this.input.previousValue = this.input.value = maxDecimalValue.toString(this.currentBase);
                }
                this.input.previousValue = this.input.value;
                this.onChange();
            } else {
                event.preventDefault();
                this.input.value = this.input.previousValue;
            }
        });

        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.inputCurrentBase);
        this.container.appendChild(this.inputContainer);

        this.currentBase = defaultBase;
    }
}

class NumberInputWidgetWithBaseSelect extends NumberInputWidget {

    set currentBase(value) {
        if (value > 36 || value < 2 || !this.baseButtons) return;
        [...this.baseButtons.children].forEach(element => {
            if (element.innerText == value.toString()) element.classList.add('active');
            else element.classList.remove('active');
        });
        super.currentBase = value;
    }
    get currentBase() {
        return super.currentBase;
    }

    constructor(idPrefix, classPrefix, baseArray, defaultBase, maxDecimalValue) {
        let baseButtons = document.createElement("div");
        baseButtons = document.createElement("div");
        baseButtons.id = idPrefix + "_baseButtons";
        baseButtons.className = classPrefix + "_baseButtons roundButtonStrip NumberInputWidget_baseButtons";

        super(idPrefix, classPrefix, defaultBase, maxDecimalValue);
        this.baseButtons = baseButtons;
        if (baseArray.length > 1) {
            baseArray.forEach(n => {
                let button = document.createElement('button');
                button.innerText = n;
                button.addEventListener('wheel', (event) => horizontalScroll(event, baseButtons));
                button.addEventListener('click', (event) => {
                    this.currentBase = n;
                });
                baseButtons.appendChild(button);
            });
        }
        baseButtons.addEventListener('wheel', (event) => horizontalScroll(event, baseButtons));
        this.container.insertAdjacentElement('afterbegin', baseButtons);
        this.currentBase = defaultBase;
    }
}

mediaContent_convert_exampleNto10.appendChild(getConversionVisualization_Nto10('1d7e', 16));
mediaContent_convert_exampleNto10.appendChild(getConversionVisualization_Nto10('10101', 2));
mediaContent_convert_example10toN.appendChild(getConversionVisualization_10toN('7550', 16));

class MediaConvert {

    updateBottom() {
        this.bottomContainer.innerHTML = "";
        if (this.leftSide.currentBase != 10) this.bottomContainer.appendChild(getConversionVisualization_Nto10(this.leftSide.input.value, this.leftSide.currentBase));
        if (this.rightSide.currentBase != 10) this.bottomContainer.appendChild(getConversionVisualization_10toN(parseInt(this.leftSide.input.value, this.leftSide.currentBase), this.rightSide.currentBase));
    }

    constructor(_containerElement) {
        this.containerElement = _containerElement;
        let baseArray = [];
        for (let i = 2; i <= 36; i++) {
            baseArray.push(i);
        }
        this.leftSide = new NumberInputWidgetWithBaseSelect("mediaContent_convert", "calculatorContainer_left", baseArray, 10, 10000);
        this.rightSide = new NumberInputWidgetWithBaseSelect("mediaContent_convert", "calculatorContainer_right", baseArray, 16, 10000);
        this.bottomContainer = document.createElement('div');
        this.bottomContainer.id = "mediaContent_convert_bottom_container";
        this.bottomContainer.className = "calculator_bottomContainer";
        this.containerElement.appendChild(this.leftSide.container);
        this.containerElement.appendChild(this.rightSide.container);
        this.containerElement.appendChild(this.bottomContainer);


        let mediaConvertInstance = this;
        function _onBaseChange(widgetInstance, otherWidgetInstance) {
        }
        function _onChange(widgetInstance, otherWidgetInstance) {
            var decimalNumber = parseInt(widgetInstance.input.value, widgetInstance.currentBase);
            if (!decimalNumber) decimalNumber = 0;
            otherWidgetInstance.input.value = decimalNumber.toString(otherWidgetInstance.currentBase);
            mediaConvertInstance.updateBottom();
        }

        this.leftSide.onChange = () => _onChange(this.leftSide, this.rightSide);
        this.rightSide.onChange = () => _onChange(this.rightSide, this.leftSide);
        this.leftSide.onBaseChange = () => _onBaseChange(this.leftSide, this.rightSide);
        this.rightSide.onBaseChange = () => _onBaseChange(this.rightSide, this.leftSide);

        //this.LeftContainer.className = "mediaContent_convert_container";
    }
}

var mediaConvert = new MediaConvert(mediaContent_convert_container);


class MediaArithmetic {

    updateBottom() {
        this.bottomContainer.innerHTML = "";
        this.bottomContainer.appendChild(this.currentOperationFunction(this.leftSide.input.value, this.rightSide.input.value, this.leftSide.currentBase));
    }

    updateOperationSelection(targetActiveElement) {
        [...this.operationSelectionContainer.children].forEach(element => {
            if (element == targetActiveElement) element.classList.add('active');
            else element.classList.remove('active');
        });
    }

    constructor(_containerElement) {
        this.containerElement = _containerElement;
        let baseArray = [];
        for (let i = 2; i <= 36; i++) {
            baseArray.push(i);
        }
        this.leftSide = new NumberInputWidgetWithBaseSelect("mediaContent_arithmetic_left", "calculatorContainer_left", baseArray, 8, 100000);
        this.rightSide = new NumberInputWidget("mediaContent_arithmetic_right", "calculatorContainer_right", 8, 100000);
        this.operationSelectionContainer = document.createElement('div');
        this.operationSelectionContainer.id = "mediaContent_arithmetic_operationSelection_container";
        this.operationSelectionContainer.className = "roundButtonStrip";
        this.bottomContainer = document.createElement('div');
        this.bottomContainer.id = "mediaContent_arithmetic_bottom_container";
        this.bottomContainer.className = "calculator_bottomContainer";

        let operations = [
            { name: "Сложение", func: getArithmeticVisualization_Addition },
            { name: "Вычитание", func: getArithmeticVisualization_Subtraction },
            { name: "Умножение", func: getArithmeticVisualization_Multiplication },
            { name: "Деление", func: getArithmeticVisualization_Division }
        ];

        operations.forEach(operationObject => {
            let newButton = document.createElement('button');
            newButton.textContent = operationObject.name;
            newButton.addEventListener('click', () => {
                mediaAdditionInstance.currentOperationFunction = operationObject.func;
                this.updateOperationSelection(newButton);
                this.updateBottom();
            })
            this.operationSelectionContainer.appendChild(newButton);
        });

        this.currentOperationFunction = operations[0].func;
        this.updateOperationSelection(this.operationSelectionContainer.children[0]);

        this.containerElement.appendChild(this.leftSide.container);
        this.containerElement.appendChild(this.rightSide.container);
        this.containerElement.appendChild(this.operationSelectionContainer);
        this.containerElement.appendChild(this.bottomContainer);

        let mediaAdditionInstance = this;
        function _onBaseChange(widgetInstance, otherWidgetInstance) {
        }
        function _onChange(widgetInstance, otherWidgetInstance) {
            mediaAdditionInstance.updateBottom();
        }

        this.leftSide.onChange = () => _onChange(this.leftSide, this.rightSide);
        this.rightSide.onChange = () => _onChange(this.rightSide, this.leftSide);
        this.leftSide.onBaseChange = () => this.rightSide.currentBase = this.leftSide.currentBase;

        this.leftSide.input.value = 310;
        this.rightSide.input.value = 240;
        this.updateBottom();

        //this.LeftContainer.className = "mediaContent_convert_container";
    }
}

var mediaArithmetic = new MediaArithmetic(mediaContent_arithmetic_container);

function horizontalScroll(event, target) {
    event.preventDefault();
    target.scrollLeft += event.deltaY * 0.5;
    //target.scrollTo({left: target.scrollLeft + (event.deltaY*2), behavior: 'smooth'});
}

class CodeTabs {
    updateSelectionButtons(targetActiveElement) {
        [...this.tabStrip.children].forEach(element => {
            if (element == targetActiveElement) element.classList.add('active');
            else element.classList.remove('active');
        });
    }
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
                this.updateSelectionButtons(button);
            });
            this.tabStrip.appendChild(button);
        }
        this.textArea.value = buildObject[0].content;
        this.updateSelectionButtons(this.tabStrip.children[0]);

        this.containerElement.appendChild(this.tabStrip);
        this.containerElement.appendChild(this.textArea);
    }
}

let codeExamples_codeTabs_toN = new CodeTabs(mediaConvert_codeExamples_10toN, codeExamples.toN);
let codeExamples_codeTabs_to10 = new CodeTabs(mediaConvert_codeExamples_Nto10, codeExamples.to10);

var mediaBase60_updateInterval;

function initMedia_history_base60() {
    let currentDate = new Date();
    mediaBase60_updateInterval = setInterval(() => updateMedia_base60(), 50);
    mediaContent_base60_gradientMillis.style.rotate = `${currentDate.getMilliseconds() / 1000 * 360}deg`;
    mediaContent_base60_gradientSeconds.style.rotate = `${currentDate.getSeconds() / 60 * 360}deg`;
    mediaContent_base60_gradientMinutes.style.rotate = `${currentDate.getMinutes() / 60 * 360}deg`;
}

function updateMedia_base60() {
    let date = new Date();
    let millis_second = date.getMilliseconds();
    let millis_minute = date.getSeconds() * 1000 + millis_second;
    let millis_hour = date.getMinutes() * 60 * 1000 + millis_minute;
    let secondsString = date.getSeconds().toString() + "“";
    let minutesString = date.getMinutes().toString() + "‘";
    if (secondsString.length < 2) secondsString = "0" + secondsString;
    if (minutesString.length < 2) minutesString = "0" + minutesString;
    mediaContent_base60_textMillisTime.innerText = date.getMilliseconds();
    mediaContent_base60_textMillisDegrees.innerText = Math.floor(millis_second / 1000 * 360 * 100) / 100 + "°";
    mediaContent_base60_textSecondsTime.innerText = secondsString;
    mediaContent_base60_textSecondsDegrees.innerText = Math.floor(millis_minute / 60000 * 360 * 100) / 100 + "°";
    mediaContent_base60_textMinutesTime.innerText = minutesString;
    mediaContent_base60_textMinutesDegrees.innerText = Math.floor(millis_hour / 3600000 * 360 * 100) / 100 + "°";
}

mediaContent_base60_container.onReveal = () => initMedia_history_base60();
mediaContent_base60_container.onUnreveal = () => clearInterval(mediaBase60_updateInterval);

function initMedia_scales() {
    let mediaContent_scales_dragItemBank = createDragElementSlot(12);
    mediaContent_scales_dragItemBank.id = "mediaContent_scales_dragItemBank";
    mediaContent_scales_container.appendChild(mediaContent_scales_dragItemBank);

    let bottomTableFragment = document.createDocumentFragment();
    let tableRow1 = document.createElement('tr');
    let tableRow2 = document.createElement('tr');
    let tableRow3 = document.createElement('tr');
    bottomTableFragment.appendChild(tableRow1);
    bottomTableFragment.appendChild(tableRow2);
    bottomTableFragment.appendChild(tableRow3);

    for (let i = 11; i >= 0 ; i--) {
        let rightSideSlot = createDragElementSlot(1);
        rightSideSlot.onChange = () => updateScales();
        mediaContent_scales_rightContainer.appendChild(rightSideSlot);
        let currentNumber = Math.pow(2, i);
        let draggableItem = createDragElement(currentNumber);
        mediaContent_scales_dragItemBank.appendChild(draggableItem);
    
        let cell1 = document.createElement('td');
        cell1.innerHTML = `2<sup>${i}</sup>`;
        tableRow1.appendChild(cell1);
        let cell2 = document.createElement('td');
        cell2.innerHTML = currentNumber;
        tableRow2.appendChild(cell2);
        let cell3 = document.createElement('td');
        cell3.innerHTML = 0;
        tableRow3.appendChild(cell3);
    }
    mediaContent_scales_bottomTable.appendChild(bottomTableFragment);
    
    window.mediaScales_leftSide = new NumberInputWidget("mediaContent_scalesLeftWidget", "", [10], 10, 4000);
    mediaScales_leftSide.input.value = 480;

    mediaContent_scales_leftContainer.appendChild(mediaScales_leftSide.container);

    mediaScales_leftSide.onChange = () => updateScales();
    mediaScales_leftSide.onBaseChange = () => {
        let newMaxLength = 0;
        if (value == 2) newMaxLength = 4;
        else if (value == 8) newMaxLength = 4;
        else if (value == 16) newMaxLength = 6;
    };

    updateScales();
}
initMedia_scales();


function createDragElement(innerContent) {
    function onPointerDown(event) {
        let innerX = 0, innerY = 0;
        let previousWidthValue;
        dragMouseDown(event)

        function dragMouseDown(event) {
            event.preventDefault();
            if (event.button == 0) {
                let rect = element.getBoundingClientRect();
                innerX = event.clientX - rect.left;
                innerY = event.clientY - rect.top;
            
                previousWidthValue = element.style.width;
                element.style.width = element.offsetWidth + "px";
                element.classList.add('draggableItem-dragging');
                document.body.classList.add('dragging');
            
                document.onpointerup = closeDragElement;
                document.onpointermove = elementDrag;

                elementDrag(event);
            }
        }
    
        function elementDrag(event) {
            event.preventDefault();
            element.style.top = event.pageY - innerY + "px";
            element.style.left = event.pageX - innerX + "px";
        }
    
        function closeDragElement(event) {
            let target;
            if (event.pointerType == "mouse") {
                target = event.target;
            } else if (event.pointerType == "touch") {
                target = document.elementFromPoint(event.clientX, event.clientY);
            }
        
            if (target.classList.contains("draggableItemSlot")) {
            }
            else if (target.classList.contains("draggableItem") && target.parentElement.classList.contains("draggableItemSlot")) {
                target = target.parentElement;
            }
            else {
                target = null;
            }

            if (target != null) {
                let targetMaxChildrenCount = target.getAttribute("maxChildrenCount");
                if (targetMaxChildrenCount == null || (targetMaxChildrenCount != null && targetMaxChildrenCount >= target.children.length+1)) {
                    let previousParent = element.parentElement;
                    target.addDragElement(element);
                    previousParent.onChange();
                }
            }
            
            element.style.width = previousWidthValue;
            element.style.top = 'auto';
            element.style.left = 'auto';
            element.classList.remove('draggableItem-dragging');
            document.body.classList.remove('dragging');
        
            document.onpointermove = null;
            document.onpointerup = null;
        }
    }
    
    let element = document.createElement('div');
    element.className = "draggableItem";
    element.innerHTML = innerContent;
    element.addEventListener('pointerdown', (event) => onPointerDown(event));
    return element;
}

function createDragElementSlot(maxChildrenCount) {
    let element = document.createElement('div');
    element.className = "draggableItemSlot";
    element.setAttribute("maxChildrenCount", maxChildrenCount);
    element.onChange = () => {};
    element.addDragElement = (child) => {
        element.appendChild(child);
        element.onChange();
    }
    return element;
}

function updateScales() {
    let sum = 0;
    [...mediaContent_scales_rightContainer.getElementsByClassName("draggableItemSlot")].forEach(slot => {
        if (slot.children.length != 0) sum += parseInt(slot.children[0].innerText);
    });
    let newValue = (sum - parseInt(mediaScales_leftSide.input.value));
    mediaContent_scales_deltaIndicator.innerText = Math.abs(newValue);
    if (newValue == 0) {
        mediaContent_scales_container.classList.remove('leftMore');
        mediaContent_scales_container.classList.remove('rightMore');
        mediaContent_scales_container.classList.add('equal');
    }
    else if (newValue > 0) {
        mediaContent_scales_container.classList.remove('leftMore');
        mediaContent_scales_container.classList.add('rightMore');
        mediaContent_scales_container.classList.remove('equal');
    }
    else if (newValue < 0) {
        mediaContent_scales_container.classList.add('leftMore');
        mediaContent_scales_container.classList.remove('rightMore');
        mediaContent_scales_container.classList.remove('equal');
    }
    
    let tempSum = sum;

    for (let i = 11; i >= 0; i--) {
        let divisionResult = Math.floor(tempSum / Math.pow(2, i));
        if (divisionResult != 0) {
            mediaContent_scales_bottomTable.children[2].children[11-i].innerText = 1;
            tempSum -= divisionResult * Math.pow(2, i);
        }
        else {
            mediaContent_scales_bottomTable.children[2].children[11-i].innerText = 0;
        }
    }
}

function historyExamples_generateCardInfo_egypt() {
    let descriptions = [
        "Черта",
        "Пятка или ручка корзины",
        "Петля",
        "Лотос",
        "Палец",
        "Личинка",
        "Хех (божество)"
    ];
    let resultArray = [];
    for (let i = 0; i < 7; i++) {
        let currentNumber = Math.pow(10, i);
        let currentObject = {
            number: currentNumber,
            leftHTML: `<img src="assets/historyExamples/egyptDigits/${currentNumber}.svg" alt="${currentNumber}"/>`,
            description: descriptions[i]
        }
        resultArray.push(currentObject);
    }
    return resultArray;
}

function historyExamples_generateCardInfo_rome() {
    let digits = [
        [1, "I"],
        [5, "V"],
        [10, "X"],
        [50, "L"],
        [100, "C"],
        [500, "D"],
        [1000, "M"],
        [5000, "<ov>V</ov>"],
        [10000, "<ov>X</ov>"],
        [50000, "<ov>L</ov>"],
        [100000, "<ov>C</ov>"],
        [500000, "<ov>D</ov>"],
        [1000000, "<ov>M</ov>"],
    ];
    let resultArray = [];
    for (let digit of digits) {
        let currentObject = {
            number: digit[0],
            leftHTML: digit[1],
            description: null
        }
        resultArray.push(currentObject);
    }
    return resultArray;
}

function historyExamples_createCards(cardObjectArray) {
    let fragment = document.createDocumentFragment();
    let leftSide = document.createElement('div');
    leftSide.className = "mediaContent_history_cardsLeft";
    let rightSide = document.createElement('div');
    rightSide.className = "mediaContent_history_cardsRight";
    let i = 0;
    cardObjectArray.forEach(card => {
        let currentContainer = document.createElement('div');
        currentContainer.className = "mediaContent_history_card";

        let leftElement = document.createElement('div');
        leftElement.className = "mediaContent_history_card_left";
        leftElement.innerHTML = card.leftHTML;
        currentContainer.appendChild(leftElement);

        let numberElement = document.createElement('div');
        numberElement.className = "mediaContent_history_card_number";
        numberElement.innerText = card.number;
        currentContainer.appendChild(numberElement);

        if (card.description) {
            let descriptionElement = document.createElement('div');
            descriptionElement.className = "mediaContent_history_card_description";
            descriptionElement.innerHTML = card.description;
            currentContainer.appendChild(descriptionElement);
        }

        if (i % 2 == 0) leftSide.appendChild(currentContainer);
        else rightSide.appendChild(currentContainer);
        i++;
    });
    fragment.appendChild(leftSide);
    fragment.appendChild(rightSide);
    return fragment;
}

function initMedia_history() {
    mediaContent_egyptDigits.appendChild(historyExamples_createCards(historyExamples_generateCardInfo_egypt()));
    mediaContent_romeDigits.appendChild(historyExamples_createCards(historyExamples_generateCardInfo_rome()));
}

initMedia_history();


mediaContent_arithmeticExamples_addition.appendChild(getArithmeticVisualization_Addition('100101', '1101', 2));
mediaContent_arithmeticExamples_subtraction.appendChild(getArithmeticVisualization_Subtraction('2a6', '48', 16));
mediaContent_arithmeticExamples_multiplication.appendChild(getArithmeticVisualization_Multiplication('2301', '21', 4));
mediaContent_arithmeticExamples_division.appendChild(getArithmeticVisualization_Division('6420', '12', 8));

/*
    Элементы для страницы "СС в информатике"
*/

function initMedia_computerExamples_binary() {
    let fragment = document.createDocumentFragment();
    let fragmentPowerTable = document.createDocumentFragment();
    let cells = [];
    for (let i = 0; i < 8; i++) {
        let mainTableCell = document.createElement('div');
        if (i % 2 == 0) mainTableCell.innerText = "1";
        else mainTableCell.innerText = "0";
        cells.push(mainTableCell);
        fragment.appendChild(mainTableCell);

        let powerTableCell = document.createElement('div');
        powerTableCell.className = "powerCell";
        powerTableCell.innerHTML = `2<sup>${7-i}</sup>`;
        fragment.appendChild(powerTableCell);
    }
    mediaContent_computerExamples_binaryTable.appendChild(fragment);
    setInterval(() => {
        let index = getRandomInt(0, cells.length-1);
        let currentCell = cells[index];
        if (currentCell.innerText == "1") {
            currentCell.innerText = "0";
        }
        else currentCell.innerText = "1";
        let string = "";
        for (let cell of cells) {
            cell.classList.remove('lastChanged');
            if (cell == currentCell) setTimeout(() => cell.classList.add('lastChanged'), 2);
            string += cell.innerText;
        }
        mediaContent_computerExamples_binaryAsDecimal.innerText = parseInt(string, 2);
    }, 750);
}

function initMedia_hexadecimalColor() {
    mediaContent_computerExamples_hexadecimalColorSlider_red.addEventListener('input', () => updateMedia_hexadecimalColor());
    mediaContent_computerExamples_hexadecimalColorSlider_green.addEventListener('input', () => updateMedia_hexadecimalColor());
    mediaContent_computerExamples_hexadecimalColorSlider_blue.addEventListener('input', () => updateMedia_hexadecimalColor());
    updateMedia_hexadecimalColor();
}

function updateMedia_hexadecimalColor() {
    let R = parseInt(mediaContent_computerExamples_hexadecimalColorSlider_red.value).toString(16);
    R = completeStringWithZeros(R, 2);
    let G = parseInt(mediaContent_computerExamples_hexadecimalColorSlider_green.value).toString(16);
    G = completeStringWithZeros(G, 2);
    let B = parseInt(mediaContent_computerExamples_hexadecimalColorSlider_blue.value).toString(16);
    B = completeStringWithZeros(B, 2);
    let colorHexCode = `#${R}${G}${B}`;
    mediaContent_computerExamples_hexadecimalColorPresentation.style.background = colorHexCode;
    mediaContent_computerExamples_hexadecimalColorText_red.innerText = R;
    mediaContent_computerExamples_hexadecimalColorText_green.innerText = G;
    mediaContent_computerExamples_hexadecimalColorText_blue.innerText = B;
}

function createComputerExamplesTable_binary() {
    let topRow = document.createElement('tr');
    let bottomRow = document.createElement('tr');
    for (let i = 1; i < 11; i++) {
        let topCell = document.createElement('td');
        topCell.innerText = i;
        topRow.appendChild(topCell);

        let bottomCell = document.createElement('td');
        bottomCell.innerText = i.toString(2);
        bottomRow.appendChild(bottomCell);
    }
    table_Base10toBase2.appendChild(topRow);
    table_Base10toBase2.appendChild(bottomRow);
}

function createComputerExamplesTable_octal() {
    let topRow = document.createElement('tr');
    let middleRow = document.createElement('tr');
    let bottomRow = document.createElement('tr');
    for (let i = 1; i < 8; i++) {
        let topCell = document.createElement('td');
        topCell.innerText = i;
        topRow.appendChild(topCell);

        let middleCell = document.createElement('td');
        middleCell.innerText = i.toString(2);
        middleRow.appendChild(middleCell);

        let bottomCell = document.createElement('td');
        bottomCell.innerText = i.toString(8);
        bottomRow.appendChild(bottomCell);
    }
    table_Base10toBase8.appendChild(topRow);
    table_Base10toBase8.appendChild(middleRow);
    table_Base10toBase8.appendChild(bottomRow);
}

function createComputerExamplesTable_hexadecimal() {
    let topRow = document.createElement('tr');
    let middleRow = document.createElement('tr');
    let bottomRow = document.createElement('tr');
    for (let i = 1; i < 8; i++) {
        let topCell = document.createElement('td');
        topCell.innerText = i;
        topRow.appendChild(topCell);

        let middleCell = document.createElement('td');
        middleCell.innerText = i.toString(2);
        middleRow.appendChild(middleCell);

        let bottomCell = document.createElement('td');
        bottomCell.innerText = i.toString(16);
        bottomRow.appendChild(bottomCell);
    }
    table_Base10toBase16.appendChild(topRow);
    table_Base10toBase16.appendChild(middleRow);
    table_Base10toBase16.appendChild(bottomRow);
}

function initMedia_computerExamples() {
    createComputerExamplesTable_binary();
    createComputerExamplesTable_octal();
    createComputerExamplesTable_hexadecimal();
    initMedia_computerExamples_binary();
    initMedia_hexadecimalColor();
}
initMedia_computerExamples();

/*
    Появление элементов на странице
*/

function revealTick(pageElement) {
    let elementArray = [...pageElement.getElementsByClassName("canReveal")];
    let windowHeight = window.innerHeight;
    let elementVisible = 150;
    elementArray.forEach(element => {
        let elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add("revealed");
            if (element.onReveal) element.onReveal();
        } 
        else {
            element.classList.remove("revealed");
            if (element.onUnreveal) element.onUnreveal();
        }
    });
}

function enableReveal() {
    pageElements.forEach(pageElement => {
        pageElement.addEventListener("scroll", () => revealTick(pageElement));
    });
}
enableReveal();

/*
    Система тестирования
*/

class QuestionTemplate {
    constructor(_question, _solution, _onGenerateValues) {
        this.questionText = _question;
        this.solutionText = _solution;
        this.onGenerateValues = (questionInstance) => {
            if (questionInstance instanceof Question) _onGenerateValues(questionInstance);
        };
    }
}

class Question {
    #generated = false;
    get generated() {
        return this.#generated;
    }

    generateValues() {
        if (this.#generated == true) return;
        this.template.onGenerateValues(this);
        this.#generated = true;
    }

    constructor(questionTemplate) {
        this.answerGiven = false;
        this.template = questionTemplate;
        this.questionText = this.template.questionText;
        this.solutionText = this.template.solutionText;
        this.answerInputContainer = document.createElement('div');
        this.answerInputContainer.className = "testSystem_progress_answerInput";
        this.solutionContainer = document.createElement('div');
        this.solutionContainer.className = "testSystem_progress_solution";
        this.generateValues();
    }
}

var questionTemplates = [
    new QuestionTemplate(
        `Вычислите: %%%<sub>%%%</sub> + %%%<sub>%%%</sub>. Ответ запишите в десятичной системе счисления.`,
        `<p>Можно пойти двумя путями:</p><p>1. Сложить два числа в исходной системе счисления, а затем перевести результат в десятичную:</p><div class="visualizationMarker"></div><div class="visualizationMarker"></div><p>2. Перевести каждое число в десятичную СС, а затем сложить:</p><div class="visualizationMarker"></div><div class="visualizationMarker"></div><div class="visualizationMarker"></div>`,
        (qi) => {
            let sourceRadix = getRandomInt(2, 8);
            let number1 = getRandomInt(20, 220).toString(sourceRadix);
            let number2 = getRandomInt(20, 220).toString(sourceRadix);
            let operationResult = (parseInt(number1, sourceRadix) + parseInt(number2, sourceRadix)).toString(sourceRadix);
            qi.questionText = qi.questionText.replace('%%%', number1).replace('%%%', sourceRadix).replace('%%%', number2).replace('%%%', sourceRadix);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                markerContainers[0].appendChild(getArithmeticVisualization_Addition(number1, number2, sourceRadix));
                markerContainers[1].appendChild(getConversionVisualization_Nto10(operationResult, sourceRadix));
                markerContainers[2].appendChild(getConversionVisualization_Nto10(number1, sourceRadix));
                markerContainers[2].appendChild(getConversionVisualization_Nto10(number2, sourceRadix));
                markerContainers[3].appendChild(getArithmeticVisualization_Addition(parseInt(number1, sourceRadix), parseInt(number2, sourceRadix), 10));
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == parseInt(operationResult);
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `Вычислите: %%%<sub>%%%</sub> - %%%<sub>%%%</sub>. Ответ запишите в десятичной системе счисления.`,
        `<p>Можно пойти двумя путями:</p><p>1. Вычесть одно число из другого в исходной системе счисления, а затем перевести результат в десятичную:</p><div class="visualizationMarker"></div><div class="visualizationMarker"></div><p>2. Перевести каждое число в десятичную СС, а затем произвести вычитание:</p><div class="visualizationMarker"></div><div class="visualizationMarker"></div><div class="visualizationMarker"></div>`,
        (qi) => {
            let sourceRadix = getRandomInt(2, 8);
            let number1 = getRandomInt(40, 220).toString(sourceRadix);
            let number2 = getRandomInt(20, parseInt(number1, sourceRadix)).toString(sourceRadix);
            let operationResult = (parseInt(number1, sourceRadix) - parseInt(number2, sourceRadix)).toString(sourceRadix);
            qi.questionText = qi.questionText.replace('%%%', number1).replace('%%%', sourceRadix).replace('%%%', number2).replace('%%%', sourceRadix);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                markerContainers[0].appendChild(getArithmeticVisualization_Subtraction(number1, number2, sourceRadix));
                markerContainers[1].appendChild(getConversionVisualization_Nto10(operationResult, sourceRadix));
                markerContainers[2].appendChild(getConversionVisualization_Nto10(number1, sourceRadix));
                markerContainers[2].appendChild(getConversionVisualization_Nto10(number2, sourceRadix));
                markerContainers[3].appendChild(getArithmeticVisualization_Subtraction(parseInt(number1, sourceRadix), parseInt(number2, sourceRadix), 10));
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == parseInt(operationResult);
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `Соедините экивалентные числа.`,
        `<p>Удобнее всего перевести числа в десятичную систему счисления.</p><div class="visualizationMarker"></div><div class="visualizationMarker"></div><div class="visualizationMarker"></div>`,
        (qi) => {
            let pairArray = [];
            for (let i = 0; i < 3; i++) {
                let radix = getRandomInt(2, 16, [10]);
                let decimal = getRandomInt(6, 48);
                pairArray.push({decimal: decimal, radix: radix, converted: decimal.toString(radix)});
            }
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                for (let i = 0; i < 3; i++) {
                    markerContainers[i].appendChild(getConversionVisualization_Nto10(pairArray[i].converted, pairArray[i].radix));
                }
            }
            let correctElementPairs = [];
            let dragElementBank = createDragElementSlot(3);
            dragElementBank.classList.add("testSystem_dragElementBank");
            qi.answerInputContainer.appendChild(dragElementBank);
            pairArray.forEach(pair => {
                let row = document.createElement('div');
                row.classList.add("testSystem_answerInputContainerRow");
                let left = document.createElement('div');
                left.innerHTML = `${pair.decimal}<sub>10</sub>`;
                row.appendChild(left);
                let right = createDragElementSlot(1);
                row.appendChild(right);
                let correctDragElement = createDragElement(`${pair.converted}<sub>${pair.radix}</sub>`);
                correctDragElement.decimalValue = pair.decimal;
                right.correctElement = correctDragElement;
                dragElementBank.appendChild(correctDragElement);
                qi.answerInputContainer.appendChild(row);
                correctElementPairs.push({slot: right, correctElement: correctDragElement});
            });
            qi.checkFunction = () => {
                correctElementPairs.forEach(pair => {
                    if (pair.slot.children[0] != pair.correctElement) return false;
                })
                return true;
            };
        }
    ),
    new QuestionTemplate(
        `Сколько единиц содержится в сумме чисел %%%<sub>2</sub> и %%%<sub>2</sub>?`,
        `Удобнее всего будет сложить эти числа напрямую: <div class="visualizationMarker"></div>`,
        (qi) => {
            let decimal1 = getRandomInt(40, 220);
            let decimal2 = getRandomInt(40, 220);
            let number1 = decimal1.toString(2);
            let number2 = decimal2.toString(2);
            let operationResult = (decimal1 + decimal2).toString(2);
            let answer = [...operationResult].filter(char => char == '1').length;
            qi.questionText = qi.questionText.replace('%%%', number1).replace('%%%', number2);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                markerContainers[0].appendChild(getArithmeticVisualization_Addition(number1, number2, 2));
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == answer;
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `Сравните числа и укажите для каждой пары соответствующий знак.`,
        `<div class="visualizationMarker"></div><div class="visualizationMarker"></div><div class="visualizationMarker"></div>`,
        (qi) => {
            let pairArray = [];
            // Меньше
            let radix = getRandomInt(2, 20, [10]);
            let decimal = getRandomInt(16, 160);
            let number = getRandomInt(6, decimal-1);
            pairArray.push({decimal: decimal, radix: radix, converted: number.toString(radix), symbol: '<'});
            // Больше
            radix = getRandomInt(2, 20, [10]);
            decimal = getRandomInt(6, 140);
            number = getRandomInt(decimal+1, 160);
            pairArray.push({decimal: decimal, radix: radix, converted: number.toString(radix), symbol: '>'});
            // Равно
            radix = getRandomInt(2, 20, [10]);
            decimal = getRandomInt(6, 160);
            pairArray.push({decimal: decimal, radix: radix, converted: decimal.toString(radix), symbol: '='});
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                for (let i = 0; i < 3; i++) {
                    markerContainers[i].appendChild(getConversionVisualization_Nto10(pairArray[i].converted, pairArray[i].radix));
                }
            }
            let correctElementPairs = [];
            let dragElementBank = createDragElementSlot(3);
            dragElementBank.classList.add("testSystem_dragElementBank");
            qi.answerInputContainer.appendChild(dragElementBank);
            pairArray.forEach(pair => {
                let row = document.createElement('div');
                row.classList.add("testSystem_answerInputContainerRow");
                let left = document.createElement('div');
                left.innerHTML = `${pair.decimal}<sub>10</sub> [ ] ${pair.converted}<sub>${pair.radix}</sub>`;
                row.appendChild(left);
                let right = createDragElementSlot(1);
                row.appendChild(right);
                let correctDragElement = createDragElement(pair.symbol);
                right.correctElement = correctDragElement;
                dragElementBank.appendChild(correctDragElement);
                qi.answerInputContainer.appendChild(row);
                correctElementPairs.push({slot: right, correctElement: correctDragElement});
            });
            qi.checkFunction = () => {
                let correct = true;
                correctElementPairs.forEach(pair => {
                    if (!pair.slot.children[0]) correct = false;
                    if (pair.slot.children[0] != pair.correctElement) correct = false;
                })
                return correct;
            };
        }
    ),
    new QuestionTemplate(
        `Переведите десятичное число %%% в систему счисления с основанием %%%. Сколько цифр %%% содержится в полученной записи?`,
        `<div class="visualizationMarker"></div>`,
        (qi) => {
            let targetRadix = getRandomInt(2, 16);
            let decimal = getRandomInt(40, 220);
            let number = decimal.toString(targetRadix);
            let charArray = [];
            [...number].forEach(char => {
                let foundEntry = charArray.find(entry => entry.char == char);
                if (!foundEntry) {
                    foundEntry = {char: char, count: 0}
                    charArray.push(foundEntry);
                }
                foundEntry.count++;
            });
            charArray.sort((a, b) => a.count - b.count);
            qi.questionText = qi.questionText.replace('%%%', decimal).replace('%%%', targetRadix).replace('%%%', charArray[0].char);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                markerContainers[0].appendChild(getConversionVisualization_10toN(decimal, targetRadix));
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == charArray[0].count;
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `Чему равно число %%%<sub>%%%</sub> в десятичной системе счисления?`,
        `<div class="visualizationMarker"></div>`,
        (qi) => {
            let sourceRadix = getRandomInt(2, 16);
            let decimal = getRandomInt(40, 220);
            let number = decimal.toString(sourceRadix);
            qi.questionText = qi.questionText.replace('%%%', number).replace('%%%', sourceRadix);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                markerContainers[0].appendChild(getConversionVisualization_Nto10(decimal, sourceRadix));
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == decimal;
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `Сколько единиц содержится в двоичной записи значения выражения: 2<sup>%%%</sup> + 2<sup>%%%</sup> - 2<sup>%%%</sup>?`,
        `Число 2<sup>%%%</sup> выглядит как единица и %%% нулей.<br>
        Если добавить к нему число 2<sup>%%%</sup>, то получится следующая запись: единица, %%% нулей, единица, %%% нулей.<br>
        Вычтем из этого числа 2<sup>%%%</sup>, получим: единица, %%% нулей, %%% единиц, %%% нулей.<br>
        В итоге выходит, что в этой записи %%% единиц.`,
        (qi) => {
            let power1 = getRandomInt(50, 120);
            let power2 = getRandomInt(14, power1-1);
            let power3 = getRandomInt(3, power2-2);
            let answer = 1+power2-power3;
            qi.questionText = qi.questionText.replace('%%%', power1).replace('%%%', power2).replace('%%%', power3);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let string = qi.solutionContainer.innerText;
                string = string.replace("%%%", power1).replace("%%%", power1)
                .replace("%%%", power2).replace("%%%", power1-power2).replace("%%%", power2)
                .replace("%%%", power3).replace("%%%", power1-power2+1).replace("%%%", power2-power3).replace("%%%", power3)
                .replace("%%%", 1+power2-power3);
                qi.solutionContainer.innerText = string;
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == answer;
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `Найдите наибольшее число среди чисел: %%%. Ответ запишите в десятичной системе счисления.`,
        `<div class="visualizationMarker"></div><div class="visualizationMarker"></div><div class="visualizationMarker"></div><div class="visualizationMarker"></div>`,
        (qi) => {
            let pairArray = [];
            let excludeRadixList = [10];
            let biggest = 0;
            let replaceStringParts = [];
            for (let i = 0; i < 4; i++) {
                let radix = getRandomInt(2, 16, excludeRadixList);
                let decimal = getRandomInt(16, 160);
                let number = getRandomInt(6, decimal-1);
                if (decimal > biggest) biggest = decimal;
                let object = {decimal: decimal, radix: radix, converted: number.toString(radix)}
                pairArray.push(object);
                excludeRadixList.push(radix);
                replaceStringParts.push(`${object.converted}<sub>${object.radix}</sub>`);
            }
            qi.questionText = qi.questionText.replace('%%%', replaceStringParts.join(', '));
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let markerContainers = qi.solutionContainer.getElementsByClassName('visualizationMarker');
                for (let i = 0; i < 4; i++) {
                    markerContainers[i].appendChild(getConversionVisualization_Nto10(pairArray[i].converted, pairArray[i].radix));
                }
            }
            let answerInput = document.createElement("input");
            answerInput.setAttribute('type', 'text');
            qi.checkFunction = () => {
                return parseInt(answerInput.value) == biggest;
            }
            qi.answerInputContainer.appendChild(answerInput);
        }
    ),
    new QuestionTemplate(
        `В алфавите системы счисления с основанием %%% по сравнению с десятичной содержится цифр:`,
        `Алфавит десятичной системы: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.<br>
        Алфавит системы с основанием: %%%.<br>`,
        (qi) => {
            let compareRadix = getRandomInt(2, 20, [10]);
            qi.questionText = qi.questionText.replace('%%%', compareRadix);
            qi.fillSolution = () => {
                qi.solutionContainer.innerHTML = qi.solutionText;
                let alphabetList = [];
                for (let i = 0; i < compareRadix; i++) {
                    alphabetList.push(i.toString(compareRadix));
                }
                let string = qi.solutionContainer.innerText;
                string = string.replace("%%%", alphabetList.join(', '));
                qi.solutionContainer.innerText = string;
            }
            let dragElementBank = createDragElementSlot(2);
            dragElementBank.classList.add("testSystem_dragElementBank");
            qi.answerInputContainer.appendChild(dragElementBank);

            let answerElementSlot = createDragElementSlot(1);
            qi.answerInputContainer.appendChild(answerElementSlot);
            
            let dragElement_more = createDragElement("больше");
            dragElementBank.appendChild(dragElement_more);

            let dragElement_less = createDragElement("меньше");
            dragElementBank.appendChild(dragElement_less);

            if (compareRadix > 10) {
                answerElementSlot.correctElement = dragElement_more;
            }
            else {
                answerElementSlot.correctElement = dragElement_less;
            }

            qi.checkFunction = () => {
                if (!answerElementSlot.children[0]) return false;
                if (answerElementSlot.children[0] != answerElementSlot.correctElement) return false;
                return true;
            };
        }
    )
];

class TestSystem {
    getRandomQuestions(targetCount = 8) {
        let questionList = [];
        for (let i = 0; i < targetCount; i++) {
            questionList.push( new Question( questionTemplates[getRandomInt(0,questionTemplates.length-1)] ) );
        }
        return questionList;
    }
    startTest() {
        testSystem_progress_header_questionButtons.innerHTML = "";
        this.currentQuestionArray = this.getRandomQuestions( parseInt(testSystem_home_rightQuestionCountSlider.value) );
        for (let i = 0; i < this.currentQuestionArray.length; i++) {
            let newButton = document.createElement('button');
            newButton.innerText = (i+1);
            newButton.addEventListener('click', () => {
                this.switchToQuestion(i);
            })
            testSystem_progress_header_questionButtons.appendChild(newButton);
        }
        this.state = "progress";
        this.switchToQuestion(0);
        this.startDate = new Date();
        testSystem_progress_middle_answerInputContainer.style.pointerEvents = "unset";
        document.body.classList.add('testInProgress');
        goToPage('+');
    }
    completeTest() {
        let i = 0;
        let correct = 0;
        this.currentQuestionArray.forEach(question => {
            let isCorrect = question.checkFunction();
            let foundButton = testSystem_progress_header_questionButtons.children[i];
            if (isCorrect) {
                foundButton.classList.add('correctAnswer');
                correct++;
            }
            else foundButton.classList.add('incorrectAnswer');
            question.fillSolution();
            i++;
        });
        testSystem_progress_middle_answerInputContainer.style.pointerEvents = "none";
        this.state = "completed";
        let now = new Date();
        let completionDelta = Math.round((now.getTime() - this.startDate.getTime()) / 1000);
        this.history.push({time: Math.round(this.startDate.getTime() / 1000), questions: this.currentQuestionArray.length, correctAnswers: correct, completionTime: completionDelta})
    }
    exitTest() {
        this.currentQuestionArray = null;
        this.currentQuestion = null;
        this.currentQuestionIndex = null;
        this.startDate = null;
        this.state = "idle";
        this.updateHistory();
        this.displayHistory();
        document.body.classList.remove('testInProgress');
        goToPage('-');
    }
    switchToQuestion(targetIndex) {
        if (!this.currentQuestionArray[targetIndex]) return null;
        if (testSystem_progress_header_questionButtons.children[this.currentQuestionIndex]) {
            testSystem_progress_header_questionButtons.children[this.currentQuestionIndex].classList.remove('active');
        }
        this.currentQuestion = this.currentQuestionArray[targetIndex];
        this.currentQuestionIndex = targetIndex;
        testSystem_progress_middle_questionText.innerHTML = this.currentQuestion.questionText;
        testSystem_progress_middle_answerInputContainer.innerHTML = "";
        testSystem_progress_middle_answerInputContainer.appendChild(this.currentQuestion.answerInputContainer);
        testSystem_progress_middle_solutionContainer.innerHTML = "";
        if (this.state == "completed") {
            testSystem_progress_middle_solutionContainer.appendChild(this.currentQuestion.solutionContainer);
        }
        testSystem_progress_header_progressBar.value = targetIndex / (this.currentQuestionArray.length);
        testSystem_progress_header_questionButtons.children[this.currentQuestionIndex].classList.add('active');
    }
    getHistory() {
        let string = localStorage.getItem('testSystemHistory');
        if (!string) return [];
        try {
            let object = JSON.parse(string);
            return object;
        }
        catch {
            return [];
        }
    }
    updateHistory() {
        try {
            localStorage.setItem('testSystemHistory', JSON.stringify(this.history));
        }
        catch {

        }
    }
    displayHistory() {
        testSystem_home_history.innerHTML = "";
        this.history.forEach(currentObject => {
            let date = new Date(currentObject.time * 1000);
            let container = document.createElement('div');
            let completionTime_minutes = Math.floor(currentObject.completionTime / 60);
            let completionTime_seconds = currentObject.completionTime - 60 * completionTime_minutes;
            let display_hours = completeStringWithZeros(date.getHours(), 2);
            let display_minutes = completeStringWithZeros(date.getMinutes(), 2);
            container.className = "testSystem_home_historyEntryContainer";
            container.innerHTML = `
                <div class="testSystem_home_historyEntryDate">${date.getFullYear()}.${date.getMonth()+1}.${date.getDay()} ${display_hours}:${display_minutes}</div>
                <div class="testSystem_home_historyEntryPercentage">${ Math.round(currentObject.correctAnswers / currentObject.questions * 100) }%</div>
                <div class="testSystem_home_historyEntryScore">${currentObject.correctAnswers} / ${currentObject.questions}</div>
                <div class="testSystem_home_historyEntryTime">Время выполнения: ${completionTime_minutes} м ${completionTime_seconds} с</div>
            `;
            testSystem_home_history.appendChild(container);
        });
    }
    constructor() {
        this.currentQuestion = null;
        this.currentQuestionArray = null;
        this.currentQuestionIndex = null;
        this.history = this.getHistory();
        this.displayHistory();
        testSystem_home_startButton.addEventListener('click', () => {
            this.startTest();
        });
        
        testSystem_progress_answerSubmitButton.addEventListener('click', () => {
            this.currentQuestion.answerGiven = true;
            testSystem_progress_header_questionButtons.children[this.currentQuestionIndex].classList.add('answerGiven');
            this.switchToQuestion(this.currentQuestionIndex + 1);
        });

        testSystem_home_rightQuestionCountSlider.addEventListener('input', () => {
            testSystem_home_rightQuestionCountIndicator.innerText = testSystem_home_rightQuestionCountSlider.value;
        });

        testSystem_progress_endTestButton.addEventListener('click', () => {
            this.completeTest();
        });

        testSystem_progress_header_closeButton.addEventListener('click', () => {
            this.exitTest();
        });
    }
}

var testSystem = new TestSystem();

goToPage(0);