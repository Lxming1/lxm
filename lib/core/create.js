const program = require('commander')
const {
  createProjectAction,
  addComponentAction,
  addPageAction,
  addStoreAction,
} = require('./actions')

const createCommands = () => {
  // command: 'create'
  program
    .command('create <demo>')
    .description('clone a repository into a folder, such lxm create myProject')
    .action(createProjectAction)

  // command: 'addcpn'
  program
    .command('addcpn <cpnname>')
    .description('add vue component, such lxm addcpn Home [-d src/components]')
    .action((name) => {
      addComponentAction(name, program._optionValues.dest || 'src/components')
    })

  // command: 'addpage'
  program
    .command('addpage <pagename>')
    .description('add vue page and router config, such lxm addpage profile [-d src/pages]')
    .action((name) => {
      addPageAction(name, program._optionValues.dest || 'src/pages')
    })

  // command: 'addstore'
  program
    .command('addstore <storename>')
    .description('add vue store, such lxm addstore profile [-d src/store/modules]')
    .action((name) => {
      addStoreAction(name, program._optionValues.dest || 'src/store/modules')
    })
}
module.exports = createCommands
