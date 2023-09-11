import * as fs from 'fs'
import * as path from 'path'
import * as stream from 'stream'
import nock from 'nock'
import * as io from '@actions/io'
// eslint-disable-next-line import/first
import * as tc from '../../../src/synopsys-action/tool-cache-local'
import * as constants from '../../../src/application-constants'
const tempPath = path.join(__dirname, 'TEMP')
let destPath: string
beforeAll(function () {
  nock('http://example.com').persist().get('/bytes/35').reply(200, {
    username: 'abc',
    password: 'def'
  })

  Object.defineProperty(constants, 'RETRY_COUNT', {value: 3})
  Object.defineProperty(constants, 'RETRY_DELAY_IN_MILLISECONDS', {value: 100})
  Object.defineProperty(constants, 'NON_RETRY_HTTP_CODES', {value: new Set([200, 201, 401, 403, 416]), configurable: true})
})

beforeEach(async function () {
  await io.mkdirP(tempPath)
  destPath = tempPath.concat('/test-download-file')
  console.info('destPath:'.concat(destPath))
  setResponseMessageFactory(undefined)
})

afterEach(async function () {
  await io.rmRF(tempPath)
  setResponseMessageFactory(undefined)
})

test('downloads a 35 byte file', async () => {
  const downPath: string = await tc.downloadTool('http://example.com/bytes/35', destPath)

  expect(fs.existsSync(downPath)).toBeTruthy()
  expect(fs.statSync(downPath).size).toBe(35)
})

test('downloads a 35 byte file after a redirect', async () => {
  nock('http://example.com').persist().get('/redirect-to').reply(303, undefined, {
    location: 'http://example.com/bytes/35'
  })

  const downPath: string = await tc.downloadTool('http://example.com/redirect-to', destPath)

  expect(fs.existsSync(downPath)).toBeTruthy()
  expect(fs.statSync(downPath).size).toBe(35)
})

test('has status code in exception dictionary for HTTP error code responses', async () => {
  nock('http://example.com').persist().get('/bytes/bad').reply(400, {
    username: 'bad',
    password: 'file'
  })

  expect.assertions(2)

  try {
    const errorCodeUrl = 'http://example.com/bytes/bad'
    await tc.downloadTool(errorCodeUrl, destPath)
  } catch (err: any) {
    expect(err.toString()).toContain('Unexpected HTTP response: 400')
    expect(err['httpStatusCode']).toBe(400)
  }
})

test('works with redirect code 302', async function () {
  nock('http://example.com').persist().get('/redirect-to').reply(302, undefined, {
    location: 'http://example.com/bytes/35'
  })

  const downPath: string = await tc.downloadTool('http://example.com/redirect-to', destPath)

  expect(fs.existsSync(downPath)).toBeTruthy()
  expect(fs.statSync(downPath).size).toBe(35)
})

test('works with a 502 temporary failure', async function () {
  nock('http://example.com').get('/temp502').twice().reply(502, undefined)
  nock('http://example.com').get('/temp502').reply(200, undefined)

  const statusCodeUrl = 'http://example.com/temp502'
  await tc.downloadTool(statusCodeUrl, destPath)
})

test("doesn't retry 502s more than 3 times", async function () {
  nock('http://example.com').get('/perm502').times(3).reply(502, undefined)

  expect.assertions(1)

  try {
    const statusCodeUrl = 'http://example.com/perm502'
    await tc.downloadTool(statusCodeUrl, destPath)
  } catch (err: any) {
    expect(err.toString()).toContain('502')
  }
})

test('retries 429s', async function () {
  nock('http://example.com').get('/too-many-requests-429').times(3).reply(429, undefined)
  nock('http://example.com').get('/too-many-requests-429').reply(500, undefined)

  try {
    const statusCodeUrl = 'http://example.com/too-many-requests-429'
    await tc.downloadTool(statusCodeUrl, destPath)
  } catch (err: any) {
    expect(err.toString()).toContain('500')
  }
})

test("doesn't retry 404", async function () {
  nock('http://example.com').get('/not-found-404').reply(404, undefined)
  nock('http://example.com').get('/not-found-404').reply(500, undefined)

  try {
    const statusCodeUrl = 'http://example.com/not-found-404'
    await tc.downloadTool(statusCodeUrl, destPath)
  } catch (err: any) {
    expect(err.toString()).toContain('404')
  }
})

/**
 * Sets up a mock response body for downloadTool. This function works around a limitation with
 * nock when the response stream emits an error.
 */
function setResponseMessageFactory(factory: (() => stream.Readable) | undefined): void {
  setGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', factory)
}

/**
 * Sets a global variable
 */
function setGlobal<T>(key: string, value: T | undefined): void {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const g = global as any
  /* eslint-enable @typescript-eslint/no-explicit-any */
  if (value === undefined) {
    delete g[key]
  } else {
    g[key] = value
  }
}
