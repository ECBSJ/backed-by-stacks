import { z } from "zod"
import crypto from "crypto"

export const CampaignSchema = z.object({
  title: z.string(),
  owner: z.string(),
  chainTxId: z.string(),
  chainIsPending: z.boolean(),
  chainConfirmedId: z.number().optional(),
  description: z.string(),
  url: z.string().optional(),
  image: z.string().optional(),
  blockHeightExpiration: z.number().int().optional(),
  fundingGoal: z.number().int(),
  totalRaised: z.number().int(),
  isCollected: z.boolean().optional(),
  dateCreated: z.number(),
  dateUpdated: z.number()
})

export interface Campaign {
  id?: number
  owner: string // Address of campaign owner
  chainTxId: string // Transaction ID of the contract call which added this campaign
  chainIsPending: boolean // If the campaign creation is still pending on chain
  chainConfirmedId?: number // Campaign ID on chain
  title: string
  description: string
  url?: string
  image?: string
  blockHeightExpiration?: number
  fundingGoal: number
  totalRaised: number
  isCollected?: boolean // If funds have been collected at the end of the campaign
  dateCreated: number // ms timestamp
  dateUpdated: number // ms timestamp
}

export interface CampaignFundingInfo {
  amount: number
  numContributions: number
  isCollected: boolean
}

export interface CampaignDetailsResponse {
  campaign: Campaign | null
  fundingInfo: CampaignFundingInfo | null
  isDataValidatedOnChain: boolean | null
}

// Convert db row to client-ready campaign data
export function campaignDbToClient(campaignData: any) {
  return {
    id: campaignData.id,
    owner: campaignData.owner,
    chainTxId: campaignData.chaintxid,
    chainIsPending: campaignData.chainispending,
    chainConfirmedId: campaignData.chainconfirmedid,
    title: campaignData.title,
    description: campaignData.description,
    url: campaignData.url,
    image: campaignData.image,
    blockHeightExpiration: Number(campaignData.blockheightexpiration),
    fundingGoal: Number(campaignData.fundinggoal),
    totalRaised: Number(campaignData.totalraised),
    isCollected: campaignData.iscollected,
    dateCreated: new Date(campaignData.datecreated).getTime(),
    dateUpdated: new Date(campaignData.dateupdated).getTime()
  }
}

// This hash is stored on the blockchain and checked to ensure user-facing data in centralized data store has not been altered.
export function getCampaignDataHash(
  title: string,
  description: string,
  url?: string,
  image?: string
) {
  const dataToHash = {
    title,
    description,
    url,
    image
  }
  const sha1 = crypto.createHash("sha1")
  sha1.update(JSON.stringify(dataToHash))
  return sha1.digest("hex")
}

export const ContributionSchema = z.object({
  campaignId: z.number().int(),
  principal: z.string(),
  amount: z.number().int(),
  isRefunded: z.boolean().optional(),
  dateCreated: z.number(),
  dateUpdated: z.number()
})

export interface Contribution {
  campaignId: number
  principal: string
  amount: number
  isRefunded?: boolean
  dateCreated: number // ms timestamp
  dateUpdated: number // ms timestamp
}

// Convert db row to client-ready campaign data
export function contributionDbToClient(contributionData: any) {
  return {
    campaignId: contributionData.campaignid,
    principal: contributionData.principal,
    amount: Number(contributionData.amount),
    isRefunded: contributionData.isrefunded,
    dateCreated: new Date(contributionData.datecreated).getTime(),
    dateUpdated: new Date(contributionData.dateupdated).getTime()
  }
}

