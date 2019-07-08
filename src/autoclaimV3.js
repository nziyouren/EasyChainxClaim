const nodeOutlookMailer = require('nodejs-nodemailer-outlook');

const Chainx = require('chainx.js').default;

const private_key = '用户私钥';
const wallet_address = '用户钱包地址';
const noimate_address = '投票节点地址';

const userMail = '发送邮箱的邮箱地址';
const userMailPwd = '发送邮箱密码';
const toMail = '接收邮箱密码';

const claimInterval = 3 * 60 * 60 * 1000; //提取利息时间间隔，单位为毫秒，默认为3个小时提取投票一次。格式为（N小时 * 60 * 60 *1000）

let beforePcxBalance; //提取之前PCX余额
let afterPcxBalance; //提取之后PCX余额
let totalPcxBalance; //总的Pcx余额（可用余额+投票冻结的）

let claimPcxValue; //提取的pcx数量

let action = '';

/**
 * 提取充值资产利息
 * @param chainx
 * @param tokenName
 * @returns {Promise<any>}
 */
function claimDespositPromise(chainx, tokenName) {
    const extrinsicBTC = chainx.stake.depositClaim(tokenName);
    const claimTokenPromise = new Promise(function (resolve, reject) {
        extrinsicBTC.signAndSend(private_key, (error, response) => {
            if (error) {
                reject(error);
            } else if (response.status === 'Finalized') {
                if (response.result === 'ExtrinsicSuccess') {
                    action += tokenName + '提息成功';
                    action += '\n';
                    console.log(tokenName + '提息成功');
                    resolve(action);
                }
            }
        })
    });
    return claimTokenPromise;
}

/**
 * 获取账号余额
 * @param chainx
 * @returns {Promise<*>}
 */
async function getAccountBalance(chainx) {
    const account = await chainx.asset.getAssetsByAccount(wallet_address, 0, 10);
    return account;
}

/**
 * 获取账户总的pcx数量
 * @param account
 * @returns {*}
 */
function getTotalBalance(account) {
    return account.data[0].details.Free + account.data[0].details.ReservedStaking;
}

/**
 * 获取账户可用pcx数量
 * @param account
 * @returns {*}
 */
function getPcxBalance(account) {
    return account.data[0].details.Free;
}

/**
 * 转换成可阅读格式
 * @param value
 * @returns {number}
 */
function readFormat(value) {
    return value * 1e-8;
}

/**
 * 提取投票利息promise
 * @param chainx
 * @returns {Promise<any>}
 */
function claimVotePromise(chainx) {
    const claimVotePromise = new Promise(function (resolve, reject) {
        const extrinsicVote = chainx.stake.voteClaim(noimate_address);
        extrinsicVote.signAndSend(private_key, (error, response) => {
            if (error) {
                reject(error);
            } else if (response.status === 'Finalized') {
                if (response.result === 'ExtrinsicSuccess') {
                    console.log('投票提息成功');
                    action += '投票提息成功';
                    action += '\n';
                    resolve(action);
                }
            }
        });

    });

    return claimVotePromise;
}

/**
 * 投票给节点promise
 * @param chainx
 * @returns {Promise<any>}
 */
function voteNodePromise(chainx) {
    const voteNodePromise = new Promise(function (resolve, reject) {
        const voteValue = afterPcxBalance - 0.01 * 1e8; //每次投票PCX留0.01作为手续费
        console.log('投票 PCX: ', voteValue * 1e-8);
        const nominate = chainx.stake.nominate(noimate_address, voteValue, 'SWT auto vote tool made by nziyouren');
        nominate.signAndSend(private_key, (error, response) => {
            if (error) {
                reject(error);
            } else if (response.status === 'Finalized') {
                if (response.result === 'ExtrinsicSuccess') {
                    console.log('投票成功');
                    action += '投票成功';
                    resolve(action);
                }
            }
        });
    });
    return voteNodePromise;
}

/**
 * 发送邮件
 * @param claimValue 提取利息值
 * @param totalBalance 总的Pcx余额
 * @param action 动作字符串
 */
function sendMail(claimValue, totalBalance, action) {
    console.log("claim value: " + claimValue + " totalBalance: " + totalBalance + "action: \n" + action);
    const currentDate = new Date();
    const mailText = '😀自动提息投票成功 ' + currentDate.toLocaleString() + '\n' + '提取利息:' + claimValue + '\n'
        + '账户PCX总余额:' + totalBalance + '\n'
        + '---------------------------------------------' + '\n'
        + action;

    nodeOutlookMailer.sendEmail({
        auth: {
            user: userMail,
            pass: userMailPwd,
        },
        from: userMail,
        to: toMail,
        subject: 'PCX 提息成功',
        text: mailText,
        onError: e => {
            console.log('send mail error!!!' + e);
        },
        onSuccess: i => {
            console.log('send mail success!!!');
        },
    });
}

/**
 * 发送错误信息
 * @param error
 */
function sendMailError(error) {
    console.error(error);
    nodeOutlookMailer.sendEmail({
        auth: {
            user: userMail,
            pass: userMailPwd,
        },
        from: userMail,
        to: toMail,
        subject: 'PCX 错误报告',
        text: '😢Hi, pcx 脚本执行错误' + error,
        onError: e => {
            console.log('send mail error!!!' + e);
        },
        onSuccess: i => {
            console.log('send mail success!!!');
        },
    });
}

/**
 * 提取利息函数
 * @returns {Promise<void>}
 */
async function claimAll() {
    let chainx = new Chainx('wss://w1.chainx.org.cn/ws');
    chainx.isRpcReady().then(async function () {
        action = '';
        let currentDate = new Date();
        console.log("开始执行自动提取脚本" + currentDate.toLocaleString());
        let account = await getAccountBalance(chainx);
        beforePcxBalance = getPcxBalance(account);

        console.log("提息之前账号pcx可用余额：" + readFormat(beforePcxBalance));
        await claimDespositPromise(chainx, 'BTC').catch(function (error) {
            console.error(error);
            sendMailError(error);
        });

        await claimDespositPromise(chainx, 'SDOT').catch(function (error) {
            console.error(error);
            sendMailError(error);
        });
        await claimVotePromise(chainx).catch(function (error) {
            console.error(error);
            sendMailError(error);
        });

        account = await getAccountBalance(chainx);
        afterPcxBalance = getPcxBalance(account);
        console.log("提息之后账号pcx可用余额：" + readFormat(afterPcxBalance));
        totalPcxBalance = getTotalBalance(account);
        console.log("提息之后账号pcx总余额：" + readFormat(totalPcxBalance));
        claimPcxValue = afterPcxBalance - beforePcxBalance;

        await voteNodePromise(chainx).then(async function (value) {
            sendMail(readFormat(claimPcxValue), readFormat(totalPcxBalance), action);
        }).catch(function (error) {
            console.error("执行自动提息脚本 error: " + error);
            sendMailError(error);
        });
    }).catch(function (error) {
        sendMailError(error);
        console.error(error);
    });
    chainx.on('connected', () => {
        console.log('RPC connected!');
    });

    chainx.on('disconnected', () => {
        console.log('RPC disconnected!');
    });

    chainx.on('error', () => {
        console.log('RPC error!');
    });


    chainx.on('ready', () => {
        console.log('RPC ready!');
    });
}


claimAll();

setInterval(claimAll, claimInterval);