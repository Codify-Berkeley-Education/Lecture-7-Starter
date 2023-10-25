import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Get all todos
// User query params to sort and filter
// limit limits the number of todos returned
// completed filters by completed
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // each of these search params will be null if they don't exist
  const limit = searchParams.get("limit");
  const completed = searchParams.get("completed");

  // If completed is not null, filter by it
  if (completed !== null) {
    const todos = await prisma.todo.findMany({
      where: { completed: completed === "true" ? true : false },
      take: limit ? parseInt(limit) : undefined,
    });
    return NextResponse.json(todos, { status: 200 });
  }
  const todos = await prisma.todo.findMany({
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(todos, { status: 200 });
}

// Create a new todo
// Validate the input with a zod
const todoSchema = z.object({
  priority: z.number(),
  content: z.string(),
  completed: z.boolean().optional(), // Optional as it defaults to false
  listId: z.number().optional(), // Optional as we don't have to assign it to a list
});

// Get a typescript type from the schema
type Todo = z.infer<typeof todoSchema>;

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  try {
    // Validate the input, will error if invalid
    const parsed: Todo = todoSchema.parse(body);
    const todo = await prisma.todo.create({ data: parsed });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    // Bad request
    return NextResponse.json({ error }, { status: 400 });
  }
}
