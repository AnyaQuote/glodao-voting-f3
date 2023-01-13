import { Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDetailViewmodel {
  mission: Mission
  pool: VotingPool
}
