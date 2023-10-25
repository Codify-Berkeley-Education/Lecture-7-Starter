import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Get a todo by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // id is a string as it comes from the url
) {
  const { id } = params; // destructure the params object to get the id
  const todo = await prisma.todo.findUnique({ where: { id: parseInt(id) } });
  return NextResponse.json(todo, { status: 200 });
}

// Update a todo by id
const updateTodoSchema = z.object({
  priority: z.number().optional(),
  content: z.string().optional(),
  completed: z.boolean().optional(),
  listId: z.number().optional(),
});
// Get a typescript type from the schema
type Todo = z.infer<typeof updateTodoSchema>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  try {
    const parsed: Todo = updateTodoSchema.parse(body);
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: parsed,
    });
    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

// Delete a todo by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  const todo = await prisma.todo.delete({ where: { id: id } });
  return NextResponse.json(todo, { status: 200 });
}
