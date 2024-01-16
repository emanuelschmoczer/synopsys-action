import * as inputs from '../../../src/synopsys-action/inputs'
import {HttpClientResponse, HttpClient} from 'typed-rest-client/HttpClient'
import {IncomingMessage} from 'http'
import Mocked = jest.Mocked
import {GithubClientService} from '../../../src/synopsys-action/github-client-service'
import {Socket} from 'net'
import * as utility from '../../../src/synopsys-action/utility'
import fs from 'fs'
import * as constants from '../../../src/application-constants'

const originalEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = {
    ...originalEnv,
    GITHUB_REPOSITORY: 'test-repo',
    GITHUB_HEAD_REF: 'test-owner',
    GITHUB_REF: 'test-ref',
    GITHUB_SERVER_URL: 'test-url',
    GITHUB_SHA: 'test-sha'
  }
  Object.defineProperty(constants, 'RETRY_COUNT', {value: 3})
  Object.defineProperty(constants, 'RETRY_DELAY_IN_MILLISECONDS', {value: 100})
  Object.defineProperty(process, 'platform', {value: 'linux'})
  jest.mock('@actions/artifact')
})

test('should throw error for missing GitHub token while uploading sarif result to GitHub Advanced security', async function () {
  const githubClientService = new GithubClientService()
  Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: ''})
  try {
    await githubClientService.uploadSarifReport('test-dir', '/')
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('Missing required GitHub token for uploading SARIF report to GitHub Advanced Security')
  }
})

describe('upload sarif results', () => {
  it('should upload sarif report successfully with default location', async function () {
    const githubClientService = new GithubClientService()

    Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: 'test-token'})
    jest.spyOn(utility, 'checkIfPathExists').mockReturnValue(true)
    jest.spyOn(utility, 'getDefaultSarifReportPath').mockReturnValue('test-path')
    jest.spyOn(fs, 'readFileSync').mockReturnValue('test-content')

    const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
    const httpResponse: Mocked<HttpClientResponse> = {
      message: incomingMessage,
      readBody: jest.fn()
    }
    httpResponse.message.statusCode = 202
    jest.spyOn(HttpClient.prototype, 'post').mockResolvedValueOnce(httpResponse)
    const response = await githubClientService.uploadSarifReport('test-dir', '/')
    expect(response).toBeUndefined()
  })

  it('should upload sarif report successfully with REPORTS_SARIF_FILE_PATH', async function () {
    const githubClientService = new GithubClientService()

    Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: 'test-token'})
    Object.defineProperty(inputs, 'REPORTS_SARIF_FILE_PATH', {value: 'test-path'})

    jest.spyOn(utility, 'checkIfPathExists').mockReturnValue(true)
    jest.spyOn(utility, 'getDefaultSarifReportPath').mockReturnValue('test-path')
    jest.spyOn(fs, 'readFileSync').mockReturnValue('test-content')

    const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
    const httpResponse: Mocked<HttpClientResponse> = {
      message: incomingMessage,
      readBody: jest.fn()
    }
    httpResponse.message.statusCode = 202
    jest.spyOn(HttpClient.prototype, 'post').mockResolvedValueOnce(httpResponse)
    const response = await githubClientService.uploadSarifReport('test-dir', '/')
    expect(response).toBeUndefined()
  })

  it('should throw error while upload sarif report', async function () {
    const githubClientService = new GithubClientService()

    Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: 'test-token'})
    Object.defineProperty(inputs, 'REPORTS_SARIF_FILE_PATH', {value: 'test-path'})

    jest.spyOn(utility, 'checkIfPathExists').mockReturnValue(true)
    jest.spyOn(utility, 'getDefaultSarifReportPath').mockReturnValue('test-path')
    jest.spyOn(fs, 'readFileSync').mockReturnValue('test-content')

    const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
    const httpResponse: Mocked<HttpClientResponse> = {
      message: incomingMessage,
      readBody: jest.fn()
    }
    httpResponse.message.statusCode = 500
    jest.spyOn(HttpClient.prototype, 'post').mockRejectedValueOnce(new Error('Error uploading SARIF data to GitHub Advanced Security:'))

    try {
      await githubClientService.uploadSarifReport('test-dir', '/')
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('Error uploading SARIF data to GitHub Advanced Security:')
    }
  })

  it('should throw error while upload sarif report if file does not exist', async function () {
    const githubClientService = new GithubClientService()

    Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: 'test-token'})

    jest.spyOn(utility, 'checkIfPathExists').mockReturnValue(false)
    jest.spyOn(utility, 'getDefaultSarifReportPath').mockReturnValue('test-path')
    try {
      await githubClientService.uploadSarifReport('test-dir', '/')
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('No SARIF file found to upload')
    }
  })
})

it('should return with 401 status code for bad credentials while upload sarif report', async function () {
  const githubClientService = new GithubClientService()

  Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: 'test-token'})
  Object.defineProperty(inputs, 'REPORTS_SARIF_FILE_PATH', {value: 'test-path'})

  jest.spyOn(utility, 'checkIfPathExists').mockReturnValue(true)
  jest.spyOn(utility, 'getDefaultSarifReportPath').mockReturnValue('test-path')
  jest.spyOn(fs, 'readFileSync').mockReturnValue('test-content')

  const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
  const httpResponse: Mocked<HttpClientResponse> = {
    message: incomingMessage,
    readBody: jest.fn()
  }
  httpResponse.message.statusCode = 401
  jest.spyOn(HttpClient.prototype, 'post').mockResolvedValue(httpResponse)
  try {
    await githubClientService.uploadSarifReport('test-dir', '/')
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('Uploading SARIF report to GitHub Advanced Security failed:')
  }
})

it('should return rate limit error while upload sarif report', async function () {
  const githubClientService = new GithubClientService()

  Object.defineProperty(inputs, 'GITHUB_TOKEN', {value: 'test-token'})
  Object.defineProperty(inputs, 'REPORTS_SARIF_FILE_PATH', {value: 'test-path'})

  jest.spyOn(utility, 'checkIfPathExists').mockReturnValue(true)
  jest.spyOn(utility, 'getDefaultSarifReportPath').mockReturnValue('test-path')
  jest.spyOn(fs, 'readFileSync').mockReturnValue('test-content')

  const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
  const httpResponse: Mocked<HttpClientResponse> = {
    message: incomingMessage,
    readBody: jest.fn()
  }
  httpResponse.message.statusCode = 403
  httpResponse.message.headers = {'x-ratelimit-remaining': '0'}

  jest.spyOn(HttpClient.prototype, 'post').mockResolvedValue(httpResponse)
  try {
    await githubClientService.uploadSarifReport('test-dir', '/')
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('Uploading SARIF report to GitHub Advanced Security failed:')
  }
})

afterEach(() => {
  process.env = originalEnv
})
