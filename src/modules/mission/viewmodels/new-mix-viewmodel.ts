import { appProvider } from '@/app-providers'
import { getApiFileUrl, getDataFromQuizFile, getPreviewFromQuizFile, getTextData } from '@/helpers/file-helper'
import { Quiz, LearnToEarn, PreviewQuiz, MissionInfo } from '@/models/QuizModel'
import { set, get, isEmpty, toNumber, sampleSize, round, assign, isEqual } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import {
  ALLOW_PASS_THROUGH,
  EMPTY_ARRAY,
  EMPTY_STRING,
  Zero,
  ZERO_NUM,
  EMPTY_OBJECT,
  NULL,
  TOTAL_IN_APP_TRIAL_STEP,
} from '@/constants'
import {
  SocialType,
  TaskConfig,
  MetaData,
  MissionType,
  IatInfoProp,
  InAppTrialInfo,
  Mission,
  Data,
  IatData,
} from '@/models/MissionModel'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD, HUNDRED, PRIORITY_AMOUNT_RATIO } from '@/constants'
import { getDefaultSettingConfig, extractTaskSettings, generateRandomString } from '@/helpers'
import { BaseNewMissionViewModel } from './base-new-viewmodel'

enum AppPlatform {
  MOBILE = 'mobile',
  WEB = 'web',
}

export class NewMixMissionVIewModel extends BaseNewMissionViewModel {
  @observable quizLength = 0
  @observable pool: VotingPool = EMPTY_OBJECT

  constructor(unicodeName: string) {
    super(unicodeName)
  }
}