let chainhookModel = {
  apply: [
    {
      block_identifier: {
        hash: "0x31e4aae7a1a613e084a4e4ee5b6a015e028fa84fad6bc06b42990bf0083495e7",
        index: 151306
      },
      metadata: {
        bitcoin_anchor_block_identifier: {
          hash: "0x00000000000000000000d2ccb31c30314c4e7526a2e371be0cac8f495e839df4",
          index: 844924
        },
        confirm_microblock_identifier: null,
        pox_cycle_index: 84482,
        pox_cycle_length: 10,
        pox_cycle_position: 3,
        stacks_block_hash:
          "0xdb2bb78d44c9a67f519125e18e69a7ec77c7822c510b0f23f79cd6ad437e13e6"
      },
      parent_block_identifier: {
        hash: "0x7764fde0dea3f77ca4d11df88320f2421c953b7f74ea1d3fe06c26803fdf265f",
        index: 151305
      },
      timestamp: 1716556107,
      transactions: [
        {
          metadata: {
            description:
              "invoked: SPKDTDEAR9PX0YJGQQ34TNTY9087E3029JPF2AH1.campaign-funding::contribute-to-campaign(u2, u1000000)",
            execution_cost: {
              read_count: 11,
              read_length: 9562,
              runtime: 46747,
              write_count: 3,
              write_length: 230
            },
            fee: 10863,
            kind: {
              data: {
                args: ["u2", "u1000000"],
                contract_identifier:
                  "SPKDTDEAR9PX0YJGQQ34TNTY9087E3029JPF2AH1.campaign-funding",
                method: "contribute-to-campaign"
              },
              type: "ContractCall"
            },
            nonce: 27,
            position: { index: 35 },
            raw_tx:
              "0x0000000001040049ff5845af0c7efefca31b764229c84e8968e8bc000000000000001b0000000000002a6f0001259e60ce4a5c2c1343f28d703f1bc91b1bb7054de91cf2df7b010ab8b7619c227e713e4b00c2a1771f5c8dd8b9a95da2d9f64de7ac82c9e5ea3814fdffc0306503020000000100021649ff5845af0c7efefca31b764229c84e8968e8bc0500000000000f4240021626dd35cac26dd07a50bdc64d575e4810770c024c1063616d706169676e2d66756e64696e6716636f6e747269627574652d746f2d63616d706169676e00000002010000000000000000000000000000000201000000000000000000000000000f4240",
            receipt: {
              contract_calls_stack: [],
              events: [
                {
                  data: {
                    amount: "1000000",
                    recipient:
                      "SPKDTDEAR9PX0YJGQQ34TNTY9087E3029JPF2AH1.campaign-funding",
                    sender: "SP14ZYP25NW67XZQWMCDQCGH9S178JT78QJYE6K37"
                  },
                  position: { index: 88 },
                  type: "STXTransferEvent"
                }
              ],
              mutated_assets_radius: [],
              mutated_contracts_radius: []
            },
            result: "(ok true)",
            sender: "SP14ZYP25NW67XZQWMCDQCGH9S178JT78QJYE6K37",
            sponsor: null,
            success: true
          },
          operations: [
            {
              account: { address: "SP14ZYP25NW67XZQWMCDQCGH9S178JT78QJYE6K37" },
              amount: {
                currency: { decimals: 6, symbol: "STX" },
                value: 1000000
              },
              operation_identifier: { index: 0 },
              related_operations: [{ index: 1 }],
              status: "SUCCESS",
              type: "DEBIT"
            },
            {
              account: {
                address:
                  "SPKDTDEAR9PX0YJGQQ34TNTY9087E3029JPF2AH1.campaign-funding"
              },
              amount: {
                currency: { decimals: 6, symbol: "STX" },
                value: 1000000
              },
              operation_identifier: { index: 1 },
              related_operations: [{ index: 0 }],
              status: "SUCCESS",
              type: "CREDIT"
            }
          ],
          transaction_identifier: {
            hash: "0xabfb540a73113e05a4796095fb66d1ba6a5ea5ff180425b29058e96172f8b20b"
          }
        }
      ]
    }
  ],
  chainhook: {
    is_streaming_blocks: true,
    predicate: {
      contract_identifier:
        "SPKDTDEAR9PX0YJGQQ34TNTY9087E3029JPF2AH1.campaign-funding",
      method: "contribute-to-campaign",
      scope: "contract_call"
    },
    uuid: "4db1720a-a23c-42e3-a16c-b2077c04183e"
  },
  rollback: []
}
