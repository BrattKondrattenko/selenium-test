const { By, until } = require('selenium-webdriver');

class HhPage2 {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://hh.ru/';
        this.employersLink = By.xpath("//a[contains(@data-qa, 'mainmenu_employer')]");
        this.employersSearchInput = By.xpath("//input[contains(@data-qa, 'employer-index-search-input')]");
        this.academicCheckbox = By.xpath("//span[contains(@data-qa, 'serp__novafilter-item-text')]");
        this.searchButton = By.xpath("//button[@data-qa='employer-index-search-submit']");
    }

    async openPage() {
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
        await this.driver.sleep(5000); // Пауза для полной загрузки страницы
    }

    // Переход на страницу "Работодателям"
    async goToEmployersPage() {
        await this.driver.wait(until.elementLocated(this.employersLink), 10000);
        const employersLinkElement = await this.driver.findElement(this.employersLink);
        await employersLinkElement.click();
    }

    // Ввод текста в поле поиска на странице "Работодателям"
    async inputEmployersSearchQuery(query) {
        await this.driver.wait(until.elementLocated(this.employersSearchInput), 10000);
        const searchInputElement = await this.driver.findElement(this.employersSearchInput);
        await searchInputElement.clear();
        await searchInputElement.sendKeys(query);
    }

    async clickSearchButton() {
        await this.driver.wait(until.elementLocated(this.searchButton), 10000);
        await this.driver.findElement(this.searchButton).click();
    }

    // Выбор чекбокса "Академический"
    async selectAcademicCheckbox() {
        await this.driver.wait(until.elementLocated(this.academicCheckbox), 10000);
        const academicCheckboxElement = await this.driver.findElement(this.academicCheckbox);
        await academicCheckboxElement.click();
    }
}

module.exports = HhPage2;
