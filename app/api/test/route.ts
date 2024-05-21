export async function GET() {
  console.log("yo its an api!")

  return new Response("done")
}

export async function POST(request: Request) {
  let result = await request.json()
  console.log(result)
  console.log("post it up")

  return new Response(JSON.stringify(result))
}
