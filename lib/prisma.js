import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
    host: "mysql-3868fd7f-bps-web-scrap.h.aivencloud.com",
    port: 13630,
    user: "avnadmin",
    password: process.env.DB_PASSWORD,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false,
    },
    connectTimeout: 15000,
    connectionLimit: 5,
})

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

export default prisma