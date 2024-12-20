import { getConnection } from "@/lib/database/dbSetup";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await getConnection();
  try {
    const [category] = await connection.query(` SELECT * FROM categories`);

    const response = NextResponse.json({
      category,
    });

    response.headers.set(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    return response;
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
}
