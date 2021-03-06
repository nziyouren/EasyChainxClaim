# EasyChainxClaim
Chainx PCX自动提息投票发邮件的小工具

English Version [README_EN.md](https://github.com/nziyouren/EasyChainxClaim/blob/master/README_EN.md)

## 风险及免责声明
本脚本涉及到用户的账户私钥及邮箱密码，最好在有一定代码基础的情况下使用。如果对脚本不信任，建议不要使用。
请确保本脚本的使用环境是安全的，为了账户安全请不要在公共电脑上使用！！！

## EasyPCXClaim是什么？
EasyPCXClaim是一个能够全自动帮助用户自动提取充值渠道利息、投票利息并复投及发送邮件报告的脚本。其他脚本只能复投并不能及时告知你投票收益情况。

## 为什么需要EasyPCXClaim？
由于PCX特殊的充值和投票挖矿方式，在新的资产充值进来后，未提取的利息会被稀释，为了保证挖矿利益最大化，最好及时提取利息进行复投。但是这个过程需要人工定时操作太枯燥了，所以需要一个全自动的提息投票通知一条龙操作的脚本。

## EasyPCXClaim脚本功能
1. 自动提取BTC、SDOT充值渠道的利息
2. 自动提取投票利息
3. 提取利息后自动复投
4. 复投成功后发邮件自动通知（邮件内容包含这次提取利息金额，账户总的PCX余额）

## 脚本环境依赖
### 安装nodejs及npm
安装nodejs及npm请安装官网教程进行安装

### 安装chainx及邮件依赖
依次执行如下命令：
* npm install chainx.js
* npm install nodemailer
* npm install nodejs-nodemailer-outlook

## 如何使用

### 前提条件
在使用脚本前，请确保安装上面脚本环境依赖都安装正确

### 修改脚本参数
打开autoclaimV3.js脚本文件，修改如下参数

|   参数                 | 含义 |
| :---         | :--- |
| private_key           |  填写你的账户私钥 |
| wallet_address        |  填写钱包地址 |
| nominate_address      |  填写投票的节点地址 |
| claimInterval         |  提取利息并投票的时间间隔（单位为毫秒，默认为3个小时提取投票一次） |

因为需要自动发送邮件报告，所以需要用来发送邮件的邮箱地址和密码。**目前第一版只支持outlook邮箱**

|   参数                 | 含义 |
| -------------         | --- |
| userMail           |  用来发邮件的outlook邮箱 |
| userMailPwd        |  邮箱密码 |
| toMail             |  接收报告的邮箱 |


``
注意：在第一次使用脚本登陆邮箱，在使用新的ip的情况下可能会触发outlook预警，需要登陆到邮箱里面查看邮件，并信任此次登陆活动，等个10多分钟后就可以成功发送邮件了
``

### 运行脚本
node autoclaimV3.js

如果想真正的实现全自动运行的话，最好把脚本部署到服务器上并后台运行。使用命令
nohup node autoclaimV3.js &

### 接收报告
安装上面步骤依次运行的话，就可以定时收到提息的邮件报告了

<img src="https://github.com/nziyouren/EasyChainxClaim/blob/master/img/send_success.png" alt="Drawing" width="414px" height="896px" />

## 后续计划
* [ ] 支持其他邮箱发送
* [ ] 优化代码
