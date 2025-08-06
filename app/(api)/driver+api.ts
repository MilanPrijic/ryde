import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;

    const drivers = response.map((driver: any) => ({
      driver_id: driver.id,
      ...driver,
    }));

    return Response.json({ data: drivers });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
