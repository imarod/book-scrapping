import csv
import mysql.connector

config = {
    "host" : "localhost",
    "user" : "root",
    "password" : "",
    "database" : "book_scrap"
}

TOTAL_DATA = 50

data_buku = []

with open ("scrapping_buku.csv", "r", encoding="utf-8") as file :
    reader = csv.DictReader(file)
    for i, row in enumerate(reader):
        if i>= TOTAL_DATA:
            break
        data_buku.append(row)
print(f"Berhasil baca {len(data_buku)} baris dari CSV")

conn = mysql.connector.connect(**config)
cursor = conn.cursor()

insert_query = """
    INSERT INTO books (title, price, rating, availability, relative_link, image_url)
    VALUES (%s, %s, %s, %s,%s,%s)
"""

jumlah_berhasil = 0
for buku in data_buku:
    values = (
        buku["title"],
        buku["price"],
        buku["rating"],
        buku["availability"],
        buku["relative_link"],
        buku["image_url"]
    )
    cursor.execute(insert_query, values)
    jumlah_berhasil += 1

conn.commit()

print(f"Berhasil import {jumlah_berhasil} buku ke database")
cursor.close()
conn.close()
