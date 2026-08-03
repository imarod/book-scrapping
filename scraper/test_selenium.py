from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


URL = "https://books.toscrape.com"

options =Options()
options.add_argument("start-maximized")

driver = webdriver.Chrome(options=options)
driver.get(URL)

wait = WebDriverWait(driver, 15)

try :
    book_list = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "ol.row")))
    print("Berhasil menemukan daftar buku!")

    books = book_list.find_elements(By.TAG_NAME, "li"  )
    print(f"Jumlah buku yang ditemukan: {len(books)}")

except TimeoutException:
    print("Gagal menemukan daftar buku.")

driver.quit()