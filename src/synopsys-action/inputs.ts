import {getInput} from '@actions/core'
import * as constants from '../application-constants'

export const SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY = getInput(constants.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY)?.trim() || ''
export const ENABLE_NETWORK_AIR_GAP = (getInput(constants.NETWORK_AIRGAP_KEY)?.trim() || getInput(constants.BRIDGE_NETWORK_AIRGAP_KEY)?.trim()) === 'true' || false

//Bridge download url
export const BRIDGE_DOWNLOAD_URL = getInput(constants.BRIDGE_DOWNLOAD_URL_KEY)?.trim() || getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY)?.trim() || ''
export const BRIDGE_DOWNLOAD_VERSION = getInput(constants.BRIDGE_DOWNLOAD_VERSION_KEY)?.trim() || getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY)?.trim() || ''

// Polaris related inputs
export const POLARIS_ACCESS_TOKEN = getInput(constants.POLARIS_ACCESSTOKEN_KEY)?.trim() || getInput(constants.POLARIS_ACCESS_TOKEN_KEY)?.trim() || ''
export const POLARIS_APPLICATION_NAME = getInput(constants.POLARIS_APPLICATION_NAME_KEY)?.trim() || ''
export const POLARIS_PROJECT_NAME = getInput(constants.POLARIS_PROJECT_NAME_KEY)?.trim() || ''
export const POLARIS_ASSESSMENT_TYPES = getInput(constants.POLARIS_ASSESSMENT_TYPES_KEY)?.trim() || ''
export const POLARIS_SERVER_URL = getInput(constants.POLARIS_SERVERURL_KEY)?.trim() || getInput(constants.POLARIS_SERVER_URL_KEY)?.trim() || ''
export const POLARIS_TRIAGE = getInput(constants.POLARIS_TRIAGE_KEY)?.trim() || ''
export const POLARIS_PRCOMMENT_ENABLED = getInput(constants.POLARIS_PRCOMMENT_ENABLED_KEY)?.trim() || ''
export const POLARIS_PRCOMMENT_SEVERITIES = getInput(constants.POLARIS_PRCOMMENT_SEVERITIES_KEY)?.trim() || ''
export const POLARIS_BRANCH_NAME = getInput(constants.POLARIS_BRANCH_NAME_KEY)?.trim() || ''
export const POLARIS_PARENT_BRANCH_NAME = getInput(constants.POLARIS_BRANCH_PARENT_NAME_KEY)?.trim() || ''

// Coverity related inputs
export const COVERITY_URL = getInput(constants.COVERITY_URL_KEY)?.trim() || ''
export const COVERITY_USER = getInput(constants.COVERITY_USER_KEY)?.trim() || ''
export const COVERITY_PASSPHRASE = getInput(constants.COVERITY_PASSPHRASE_KEY)?.trim() || ''
export const COVERITY_PROJECT_NAME = getInput(constants.COVERITY_PROJECT_NAME_KEY)?.trim() || ''
export const COVERITY_STREAM_NAME = getInput(constants.COVERITY_STREAM_NAME_KEY)?.trim() || ''
export const COVERITY_INSTALL_DIRECTORY = getInput(constants.COVERITY_INSTALL_DIRECTORY_KEY)?.trim() || ''
export const COVERITY_POLICY_VIEW = getInput(constants.COVERITY_POLICY_VIEW_KEY)?.trim() || ''
export const COVERITY_REPOSITORY_NAME = getInput(constants.COVERITY_REPOSITORY_NAME_KEY)?.trim() || ''
export const COVERITY_BRANCH_NAME = getInput(constants.COVERITY_BRANCH_NAME_KEY)?.trim() || ''
export const COVERITY_PRCOMMENT_ENABLED = getInput(constants.COVERITY_AUTOMATION_PRCOMMENT_KEY)?.trim() || getInput(constants.COVERITY_PRCOMMENT_ENABLED_KEY)?.trim() || ''
export const COVERITY_LOCAL = getInput(constants.COVERITY_LOCAL_KEY)?.trim() === 'true' || false
export const COVERITY_VERSION = getInput(constants.COVERITY_VERSION_KEY)?.trim() || getInput(constants.BRIDGE_COVERITY_VERSION_KEY)?.trim() || ''

// Blackduck related inputs
export const BLACKDUCK_URL = getInput(constants.BLACKDUCK_URL_KEY)?.trim() || ''
export const BLACKDUCK_API_TOKEN = getInput(constants.BLACKDUCK_API_TOKEN_KEY)?.trim() || getInput(constants.BLACKDUCK_TOKEN_KEY)?.trim() || ''
export const BLACKDUCK_INSTALL_DIRECTORY = getInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY)?.trim() || ''
export const BLACKDUCK_SCAN_FULL = getInput(constants.BLACKDUCK_SCAN_FULL_KEY)?.trim() || ''
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES = getInput(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY)?.trim() || ''
export const BLACKDUCK_FIXPR_ENABLED = getInput(constants.BLACKDUCK_AUTOMATION_FIXPR_KEY)?.trim() || getInput(constants.BLACKDUCK_FIXPR_ENABLED_KEY)?.trim() || ''
export const BLACKDUCK_PRCOMMENT_ENABLED = getInput(constants.BLACKDUCK_AUTOMATION_PRCOMMENT_KEY)?.trim() || getInput(constants.BLACKDUCK_PRCOMMENT_ENABLED_KEY)?.trim() || ''
export const BLACKDUCK_FIXPR_MAXCOUNT = getInput(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY)?.trim() || ''
export const BLACKDUCK_FIXPR_CREATE_SINGLE_PR = getInput(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY)?.trim() || ''
export const BLACKDUCK_FIXPR_FILTER_SEVERITIES = getInput(constants.BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY)?.trim() || ''
export const BLACKDUCK_FIXPR_LONG_TERM_GUIDANCE = getInput(constants.BLACKDUCK_FIXPR_USE_UPGRADE_GUIDANCE_KEY)?.trim() || ''
export const GITHUB_TOKEN = getInput(constants.GITHUB_TOKEN_KEY)?.trim() || ''
export const INCLUDE_DIAGNOSTICS = getInput(constants.INCLUDE_DIAGNOSTICS_KEY)?.trim() || ''
export const DIAGNOSTICS_RETENTION_DAYS = getInput(constants.DIAGNOSTICS_RETENTION_DAYS_KEY)?.trim() || ''
