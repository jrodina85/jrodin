 if (commander.config) {
    config_path = commander.config
    config = YAML.safeLoad(fs.readFileSync(config_path, 'utf8'))
  } else {
    config_path = './config.yaml'
    try {
      config = YAML.safeLoad(fs.readFileSync(config_path, 'utf8'))
    } catch(err) {
      var readline = require('readline')
      var rl = readline.createInterface(process.stdin, process.stdout)
      var timeout = setTimeout(function() {
        global.console.log('I got tired waiting for an answer. Exitting...')
        process.exit(1)
      }, 20000)

      ;(function askUser() {
        have_question = true
        rl.question('Config file doesn\'t exist, create a new one? (Y/n) ', function(x) {
          clearTimeout(timeout)
          if (x[0] == 'Y' || x[0] == 'y' || x === '') {
            rl.close()

            var created_config = require('../lib/config_gen')()
            config = YAML.safeLoad(created_config.yaml)
            write_config_banner(created_config, config)
            fs.writeFileSync(config_path, created_config.yaml)
            afterConfigLoad()
          } else if (x[0] == 'N' || x[0] == 'n') {
            rl.close()
            global.console.log('So, you just accidentally run me in a wrong folder. Exitting...')
            process.exit(1)
          } else {
            askUser()
          }
        })
      })()
    }
  }
} catch (err) {
  logger.logger.fatal({ file: config_path, err: err }, 'cannot open config file @{file}: @{!err.message}')
  process.exit(1)
}
