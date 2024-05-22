const { Builder, By, Browser } = require('selenium-webdriver');
const assert = require('assert');

// Настройка браузера для теста
const BrowserType = Browser.CHROME;
const URL = 'https://market.yandex.ru/';
const STOP = 3000;  // Время задержки в миллисекундах

let driver = new Builder().forBrowser(BrowserType).build();

// Класс для работы со страницей Яндекс Маркета
class YandexMarketPage {
    constructor(driver) {
        this.driver = driver;
        this.locator = {
            hamburger: By.xpath("//div[@data-zone-name='catalog']"),
            everythingForGaming: By.xpath("//span[contains(text(), 'Все для гейминга')]"),
            gamingPhones_url: By.xpath("//a[@href='/catalog--igrovye-telefony/41813550/list?hid=91491&glfilter=24892510%3A24892650%2C24892590%2C39026134%2C24892630%2C24892692']")
        };
    }

    // Метод для навигации на сайт
    async navigate() {
        await driver.get(URL);
        await driver.manage().window().maximize();
        await driver.sleep(STOP);
    }

    // Метод для выбора категории товаров
    async selectCategory() {
        await this.driver.findElement(this.locator.hamburger).click();
        await driver.sleep(STOP);
        let getEverythingForGaming = await this.driver.findElement(this.locator.everythingForGaming);
        await driver.sleep(STOP);
        let hover = getEverythingForGaming;
        let action = this.driver.actions({ async: true });
        await action.move({ origin: hover }).perform();
        await driver.sleep(STOP);
        await this.driver.findElement(this.locator.gamingPhones_url).click();
        await driver.sleep(STOP);
    }
}

// Класс для работы со страницей телефонов
class PhonePage {
    constructor(driver) {
        this.driver = driver;
        this.locator = {
            fiveTitle: By.xpath("//div[@data-auto-themename='listDetailed']//h3[@data-auto='snippet-title']"),
            fivePrice: By.xpath("//div[@data-auto-themename='listDetailed']//span[@data-auto='snippet-price-current']"),
            onlySamsung: By.xpath("//div[@data-zone-name='FilterValue']//label[@data-auto='filter-list-item-153061']")
        };
        this.tenSamsung = [];
    }

    // Метод для логирования первых пяти продуктов
    async logFirstFiveProducts() {
        let logFiveTitle = await this.driver.findElements(this.locator.fiveTitle);
        let logFivePrice = await this.driver.findElements(this.locator.fivePrice);
        await driver.sleep(STOP);
        for (let i = 0; i < 5; i++) {
            let title = await logFiveTitle[i].getText();
            let price = await logFivePrice[i].getText();
            console.log(`Название ${i + 1}: ${title}, Цена: ${price}`);
        }
        await driver.sleep(STOP);
    }

    // Метод для фильтрации только по Samsung
    async showOnlySamsung() {
        await this.driver.findElement(this.locator.onlySamsung).click();
        await driver.sleep(STOP);
        let titleSamsung = await this.driver.findElements(this.locator.fiveTitle);
        for (let i = 0; i < 10; i++) {
            let tenTitleSamsung = await titleSamsung[i].getText();
            this.tenSamsung.push(tenTitleSamsung);
        }
    }
}

// Описание теста для проверки фильтрации товаров по производителю
describe('Тестирование фильтрации товаров по производителю', function () {
    this.timeout(100000);
    it('Главная страница', async function () {
        try {
            let yandexMarketPage = new YandexMarketPage(driver);
            await yandexMarketPage.navigate();
            await yandexMarketPage.selectCategory();
        }
        catch (err) {
            console.error('Ошибка: %s', err);
            await driver.takeScreenshot().then(function (image) {
                require('fs').writeFileSync('screenshot_error.png', image, 'base64');
            });
        }
    });
    it('Поиск устройств', async function () {
        try {
            let phonePage = new PhonePage(driver);
            await phonePage.logFirstFiveProducts();
            await phonePage.showOnlySamsung();

            phonePage.tenSamsung.forEach(item => {
                assert.ok(item.includes('Samsung'), "Не все элементы имеют слово Samsung");
            });
        }
        catch (err) {
            console.error('Ошибка: %s', err);
            await driver.takeScreenshot().then(function (image) {
                require('fs').writeFileSync('screenshot_error.png', image, 'base64');
            });
        }
    });
    after(async function () {
        await driver.quit();
    });
});
