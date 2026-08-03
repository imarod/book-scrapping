import mariadb from "mariadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await mariadb.createConnection({
      host: "mysql-3868fd7f-bps-web-scrap.h.aivencloud.com",
      port: 13630,
      user: "avnadmin",
      password: process.env.DB_PASSWORD,
      database: "defaultdb",
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 15000,
    });

    const rows = await conn.query("SELECT COUNT(*) as total FROM books");
    await conn.end();

    return NextResponse.json({
      status: "berhasil konek!",
      total_buku: rows[0].total,
      db_password_ada: !!process.env.DB_PASSWORD,
      db_ca_cert_ada: !!process.env.DB_CA_CERT,
    });
  } catch (error) {
    return NextResponse.json({
      status: "gagal konek",
      error_message: error.message,
      error_code: error.code,
      db_password_ada: !!process.env.DB_PASSWORD,
      db_ca_cert_ada: !!process.env.DB_CA_CERT,
    });
  }
}