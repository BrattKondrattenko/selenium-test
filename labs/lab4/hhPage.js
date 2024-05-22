const { By, until } = require('selenium-webdriver');

class HhPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://hh.ru/';
        this.searchInput = By.xpath("//input[@data-qa='search-input']");
        this.searchButton = By.xpath("//button[@data-qa='search-button']");
        this.jobListing = By.xpath("//div[@data-qa='vacancy-serp__vacancy']");
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

        let jobTitle = await firstJob.findElement(By.xpath(".//a[@data-qa='serp-item__title']")).getText();
        let companyName = await firstJob.findElement(By.xpath(".//a[@data-qa='vacancy-serp__vacancy-employer']")).getText();
        let jobLocation = await firstJob.findElement(By.xpath(".//span[@data-qa='vacancy-serp__vacancy-address']")).getText();

        return { jobTitle, companyName, jobLocation };
    }

    // Клик на первую вакансию в списке
    async clickFirstJobListing() {
        await this.driver.wait(until.elementLocated(this.jobListing), 10000);
        let firstJob = await this.driver.findElement(this.jobListing);
        await firstJob.findElement(By.xpath(".//a[@data-qa='serp-item__title']")).click();
    }
}

module.exports = HhPage;
