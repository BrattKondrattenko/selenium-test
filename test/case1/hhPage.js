const { By, until } = require('selenium-webdriver');

class HhPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://hh.ru/';
        this.searchInput = By.xpath("//input[@data-qa='search-input']");
        this.searchButton = By.xpath("//button[@data-qa='search-button']");
        this.jobListing = By.xpath("//div[contains(@data-qa, 'vacancy-serp__vacancy')]");
        this.closeRegistrationPopupButton = By.xpath("//div[@data-qa='bloko-modal-close']");
    }

    // Открытие страницы и максимизация окна браузера
    async openPage() {
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
        await this.driver.sleep(5000); // Пауза для полной загрузки страницы
    }

    // Закрытие окна регистрации, если оно появляется
    async closeRegistrationPopup() {
        try {
            await this.driver.wait(until.elementLocated(this.closeRegistrationPopupButton), 15000);
            const closeButton = await this.driver.findElement(this.closeRegistrationPopupButton);
            await closeButton.click();
        } catch (error) {
            console.log("Окно регистрации не появилось.");
        }
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

    // Клик на первую вакансию в списке
    async clickFirstJobListing() {
        await this.driver.wait(until.elementLocated(this.jobListing), 10000);
        let firstJob = await this.driver.findElement(this.jobListing);
        await firstJob.findElement(By.xpath(".//span[@data-qa='serp-item__title']")).click();
    }
}

module.exports = HhPage;
