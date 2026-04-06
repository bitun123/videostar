import { connectToDatabase } from "@/lib/db";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { Error: "All fields are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { Error: "User already exists" },
        { status: 400 },
      );
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "User registered successfully", newUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { Error: "An error occurred while registering the user" },
      { status: 500 },
    );
  }
}
