import { sql } from "@vercel/postgres"
import { Contribution, ContributionSchema } from "../../models"

export async function GET() {
  return new Response("GET Ran!")
}

// export async function POST(request: Request) {
//   let result = await request.json()
//   console.log(result)

//   return new Response(JSON.stringify(result))
// }

// Handle contribution made to campaign from external
export async function POST(request: Request) {
  let contribution: Contribution
  let contribution_chainhook = {
    amount: 0,
    campaignId: 0,
    dateCreated: 0,
    dateUpdated: 0,
    principal: ""
  }

  try {
    const body: any = await request.json()
    contribution_chainhook.amount = Number(
      body.apply[0].transactions[0].metadata.kind.data.args[1].slice(1)
    )
    contribution_chainhook.campaignId =
      Number(
        body.apply[0].transactions[0].metadata.kind.data.args[0].slice(1)
      ) + 1
    contribution_chainhook.dateCreated = body.apply[0].timestamp * 1000
    contribution_chainhook.dateUpdated = body.apply[0].timestamp * 1000
    // contribution_chainhook.isRefunded = null
    contribution_chainhook.principal =
      body.apply[0].transactions[0].metadata.sender

    contribution = ContributionSchema.parse(contribution_chainhook)
  } catch (err) {
    console.error(err)
    return new Response("Invalid contribution data", {
      status: 400
    })
  }

  // TODO: improve validation & error handling. Most issues just throw and respond with 500.
  let resultingContribution

  //  If the given principal has made a previous contribution, sum the total in the existing db row
  const result = await sql`
    INSERT INTO Contributions(CampaignID, Principal, Amount, DateCreated, DateUpdated)
    VALUES (${contribution.campaignId}, ${contribution.principal}, ${contribution.amount}, to_timestamp(${contribution.dateCreated} / 1000.0), to_timestamp(${contribution.dateUpdated} / 1000.0))
    ON CONFLICT (CampaignID, Principal) DO UPDATE
      SET Amount = Contributions.Amount + EXCLUDED.Amount,
      DateUpdated = EXCLUDED.DateUpdated
    RETURNING *;
  `

  // Add the contribution to the total for the campaign
  await sql`
    UPDATE Campaigns
    SET TotalRaised = Campaigns.TotalRaised + ${contribution.amount}
    WHERE ID = ${contribution.campaignId};
  `

  resultingContribution = result.rows[0]

  return Response.json(resultingContribution)
}
