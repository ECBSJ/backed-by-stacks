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
import { ustxToStx } from "../../utils/token-utils"

export default function Page() {
  const [contributions, setContributions] = useState<Contribution[] | null>(
    null
  )

  useEffect(() => {
    const getContributions = async () => {
      try {
        const { data } = await axios.get("/api/contributions")
        setContributions(data)
        console.log(data)
      } catch (error) {
        console.error(error)
      }
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
              {contributions ? (
                contributions!
                  .slice(0)
                  .reverse()
                  .map((contr, index) => {
                    let recentDate = new Date(
                      contr.dateUpdated
                    ).toLocaleDateString()

                    let firstDate = new Date(
                      contr.dateCreated
                    ).toLocaleDateString()
                    return (
                      <FormControl
                        bg="gray.100"
                        p="6"
                        borderRadius="md"
                        key={index}
                      >
                        <FormLabel>
                          Contribution {contributions.length - index} Details:
                        </FormLabel>
                        <Box>Recent Contribution: {recentDate}</Box>

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
                            value={ustxToStx(contr.amount)}
                            onChange={(e) => {
                              // @ts-ignore
                              e.preventDefault()
                            }}
                          />
                        </InputGroup>
                        <FormHelperText>
                          <Box>Donor: {contr.principal}</Box>
                          <Box>For Campaign ID: {contr.campaignId}</Box>
                          <Box>First Contribution: {firstDate}</Box>

                          {/* TODO: show current STX price */}
                        </FormHelperText>
                      </FormControl>
                    )
                  })
              ) : (
                <Box>No contributions available to display.</Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </PageContainer>
  )
}
