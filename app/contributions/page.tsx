"use client"

import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon
} from "@chakra-ui/react"
import PageContainer from "../../ui/components/PageContainer"
import AppHeader from "../../ui/components/AppHeader"
import { useState, useEffect } from "react"
import StacksIcon from "../../ui/icons/StacksIcon"
import axios from "axios"
import { Contribution } from "../../app/models"

export default function Page() {
  const [contributions, setContributions] = useState<Contribution[] | null>(
    null
  )

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
                    <InputLeftAddon
                      bg="purple.600"
                      color="white"
                      borderColor="purple.600"
                    >
                      <StacksIcon />
                    </InputLeftAddon>
                    <Input
                      bg="white"
                      type="number"
                      placeholder={String(contr.amount)}
                      value={contr.amount}
                      onChange={(e) => {
                        // @ts-ignore
                        e.preventDefault()
                      }}
                    />
                  </InputGroup>
                  <FormHelperText>
                    <Box>From Donor: {contr.principal}</Box>
                    <Box>For Campaign: {contr.campaignId}</Box>
                    <Box>Date of First Contribution: {contr.dateCreated}</Box>
                    <Box>
                      Date of Most Recent Contribution: {contr.dateUpdated}
                    </Box>
                    <Box mt="2">
                      If this goal is reached by the end of the campaign, you'll
                      receive the funds. If not, all funds raised will be
                      returned to the backers.
                    </Box>
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
