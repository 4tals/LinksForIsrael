const github = {
    rest: {
        issues: {
            createComment: (cmt) => { 
                console.log("posting comment:")
                console.log(cmt)
            }
        }
    }
}    

const context = {
    repo: {
        owner: "ohadschn",
        repo: "links4israel"
    },
    issue: {
        number: 42
    }
}

const script = require('./commentUsingGptResponse.js')

script({github, context})