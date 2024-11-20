import { getConnection } from "@/lib/database/dbSetup";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await getConnection();
  try {
    const [brand] = await connection.query(` SELECT * FROM brands`);

    const response = NextResponse.json({
      brand,
    });

    response.headers.set(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    revalidatePath("http://localhost:3000/api/brands");

    return response;
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
}
