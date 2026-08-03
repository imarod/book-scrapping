import { title } from "node:process";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { relative } from "node:path";

export async function PUT(request, {params}) {
    try{
        const {id} = await params
        const body = await request.json()

        const updatedBook = await prisma.books.update({
            where: {id: parseInt(id)},
            data: {
                title: body.title,
                price: body.price,
                rating: body.rating,
                availability: body.availability,
                relative_link: body.relative_link,
                image_url: body.image_url,
            }
        })

        return NextResponse.json(updatedBook)
    }catch(error) {
        console.error(error)
        return NextResponse.json(
            {error: "Gagal mengupdate buku"},
            {status: 500}
        )
    }
}

export async function DELETE(request, {params}) {
    try {
        const {id} = await params
        await prisma.books.delete({
            where: {id: parseInt(id)},
        })
        return NextResponse.json({message: "Buku berhasil dihapus"})
    }catch(error) {
        console.error(error)
        return NextResponse.json(
            {error: "Gagal menghapus buku"},
            {status: 500}
        )
    }
}