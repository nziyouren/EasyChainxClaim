# EasyChainxClaim
A script for claim ChainX PCX interest and nominate node automatically

Chinese Version [README.md](https://github.com/nziyouren/EasyChainxClaim/blob/master/README.md)

## Risks and disclaimers
This script involves the user's account private key and email password, better used if you have some knowledge of the code. If you don't trust the script, don't use it.
Please ensure that this script is used in a safe environment. For account security, do not use it on a public computer!!!

## What's EasyPCXClaim
EasyPCXClaim is a script that can help users to claim interest and vote node automatically. Compared to other scripts, it can not only auto claim, but also send you email report about how much interest you claimed in past time.

## Why need EasyPCXClaim
Due to the special top-up and voting mining methods of PCX, the unextracted interest will be diluted after the new asset top-up comes in. In order to ensure the maximization of mining interests, it is better to withdraw the interest in time for re-investment. But the manual timing of the process is too tedious, so it requires a fully automated claim and vote script.

## EasyPCXClaim Functions
1. Auto claim BTC/SDOT channel interest
2. Auto claim vote interest
3. Auto vote to some node after claim interest
4. Send email report about cliam interest and your total account balance

## Script dependency
### Install node.js and npm
To install nodejs and NPM, please refer the official website tutorial

### Install chainx and email dependency
Execute the following commands successively:
* npm install chainx.js
* npm install nodemailer
* npm install nodejs-nodemailer-outlook

## How to use

### Environment dependency
Before using scripts, make sure that the above script environment dependencies are installed correctly

### Modify script parameters
Open the autoclaimv3.js script file and modify the following parameters

|   parameters                 | instruction |
| :---         | :--- |
| private_key           |  your account private key |
| wallet_address        |  your account address |
| nominate_address      |  the candidate address |
| claimInterval         |  time interval between claim the interest and voting (in milliseconds, the default is 3 hours) |

The email address and password used to send the email. **Currently only supports outlook(microsoft live) email**

|   parameters                 | instruction |
| -------------         | --- |
| userMail           |  outlook email address for sending emails |
| userMailPwd        |  email password |
| toMail             |  any email address used to receive email report |


``
Note: if you log in the mailbox with new IP for the first time, the script may trigger email warning. You need to log in the mailbox to check the mail and trust this log in activity. After more than 10 minutes, you can successfully send the mail
``

### Run script
node autoclaimV3.js

If you want run the script in specific time interval, it's best to deploy it on a server(vps) and run it in the background. Using the command
nohup node autoclaimV3.js &

### Receive email report
If you run the above steps successfully, you can receive regular email reports of claim interest and nominate results.

<img src="https://github.com/nziyouren/EasyChainxClaim/blob/master/img/send_success.png" alt="Drawing" width="414px" height="896px" />

## Future plan
* [ ] support other email address to send report
* [ ] optimize code
