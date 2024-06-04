import { sql } from "@vercel/postgres"
import { Contribution, ContributionSchema } from "../../models"
import type { StacksPayload } from "@hirosystems/chainhook-client"

// Populate db table with all individual contributions
export async function POST(request: Request) {
  let contribution: Contribution

  let extractedData = {
    amount: 0,
    campaignId: 0,
    dateCreated: 0,
    dateUpdated: 0,
    principal: ""
  }

  try {
    const payload: StacksPayload = (await request.json()) as any
    const { apply, chainhook } = payload
    const { transactions, timestamp } = apply[0]

    let method: String
    let contract_identifier: String

    if (chainhook.predicate.scope == "contract_call") {
      method = chainhook.predicate.method
      contract_identifier = chainhook.predicate.contract_identifier
    } else {
      return
    }

    if (
      method == "contribute-to-campaign" &&
      contract_identifier ==
        "SPKDTDEAR9PX0YJGQQ34TNTY9087E3029JPF2AH1.campaign-funding"
    ) {
      for (const transaction of transactions) {
        const { metadata: txMetadata } = transaction
        if (txMetadata.kind.type == "ContractCall") {
          if (txMetadata.success) {
            extractedData.amount = Number(txMetadata.kind.data.args[1].slice(1))
            extractedData.campaignId =
              Number(txMetadata.kind.data.args[0].slice(1)) + 1
            extractedData.dateCreated = timestamp * 1000
            extractedData.dateUpdated = timestamp * 1000
            extractedData.principal = transaction.metadata.sender
          } else {
            return new Response(
              "This transaction was unsuccessful. Denied entry into db."
            )
          }
        }
      }
    } else {
      return
    }

    contribution = ContributionSchema.parse(extractedData)
  } catch (err) {
    console.error(err)
    return new Response("Invalid contribution data", {
      status: 400
    })
  }

  let resultingContribution

  const result = await sql`
    INSERT INTO ViewAllContributions(CampaignID, Principal, Amount, DateCreated, DateUpdated)
    VALUES (${contribution.campaignId}, ${contribution.principal}, ${contribution.amount}, to_timestamp(${contribution.dateCreated} / 1000.0), to_timestamp(${contribution.dateUpdated} / 1000.0))
    RETURNING *;
  `

  resultingContribution = result.rows[0]

  return Response.json(resultingContribution)
}
