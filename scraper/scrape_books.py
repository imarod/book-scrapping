from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from urllib.parse import urljoin

import csv

URL_BASE = "https://books.toscrape.com/catalogue/page-{}.html"
TOTAL_PAGES = 5

RATING_MAP = {
    "One" : 1,
    "Two" : 2,  
    "Three" : 3,
    "Four" : 4, 
    "Five" : 5
}

options = Options()
options.add_argument("start-maximized")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 15)

hasil = []

for page_num in range(1, TOTAL_PAGES + 1):
    url = URL_BASE.format(page_num)
    print(f"Mengakses halaman {page_num}: {url}")
    driver.get(url)
    wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "ol.row")))

    soup = BeautifulSoup(driver.page_source, "html.parser")
    book_elements = soup.select('article.product_pod')

    for book in book_elements:
        title = book.h3.a["title"]
        price = book.select_one("p.price_color").text.replace("£", "").strip()
        rating_word = book.select_one("p.star-rating") ["class"] [1]
        rating = RATING_MAP.get(rating_word, 0)
        availability = book.select_one("p.instock.availability").text.strip()
        relative_link = book.h3.a["href"]
        image_relative = book.select_one("div.image_container img") ["src"]
        image_url = urljoin("https://books.toscrape.com/catalogue/", image_relative)

        hasil.append({
            "title" : title,
            "price": price,
            "rating" : rating,
            "availability": availability,
            "relative_link" : relative_link,
            "image_url": image_url,
        })



driver.quit()
print("\nContoh 3 buku pertama: ")
for buku in hasil:
    print(buku)


with open("scrapping_buku.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["title", "price", "rating", "availability", "relative_link", "image_url"])
    writer.writeheader()
    writer.writerows(hasil)

print(f"\nData berhasil disimpan")
print(f"\nTotal buku: {len(hasil)}")