import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Get a todo by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {}

// Update a todo by id

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: number } }
) {}

// Delete a todo by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {}
