const { By, until } = require('selenium-webdriver');

class HhPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://hh.ru/';
        this.searchInput = By.xpath("//input[contains(@data-qa, 'search-input')]");
        this.searchButton = By.xpath("//button[contains(@data-qa, 'search-button')]");
        this.jobListing = By.xpath("//div[contains(@data-qa, 'vacancy-serp__vacancy')]");
        this.firstJobTitle = ".//a[contains(@data-qa, 'serp-item__title')]";
        this.firstJobCompany = ".//a[contains(@data-qa, 'vacancy-serp__vacancy-employer')]";
        this.firstJobLocation = ".//span[contains(@data-qa, 'vacancy-serp__vacancy-address')]";
    }

    // Открытие страницы и максимизация окна браузера
    async openPage() {
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
        await this.driver.sleep(5000); // Пауза для полной загрузки страницы
    }

    // Ввод текста в поле поиска
    async inputSearchQuery(query) {
        await this.driver.wait(until.elementLocated(this.searchInput), 10000);
        const searchInputElement = await this.driver.findElement(this.searchInput);
        await searchInputElement.clear();
        await searchInputElement.sendKeys(query);
    }

    // Клик на кнопку поиска
    async clickSearchButton() {
        await this.driver.wait(until.elementLocated(this.searchButton), 10000);
        await this.driver.findElement(this.searchButton).click();
    }

    // Проверка наличия результатов поиска
    async isJobListingVisible() {
        await this.driver.wait(until.elementLocated(this.jobListing), 10000);
        let jobListings = await this.driver.findElements(this.jobListing);
        return jobListings.length > 0;
    }

    // Получение информации о первой вакансии в списке
    async getFirstJobListingInfo() {
        await this.driver.wait(until.elementLocated(this.jobListing), 10000);
        let firstJob = await this.driver.findElement(this.jobListing);

        let jobTitle = await firstJob.findElement(By.xpath(this.firstJobTitle)).getText();
        let companyName = await firstJob.findElement(By.xpath(this.firstJobCompany)).getText();
        let jobLocation = await firstJob.findElement(By.xpath(this.firstJobLocation)).getText();

        return { jobTitle, companyName, jobLocation };
    }

    // Клик на первую вакансию в списке
    async clickFirstJobListing() {
        await this.driver.wait(until.elementLocated(this.jobListing), 10000);
        let firstJob = await this.driver.findElement(this.jobListing);
        await firstJob.findElement(By.xpath(this.firstJobTitle)).click();
    }
}

module.exports = HhPage;
