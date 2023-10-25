import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Get all lists
export async function GET(request: NextRequest) {
  const lists = await prisma.list.findMany();
  return NextResponse.json(lists, { status: 200 });
}

// Create a new list
const listSchema = z.object({
  name: z.string(),
  todoIds: z.array(z.number()).optional(),
});

type TodoList = z.infer<typeof listSchema>;

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const parsed: TodoList = listSchema.parse(body);
    const list = await prisma.list.create({
      data: {
        name: parsed.name,
        todos: {
          connect: parsed.todoIds?.map((todoId) => ({ id: todoId })),
        },
      },
    });
    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
