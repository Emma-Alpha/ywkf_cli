#!/usr/bin/env node
const program = require("commander")
const inquirer = require("inquirer")
const path = require("path")
const ora = require('ora') // 引入ora
const fs = require('fs-extra')
const { exec } = require('child_process');

// const templates = require("./templates.js")
const { getGitReposList } = require('./api.js')
const package = require("../package.json")

function cloneRepository(repoUrl, destination) {
  return new Promise((resolve, reject) => {
    const command = `git clone ${repoUrl} ${destination}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error cloning repository: ${stderr}`);
      } else {
        resolve(`Repository cloned successfully: ${stdout}`);
      }
    });
  });
}

program
  .command("create [projectName]")
  .description("创建模版")
  .option('-t, --template <template>', '模版名称')
  .action(async (projectName, options) => {
    const getRepoLoading = ora('获取模版列表...')
    getRepoLoading.start()
    // const templates = await getGitReposList('Emma-Alpha')
    const templates = {
      webpack: {
        main: [
          {
            value: "https://ywgit.gz4399.com/ywkf/webpack-mainApplicate_demo.git",
            name: "webpack-mainApplicate_demo"
          }
        ],
        sub: [
          {
            value: "https://ywgit.gz4399.com/ywkf/webpack-subApplicate_demo.git",
            name: "webpack-subApplicate_demo"
          }
        ]
      },
      vite: {
        main: [
          {
            value: "https://ywgit.gz4399.com/ywkf/vite-mainApplicate_demo.git",
            name: "vite-mainApplicate_demo"
          }
        ],
        sub: [
          {
            value: "https://ywgit.gz4399.com/ywkf/vite-subApplicate_demo",
            name: "vite-subApplicate_demo"
          }
        ]
      }
    }

    getRepoLoading.succeed('获取模版列表成功!')

    // 1. 如果用户没有传入名称就交互式输入
    if (!projectName) {
      const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "请输入项目名称：",
      })
      projectName = name // 赋值输入的项目名称
    }
    console.log('项目名称：', projectName)

    // 2. 选择工具类型
    const { toolType } = await inquirer.prompt({
      type: 'list',
      name: 'toolType',
      message: '请选择工具类型：',
      choices: ['webpack', 'vite']
    })
    console.log('工具类型：', toolType)

    // 3. 选择应用方向
    const { appDirection } = await inquirer.prompt({
      type: 'list',
      name: 'appDirection',
      message: '请选择应用方向：',
      choices: ['main', 'sub']
    })
    console.log('应用方向：', appDirection)

    // 4. 选择模版
    let projectTemplate;
    if (options.template) {
      projectTemplate = templates[toolType][appDirection].find(template => template.name === options.template)?.value;
    }

    if (!projectTemplate) {
      const { template } = await inquirer.prompt({
        type: 'list',
        name: 'template',
        message: '请选择模版：',
        choices: templates[toolType][appDirection]
      })
      projectTemplate = template; // 赋值选择的项目模板
    }
    console.log('模版：', projectTemplate)

    // 获取目标文件夹路径
    const dest = path.join(process.cwd(), projectName)
    // 判断文件夹是否存在，存在就交互询问用户是否覆盖
    if (fs.existsSync(dest)) {
      const { force } = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: '目录已存在，是否覆盖？'
      })
      // 如果覆盖就删除文件夹继续往下执行，否的话就退出进程
      force ? fs.removeSync(dest) : process.exit(1)
    }

    // 开始loading
    const loading = ora('正在下载模版...')
    loading.start()
    // 5. 开始下载模版
    try {
      const result = await cloneRepository(projectTemplate, dest);
      loading.succeed('创建模版成功!') // 成功loading
      console.log(`\ncd ${projectName}`)
      console.log('npm i')
      console.log('npm start\n')
    } catch (error) {
      loading.fail('创建模版失败：' + error) // 失败loading
    }
  })

// 定义当前版本
program.version(`v${package.version}`)
program.on('--help', () => { }) // 添加--help
program.parse(process.argv)
