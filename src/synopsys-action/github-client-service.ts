import {HttpClient} from 'typed-rest-client/HttpClient'
import * as inputs from './inputs'
import {FIXPR_ENVIRONMENT_VARIABLES} from './input-data/blackduck'
import * as fs from 'fs'
import * as zlib from 'zlib'
import {checkIfPathExists} from './utility'
import {UploadResponse} from '@actions/artifact/lib/internal/upload-response'
import * as artifact from '@actions/artifact'
import {getWorkSpaceDirectory} from '@actions/artifact/lib/internal/config-variables'
import {UploadOptions} from '@actions/artifact/lib/internal/upload-options'
import {info, warning} from '@actions/core'

export class GithubClientService {
  gitHubCodeScanningUrl: string
  constructor() {
    this.gitHubCodeScanningUrl = '/repos/{0}/{1}/code-scanning/sarifs'
  }

  async uploadSarifReport(): Promise<void> {
    info('uploadSarifReport :: start')
    const githubToken = inputs.GITHUB_TOKEN.trim()
    const githubRepo = process.env[FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REPOSITORY]
    const repoName = githubRepo !== undefined ? githubRepo.substring(githubRepo.indexOf('/') + 1, githubRepo.length).trim() : ''
    const repoOwner = process.env[FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REPOSITORY_OWNER] || ''
    const githubApiURL = process.env[FIXPR_ENVIRONMENT_VARIABLES.GITHUB_API_URL] || ''
    const commit_sha = process.env[FIXPR_ENVIRONMENT_VARIABLES.GITHUB_SHA] || ''
    const githubRef = process.env[FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REF] || ''
    const stringFormat = (url: string, ...args: string[]): string => {
      return url.replace(/{(\d+)}/g, (match, index) => args[index] || '')
    }
    const endpoint = stringFormat(githubApiURL.concat(this.gitHubCodeScanningUrl), repoOwner, repoName)
    const sarifFilePath = inputs.REPORTS_SARIF_FILE_PATH.trim() ? inputs.REPORTS_SARIF_FILE_PATH.trim() : this.getSarifReportPath(true)

    info(`sarifFilePath:: ${sarifFilePath}`)
    if (checkIfPathExists(sarifFilePath)) {
      try {
        const sarifContent = fs.readFileSync(sarifFilePath, 'utf8')
        const compressedSarif = zlib.gzipSync(sarifContent)
        const base64Sarif = compressedSarif.toString('base64')
        //console.log(`base64Sarif: ${base64Sarif}`)
        const data = {
          commit_sha,
          ref: githubRef,
          sarif: base64Sarif,
          validate: true
        }
        const httpClient = new HttpClient('GithubClientService')
        const httpResponse = await httpClient.post(endpoint, JSON.stringify(data), {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github+json'
        })
        info(`http status code:${httpResponse.message.statusCode}`)
        if (httpResponse.message.statusCode === 202) {
          await this.uploadSarifReportAsArtifact(sarifFilePath)
        } else {
          warning('Error uploading SARIF data to GitHub Advance Security')
        }
      } catch (error) {
        warning(`Error uploading SARIF data to GitHub Advance Security: ${error}`)
      }
    }
    info('uploadSarifReport :: end')
  }

  private async uploadSarifReportAsArtifact(sarifFilePath: string): Promise<UploadResponse | void> {
    info(`uploadSarifReportAsArtifact:: start`)
    const artifactClient = artifact.create()
    //const pwd = getWorkSpaceDirectory().concat(this.getSarifReportPath(false))
    const options: UploadOptions = {}
    options.continueOnError = false
    return await artifactClient.uploadArtifact('sarif_report', [sarifFilePath], '/Users/spurohit/.bridge', options)
  }

  private getSarifReportPath(appendFilePath: boolean): string {
    if (process.platform === 'win32') {
      return !appendFilePath ? '\\.bridge\\SARIF Generator' : '\\.bridge\\SARIF Generator\\sarif_report.json'
    } else {
      return !appendFilePath ? '/.bridge/SARIF Generator' : '/.bridge/SARIF Generator/sarif_report.json'
    }
  }
}
