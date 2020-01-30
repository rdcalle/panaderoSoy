const fs = require('fs')

const sourceDir = 'olk14msgsource/'

const readFiles = (dirname, onFileContent) =>
  new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) reject(err)

      const filesScanned = filenames.map(
        filename =>
          new Promise((resolve, reject) => {
            const targetFile = dirname + filename

            fs.lstat(targetFile, async (err, stats) => {
              if (err) reject(err)
              if (stats.isDirectory()) {
                await extractMsgFromDir(targetFile + '/')
                resolve()
              } else {
                fs.readFile(targetFile, 'binary', (err, content) => {
                  if (err) reject(err)
                  onFileContent(filename, content)
                  resolve()
                })
              }
            })
          }),
      )

      Promise.all(filesScanned)
        .then(resolve)
        .catch(reject)
    })
  })

const match = (text, pattern, toType) => {
  const value = (text.match(pattern) || [0, ''])[1]
  return toType === 'date' && value ? +new Date(value) : value
}

const canGetMail = (tag, line, previous) => {
  const tagPattern = new RegExp(`^${tag}: .+$`)
  return tagPattern.test(line) || (previous && /^ .+@.+\..+/.test(line))
}

const data = []
let files = 0

const extractMsgFromDir = directory =>
  readFiles(directory, (filename, content) => {
    console.log(`Analizando archivo ${++files}: ${directory}${filename}`)
    data.push(
      content.split('\r').reduce(
        (
          {
            to,
            date,
            subject,
            from,
            content,
            gettingTo,
            gettingFrom,
            gettingCC,
            gettingCCO,
            ...props
          },
          contentLine,
          i,
          mail,
        ) => {
          gettingTo = canGetMail('Envelope-to', contentLine, gettingTo)
          gettingFrom = canGetMail('From', contentLine, gettingFrom)
          gettingCC = canGetMail('Cc', contentLine, gettingFrom)
          gettingCCO = canGetMail('CCo', contentLine, gettingFrom)

          return {
            ...props,
            gettingTo,
            gettingFrom,
            to: gettingTo ? [...to, match(contentLine, / (.+@.+\..+),?$/)] : to,
            date: date || match(contentLine, /^Date: (.+)$/, 'date'),
            subject: subject || match(contentLine, /^Subject: (.+)$/),
            from: gettingFrom
              ? match(contentLine, / (.+@.+\..+),?$/).replace(/[<>]/g, '')
              : from,
            content:
              content ||
              (match(contentLine, /^MIME-Version: (.+$)/) && mail.slice(i)),
          }
        },
        {
          file: directory + filename,
          to: [],
          cc: [],
          cco: [],
          gettingTo: false,
          gettingFrom: false,
          gettingCC: false,
          gettingCCO: false,
        },
      ),
    )
  })

extractMsgFromDir(sourceDir)
  .then(() => {
    const mails = JSON.stringify(data)
    console.info('Comienza escritura en disco...')
    fs.writeFile('../public/mails', mails, err => {
      if (err) throw err
      console.info('Terminada escritura en disco')
    })
  })
  .catch(err => console.log(err))
