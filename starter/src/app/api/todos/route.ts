import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Get all todos
// User query params to sort and filter
// limit limits the number of todos returned
// completed filters by completed
export async function GET(request: NextRequest) {}

// Create a new todo
// Validate the input with zod

// Get a typescript type from the schema

export async function POST(request: NextRequest) {}
