const execFile = require('child_process').execFile
const flow = require('flow-bin')

const IGNORE_ERROR_CODES = [
  'missing-annot',
   'missing-local-annot',
   'underconstrained-implicit-instantiation',
   'signature-verification-failure',
]

const isValidError = (error) => !error.error_codes.some(code => IGNORE_ERROR_CODES.includes(code))
 
execFile(flow, ['check', '--json'], (err, stdout) => {

  if (!stdout) {
    console.error(err, stdout)
    process.exit(1)
  }

  const result = JSON.parse(stdout)
  const errors = result.errors.filter(isValidError)
  const hasErrors = errors.length > 0

  if (hasErrors) {
    console.log(JSON.stringify(errors, null, 2))
    process.exit(1)
  } else {
    console.log('Flow passed')
    process.exit(0)
  }

})