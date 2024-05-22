const assert = require('assert');
const { Builder, By } = require('selenium-webdriver');

// Инициализация драйвера для браузера Chrome
let driver = new Builder().forBrowser('chrome').build();

describe('Тестовый набор задач', function() {
    this.timeout(30000);
    it('Загрузить страницу приложения "Список дел" и выполнить действия', function() {
        return (async () => {
            try {
                // Открытие страницы и максимизация окна браузера
                await driver.get("https://lambdatest.github.io/sample-todo-app/");
                await driver.manage().window().maximize();
                await driver.sleep(1000); // Небольшая пауза для визуализации

                // Проверка заголовка страницы
                const title = await driver.getTitle();
                assert.equal(title, "Sample page - lambdatest.com");

                // Проверка начального текста оставшихся задач
                let textElement = await driver.findElement(By.xpath("//span[contains(@class, 'ng-binding')]"));
                let text = await textElement.getText();
                assert.equal(text, "5 of 5 remaining");

                // Проверка класса первого элемента списка
                let firstListItem = await driver.findElement(By.xpath("//ul/li[1]"));
                let firstItemClass = await firstListItem.getAttribute("class");
                assert.equal(firstItemClass.includes("done-true"), false);

                // Установка галочки на первом элементе списка
                await driver.findElement(By.xpath("//ul/li[1]/input")).click();

                // Проверка изменения класса первого элемента списка
                firstItemClass = await firstListItem.getAttribute("class");
                assert.equal(firstItemClass.includes("done-false"), false);

                // Установка галочек на всех элементах списка
                for (let i = 1; i <= 5; i++) {
                    let listItem = await driver.findElement(By.xpath(`//ul/li[${i}]`));
                    await driver.findElement(By.xpath(`//ul/li[${i}]/input`)).click();
                    let itemClass = await listItem.getAttribute("class");
                    assert.equal(itemClass.includes("done-false"), false);
                }

                // Добавление нового элемента в список
                await driver.findElement(By.id("sampletodotext")).sendKeys("New Item");
                await driver.findElement(By.id("addbutton")).click();

                // Клик по новому элементу списка
                let newItem = await driver.findElement(By.xpath("//ul/li[6]"));
                await newItem.click();

                console.log('Все шаги успешно выполнены');
            } catch (err) {
                // Сохранение скриншота при ошибке
                await driver.takeScreenshot().then(function (image) {
                    require('fs').writeFileSync('screenshot_error.png', image, 'base64');
                });
                console.error('Ошибка при выполнении теста: %s', err);
                throw err;
            } finally {
                // Завершение работы драйвера
                await driver.quit();
            }
        })();
    });
});
