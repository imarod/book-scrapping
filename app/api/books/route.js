import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page")) || 1
        const limit = parseInt(searchParams.get("limit")) || 12
        const skip = (page - 1) * limit

        const sort = searchParams.get("sort") || "newest"
        let orderBy = { created_at: "desc" }
        if (sort === "rating_desc") orderBy = { rating: "desc" }
        if (sort === "rating_asc") orderBy = { rating: "asc" }
        if (sort === "newest") orderBy = { created_at: "desc" }
        if (sort === "oldest") orderBy = { created_at: "asc" }

        const stockParam = searchParams.get("stock")
        let whereClause = {}
        if (stockParam) {
            const stockList = stockParam.split(",")
            const conditions = []
            if (stockList.includes("in")) {
                conditions.push({ availability: { contains: "In stock" } })
            }
            if (stockList.includes("out")) {
                conditions.push({ availability: { contains: "Out of stock" } })
            }
            if (conditions.length > 0) {
                whereClause = { OR: conditions }
            }
        }

        const [books, totalBooks] = await Promise.all([
            prisma.books.findMany({
                where: whereClause,
                orderBy: orderBy,
                skip: skip,
                take: limit,
            }),
            prisma.books.count({ where: whereClause })
        ])
        return NextResponse.json({
            books: books,
            pagination: {
                page: page,
                limit: limit,
                totalBooks: totalBooks,
                totalPages:Math.ceil(totalBooks / limit)
            },
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "gagal mengambil data buku" },
            { status: "500" }
        )
    }
}

export async function POST(request) {
    try {
        const body = await request.json()

        if (!body.title || !body.price) {
            return NextResponse.json(
                { error: "Title dan Price wajib diisi" },
                { status: 400 }
            )
        }

        const newBook = await prisma.books.create({
            data: {
                title: body.title,
                price: body.price,
                rating: body.rating || null,
                availability: body.availability || null,
                relative_link: body.relative_link || null,
                image_url: body.image_url || null,

            },
        })

        return NextResponse.json(newBook, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Gagal menambahkan buku" },
            { status: 500 }
        )
    }
}