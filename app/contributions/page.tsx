"use client"

import { sql } from "@vercel/postgres"
import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, InputGroup, InputLeftAddon, Link, useToast } from "@chakra-ui/react"
import PageContainer from "../../ui/components/PageContainer"
import AppHeader from "../../ui/components/AppHeader"
import { useContext, useState, useEffect } from "react"
import WalletContext from "../../ui/context/WalletContext"
import ConnectWalletButton from "../../ui/components/ConnectWalletButton"
import ImageUploader from "../../ui/components/ImageUploader"
import StacksIcon from "../../ui/icons/StacksIcon"
import { getCampaignDataHash } from "../models"
import { stxToUstx } from "../../utils/token-utils"
import { CONTRACT_DEPLOYER_ADDRESS, CONTRACT_NAME, STACKS_NETWORK } from "../../utils/stacks-api"
import { Cl } from "@stacks/transactions"
import { ContractCallOptions, FinishedTxData, openContractCall } from "@stacks/connect"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Campaign, Contribution } from "../../app/models"

export default function Page() {
  const toast = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [contributions, setContributions] = useState<Contribution[] | null>(null)

  useEffect(() => {
    const getContributions = async () => {
      const { data } = await axios.get("/api/contributions")
      setContributions(data)
      console.log(data)
    }
    getContributions()
  }, [])

  return (
    <PageContainer>
      <Flex direction="column" gap="8">
        <AppHeader />
        <Flex direction="column" maxW="600px" mx="auto" gap="4">
          <Flex justify="space-between" align="center">
            <Heading size="md">View All Contributions</Heading>
          </Flex>

          <Flex direction="column" gap="12">
            <Flex direction="column" gap="8">
              {contributions?.map((contr, index) => (
                <FormControl bg="gray.100" p="6" borderRadius="md" key={index}>
                  <FormLabel>Contribution Amount:</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg="purple.600" color="white" borderColor="purple.600">
                      <StacksIcon />
                    </InputLeftAddon>
                    <Input
                      bg="white"
                      type="number"
                      placeholder={String(contr.amount)}
                      value={contr.amount}
                      onChange={e => {
                        // @ts-ignore
                        null
                      }}
                    />
                  </InputGroup>
                  <FormHelperText>
                    <Box>From Donor: {contr.principal}</Box>
                    <Box>For Campaign: {contr.campaignId}</Box>
                    <Box>Date of First Contribution: {contr.dateCreated}</Box>
                    <Box>Date of Most Recent Contribution: {contr.dateUpdated}</Box>
                    <Box mt="2">If this goal is reached by the end of the campaign, you'll receive the funds. If not, all funds raised will be returned to the backers.</Box>
                    {/* TODO: show current STX price */}
                  </FormHelperText>
                </FormControl>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </PageContainer>
  )
}
