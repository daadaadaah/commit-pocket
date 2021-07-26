const inquirer = require('inquirer');
const proc = require('child_process');
const fs = require('fs');

const jsonPath = __dirname + '/commitPocket.json';
let commits = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const MENU = {
    OPEN_COMMIT_POCKET: '🎁 open commit pocket',
    ADD_POCKET_WITH_GIT: '🎯 save commit by selectting commit with git log',
    ADD_POCKET_DIRECTLY: '💻 save commit by inputting commit directly',
    REMOVE_COMMIT: '🔥 remove commit in pocket',   
}

export default function start() {
    inquirer.prompt([
        {
            name: 'action',
            type: 'rawlist',
            message: 'What do you want to do?',
            choices: [MENU.OPEN_COMMIT_POCKET, MENU.ADD_POCKET_WITH_GIT, MENU.ADD_POCKET_DIRECTLY, MENU.REMOVE_COMMIT]
            
        },
        {
            name: 'dedicated',
            type: 'rawlist',
            message: 'Which commit?',
            when: (answers) => {
                return answers.action === MENU.ADD_POCKET_WITH_GIT
            },
            choices: function () {
                const aaa = proc.execSync("git log").toString();
                const temps = aaa.split('commit ');
                
                let i, ids = [];
                temps.forEach((temp) => {
                    const commitMsg = temp.split('\n')[4];
                    const commitId = temp.substr(0, 7);
                    if(commitMsg) {
                        // const msg = `[${commitId}] ${commitMsg}`;
                        const msg = `${commitId} | ${commitMsg}`;
                        ids.push(msg);
                    }      
                });

                return ids;
            }
        },
        {
            name: 'commitId',
            type: 'input',
            message: 'What is your new CommitId?',
            when: (answers) => {
                return answers.action === MENU.ADD_POCKET_DIRECTLY
            }
        },
        {
            name: 'commitMessage',
            type: 'input',
            message: 'What is your new CommentMessage',
            when: (answers) => {
                return answers.action === MENU.ADD_POCKET_DIRECTLY
            }
        },
        
        {
            name: 'dedicated',
            type: 'rawlist',
            message: 'Which commit?',
            when: (answers) => {
                return answers.action === MENU.REMOVE_COMMIT
            },
            choices: function () {
                let i, ids = [];

                for (i = 0; i < commits.length; i++) {
                    const commitId = commits[i].CommitId;
                    const commitMsg = commits[i].CommitMessage;
                    
                    const commit = `${commitId} | ${commitMsg}`;

                    ids.push(commit);
                }
                return ids;
            }
        }
    ]).then(answers => {
        
        switch (answers.action) {
            case MENU.OPEN_COMMIT_POCKET:
                showCommitPocket(commits);
                console.log("\n");
                break;
            case MENU.ADD_POCKET_WITH_GIT:
                const word = answers.dedicated.split(' | ');

                const commitId = word[0];
                const commitMessage = String(word[1]).substr(4, String(word[1]).length);
                
                const today = new Date();   
                const createdAt = today.toLocaleString();

                const iscommits = commits.find(commit => commit.CommitId === commitId);

                if(iscommits) {
                    showMessage();
                } else {
                    commits.push({
                        CommitId: commitId,
                        CommitMessage: commitMessage,
                        putAt: createdAt,
                    });
                }

                showCommitPocket(commits);

                console.log("\n");
                break;
            case MENU.ADD_POCKET_DIRECTLY:
                const today2 = new Date();   
                const createdAt2 = today2.toLocaleString();

                const iscommits2 = commits.find(commit => commit.CommitId === answers.commitId);

                if(iscommits2) {
                    showMessage();
                } else {
                    commits.push({
                        CommitId: answers.commitId,
                        CommitMessage: answers.commitMessage,
                        putAt: createdAt2,
                    });    
                }
                
                showCommitPocket(commits);
                console.log("\n");
                break;
            case MENU.REMOVE_COMMIT:
                const items = answers.dedicated.split(' | ');
                const removeCommitId = items[0];

                commits = commits.filter(commit => commit.CommitId !== removeCommitId);
                
                showCommitPocket(commits);

                console.log("\n");
                break;
        }

        
        writeToFile();
        start();

    });
}

function showMessage() {
    console.log("\n");
    console.log("🎁 이미 commit-pocket 있는 commit 입니다. 🎒");
}

function showCommitPocket(commits) {
    console.log("\n");
    console.table(commits);
    console.log("\n");
}


function writeToFile(){
    fs.writeFileSync(jsonPath, JSON.stringify(commits));
}


// start();
