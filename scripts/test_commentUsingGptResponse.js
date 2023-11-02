const github = {
    rest: {
        issues: {
            createComment: (cmt) => { 
                console.log("posting comment:")
                console.log(cmt)
            }
        },
        pulls: {
            create: (pr) => {
                console.log("creating PR:")
                console.log(pr)
                return {
                    url: "https://example.com"
                }
            }
        }
    }
}    

const context = {
    repo: {
        owner: "ohadschn",
        repo: "ohadschn/ConnectPortal"
    },
    issue: {
        number: 42
    }
}

const script = require('./commentUsingGptResponse.js')

script({github, context})