const { By, until } = require('selenium-webdriver');

class SchedulePage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://mospolytech.ru/';
        this.scheduleButtonLocator = By.xpath("//a[@class='user-nav__item-link' and @title='Расписание']");
        this.viewOnSiteButtonLocator = By.xpath("//a[@href='https://rasp.dmami.ru/' and @class='btn text-button']");
        this.searchInputLocator = By.xpath("//input[@class='groups']");
        this.searchResultLocator = By.xpath("//div[@id='221-322']");
        this.highlightedDayLocator = By.xpath("//div[contains(@class, 'schedule-day_today')]");
    }

    // Открытие страницы и максимизация окна браузера
    async openPage() {
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
    }

    // Клик на кнопку "Расписание"
    async navigateToSchedule() {
        await this.driver.wait(until.elementLocated(this.scheduleButtonLocator), 5000);
        await this.driver.findElement(this.scheduleButtonLocator).click();
    }

    // Клик на кнопку "Посмотреть на сайте"
    async clickViewScheduleOnSite() {
        await this.driver.wait(until.elementLocated(this.viewOnSiteButtonLocator), 5000);
        await this.driver.findElement(this.viewOnSiteButtonLocator).click();
    }

    // Ввод номера группы в поле поиска
    async inputGroupNumber(groupNumber) {
        await this.driver.wait(until.elementLocated(this.searchInputLocator), 5000);
        await this.driver.findElement(this.searchInputLocator).sendKeys(groupNumber);
        await this.driver.sleep(1000); // Короткая пауза для ввода
    }

    // Клик на результат поиска
    async selectSearchResult() {
        await this.driver.wait(until.elementLocated(this.searchResultLocator), 5000);
        await this.driver.findElement(this.searchResultLocator).click();
    }

    // Проверка, что текущий день выделен
    async isTodayHighlighted() {
        let highlightedDay = await this.driver.findElement(this.highlightedDayLocator);
        return highlightedDay.isDisplayed();
    }

    // Получение расписания на выделенный день
    async getTodaySchedule() {
        let highlightedDay = await this.driver.findElement(this.highlightedDayLocator);
        let dayTitle = await highlightedDay.findElement(By.xpath(".//div[@class='bold schedule-day__title']")).getText();
        let schedulePairs = await highlightedDay.findElements(By.xpath(".//div[@class='pair']"));

        let schedule = [];
        for (let pair of schedulePairs) {
            let time = await pair.findElement(By.xpath(".//div[@class='time']")).getText();
            let lessons = await pair.findElements(By.xpath(".//div[@class='schedule-lesson']"));

            let lessonsDetails = [];
            for (let lesson of lessons) {
                let auditory = await lesson.findElement(By.xpath(".//div[@class='schedule-auditory']")).getText();
                let lessonName = await lesson.findElement(By.xpath(".//div[@class='bold small']")).getText();
                let teacher = await lesson.findElement(By.xpath(".//div[@class='teacher small']/span")).getText();
                let dates = await lesson.findElement(By.xpath(".//div[@class='schedule-dates']")).getText();

                lessonsDetails.push({
                    auditory,
                    lessonName,
                    teacher,
                    dates
                });
            }
            schedule.push({ time, lessons: lessonsDetails });
        }

        return { dayTitle, schedule };
    }
}

module.exports = SchedulePage;
