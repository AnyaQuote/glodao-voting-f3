export interface Metadata {
  shortDescription: string
  fields: string[]
  projectCover: string
  projectLogo: string
  tokenContract?: string
  additionLink?: string
  chainID?: string
}

export interface VotingPools {
  projectName: string
  rewardAddress: string
  ownerAddress: string
  data: Metadata
  projectId: string
  status: string
  type: string
  startDate: string
  endDate: string
  unicode: string
}
