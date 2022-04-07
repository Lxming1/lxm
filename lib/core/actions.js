// node自带的工具，可以将函数转成promise的形式
const { promisify } = require('util')
const path = require('path')
const fs = require('fs')

// npm install download-git-repo
const download = promisify(require('download-git-repo'))

const { vueRepo } = require('../config/repo-config')
const { commandSpawn } = require('../utils/terminal')
const { compile, writeToFile, createDirSync } = require('../utils/utils')

// action: 'create'
const createProjectAction = async (project) => {
  console.log('lxm will create vue project for you~')
  // 1.clone项目
  await download(vueRepo, project, { clone: true })

  // 2.执行npm install
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  await commandSpawn(command, ['install'], { cwd: `./${project}` }) //cwd:子进程的工作目录

  // 3.执行npm run serve
  await commandSpawn(command, ['run', 'serve'], { cwd: `./${project}` })
}

// action: 'addcpn'
const addComponentAction = async (cpnName, dest) => {
  // 1.编译ejs文件
  const result = await compile('vue-component.ejs', {
    name: cpnName,
    lowerName: cpnName.toLowerCase(),
  })
  // 2.创建文件并写入
  const filePath = path.resolve(dest, `./${cpnName}.vue`)
  if (!fs.existsSync(filePath)) {
    await writeToFile(filePath, result)
    console.log('Add component success')
  } else {
    console.log(`Add component error, ${cpnName} is already`)
  }
}

// action: 'addpage'
const addPageAction = async (name, dest) => {
  // 1.解析ejs
  const nameObj = {
    name,
    lowerName: name.toLowerCase(),
  }
  const cpnRes = await compile('vue-component.ejs', nameObj)
  const routerRes = await compile('vue-router.ejs', nameObj)

  // 2.创建文件并写入
  const filePath = path.resolve(dest, name.toLowerCase())

  // 如果当前路径的文件已经存在，则提示already
  if (!fs.existsSync(filePath) && createDirSync(filePath)) {
    const childPath = (file) => path.resolve(filePath, file)
    await writeToFile(childPath(`${name}.vue`), cpnRes)
    await writeToFile(childPath('router.js'), routerRes)
    console.log('Add page success')
  } else {
    console.log(`Add page error, ${name} is already`)
  }
}

// action: 'addstore'
const addStoreAction = async (name, dest) => {
  // 1.解析ejs
  const storeRes = await compile('vue-store.ejs')
  const typeRes = await compile('vue-types.ejs')

  // 2.创建文件并写入
  const storePath = path.resolve(dest, name.toLowerCase())
  // console.log(!fs.existsSync(dest))
  if (!fs.existsSync(storePath) && createDirSync(storePath)) {
    const childPath = (file) => path.resolve(storePath, file)
    await writeToFile(childPath(`index.js`), storeRes)
    await writeToFile(childPath('type.js'), typeRes)
    console.log('Add store success')
  } else {
    console.log(`Add store error, ${name} is already`)
  }
}

module.exports = {
  createProjectAction,
  addComponentAction,
  addPageAction,
  addStoreAction,
}
