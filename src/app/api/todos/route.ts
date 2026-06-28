import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "useId is required" }, { status: 400 });
  }
  try {
    const todos = await prisma.todo.findMany({ where: { userId: userId } });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load todos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "useId is required" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const item = await prisma.todo.create({
      data: {
        userId: userId,
        text: body.text,
        createdAt: new Date().toLocaleDateString("ru-RU"),
        completed: false,
        completedDate: null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create todos" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await prisma.todo.delete({
      where: {
        id: body.id,
      },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todos" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const updated = await prisma.todo.update({
      where: {
        id: body.id,
      },
      data: {
        completed: body.completed,
        completedDate: body.completedDate,
      },
    });
    return NextResponse.json(updated, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todos" },
      { status: 500 },
    );
  }
}
