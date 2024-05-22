const assert = require('assert');
const { Builder, Browser } = require('selenium-webdriver');
const SchedulePage = require('./shedule');
const fs = require('fs');

describe('Тестирование страницы расписания', function() {
    this.timeout(30000);
    let driver;
    let schedulePage;

    // Инициализация драйвера и открытие страницы перед началом тестов
    before(async () => {
        driver = new Builder().forBrowser(Browser.CHROME).build();
        schedulePage = new SchedulePage(driver);
        await schedulePage.openPage();
    });

    // Завершение работы драйвера после выполнения всех тестов
    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    // Сохранение скриншота при падении теста
    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            let testName = this.currentTest.title.replace(/\s+/g, '_');
            let date = new Date().toISOString().replace(/:/g, '-');
            let screenshotName = `${testName}_${date}.png`;
            let image = await driver.takeScreenshot();
            fs.writeFileSync(screenshotName, image, 'base64');
        }
    });

    // Тест на переход на страницу расписания
    it('Перейти на страницу расписания', async () => {
        await schedulePage.navigateToSchedule();
        await driver.sleep(1000);
        console.log('Шаг 1. Перешел на страницу расписания');
    });

    // Тест на открытие расписания на сайте в новой вкладке
    it('Открыть расписание на сайте в новой вкладке', async () => {
        await schedulePage.clickViewScheduleOnSite();
        await driver.sleep(1000);

        let handles = await driver.getAllWindowHandles();
        assert.equal(handles.length, 2, "Ожидалось, что будет открыта новая вкладка");
        await driver.switchTo().window(handles[1]);

        console.log('Шаг 2. Открыл расписание на сайте в новой вкладке');
    });

    // Тест на ввод номера группы и отображение результатов поиска
    it('Ввести номер группы и отобразить результаты поиска', async () => {
        await schedulePage.inputGroupNumber('221-322');
        await driver.sleep(1000);

        let searchResult = await driver.findElement(schedulePage.searchResultLocator);
        let resultText = await searchResult.getText();
        assert.ok(resultText.includes('221-322'), "В результатах поиска не отображается искомая группа");

        console.log('Шаг 3. Ввел номер группы и отобразил результаты поиска');
    });

    // Тест на открытие страницы расписания выбранной группы
    it('Открыть страницу расписания выбранной группы', async () => {
        await schedulePage.selectSearchResult();
        await driver.sleep(3000);

        console.log('Шаг 4. Открыл страницу расписания выбранной группы');
    });

    // Тест на выделение текущего дня недели в расписании
    it('Выделить текущий день недели в расписании', async () => {
        let isHighlighted = await schedulePage.isTodayHighlighted();
        assert.ok(isHighlighted, "Текущий день недели не выделен в расписании");

        let schedule = await schedulePage.getTodaySchedule();
        console.log(`Текущий день недели: ${schedule.dayTitle}`);
        for (let pair of schedule.schedule) {
            console.log(`Время: ${pair.time}`);
            for (let lesson of pair.lessons) {
                console.log(`Аудитория: ${lesson.auditory}`);
                console.log(`Занятие: ${lesson.lessonName}`);
                console.log(`Преподаватель: ${lesson.teacher}`);
                console.log(`Даты: ${lesson.dates}`);
            }
        }

        console.log('Шаг 5. Выделил текущий день недели в расписании и вывел его в консоль');
    });
});
