import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Get a list by id, return the properties of the list and the todos
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const list = await prisma.list.findUnique({
    where: { id: Number(id) },
    include: { todos: true },
  });
  return NextResponse.json(list, { status: 200 });
}

// Update a list by id, return the updated list
// Pass empty arrays to addTodos and removeTodos if you don't want to add or remove any todos
const updateListSchema = z.object({
  name: z.string(),
  addTodos: z.array(z.number()),
  removeTodos: z.array(z.number()),
});
type UpdateList = z.infer<typeof updateListSchema>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const parsed: UpdateList = updateListSchema.parse(body);

  const formattedRemoveTodos = parsed.removeTodos.map((todoId) => ({
    id: todoId,
  }));
  const formttedAddTodos = parsed.addTodos.map((todoId) => ({
    id: todoId,
  }));

  const list = await prisma.list.update({
    where: { id: Number(id) },
    data: {
      name: parsed.name,
      todos: {
        connect: formttedAddTodos,
        disconnect: formattedRemoveTodos,
      },
    },
    include: { todos: true },
  });
  return NextResponse.json(list, { status: 200 });
}
