function onFormSubmit(e) {
    var formResponse = e.namedValues;

    // Helper function to normalize the response
    function normalizeResponse(value) {
        return value && value.trim() ? value.trim() : "_No response_";
    }

    // Construct the issue body using the form response data with markdown
    // Make sure the keys match exactly with your Google Sheet's column headers
    var initiativeName = normalizeResponse(formResponse['Initiative Name'][0]);
    var initiativeDescription = normalizeResponse(formResponse['Initiative Description'][0]);
    var initiativeDetails = normalizeResponse(formResponse['Initiative Details'][0]);
    var initiativeValidationDetails = normalizeResponse(formResponse['Initiative Validation Details'][0]);
    var initiativeCategory = normalizeResponse(formResponse['Initiative Category'][0]);
    var initiativeMainURL = normalizeResponse(formResponse['Initiative Main URL'][0]);
    var initiativeLogo = normalizeResponse(formResponse['Initiative Logo'][0]);
    var initiativeWebsite = normalizeResponse(formResponse['Initiative Website'][0]);
    var initiativePhoneNumber = normalizeResponse(formResponse['Initiative Phone Number'][0]);
    var initiativeEmail = normalizeResponse(formResponse['Initiative E-Mail'][0]);
    var initiativeWhatsApp = normalizeResponse(formResponse['Initiative WhatsApp'][0]);
    var initiativeTelegram = normalizeResponse(formResponse['Initiative Telegram'][0]);
    var initiativeDrive = normalizeResponse(formResponse['Initiative Drive'][0]);
    var initiativeForm = normalizeResponse(formResponse['Initiative Form'][0]);
    var initiativeDocument = normalizeResponse(formResponse['Initiative Document'][0]);
    var initiativeDiscord = normalizeResponse(formResponse['Initiative Discord'][0]);
    var initiativeFacebook = normalizeResponse(formResponse['Initiative Facebook'][0]);
    var initiativeInstagram = normalizeResponse(formResponse['Initiative Instagram'][0]);
    var initiativeTikTok = normalizeResponse(formResponse['Initiative TikTok'][0]);
    var initiativeTwitter = normalizeResponse(formResponse['Initiative X (Twitter)'][0]);
    var initiativeLinkedIn = normalizeResponse(formResponse['Initiative LinkedIn'][0]);
    var initiativeYouTube = normalizeResponse(formResponse['Initiative YouTube Page / Channel'][0]);
    var initiativeDonationLink = normalizeResponse(formResponse['Initiative Donation Link'][0]);
    var initiativeTags = normalizeResponse(formResponse['Initiative Tags'][0]);

    // Construct the issue body using markdown
    var issueBody = `### Initiative Name
${initiativeName}

### Initiative Description
${initiativeDescription}

### Initiative Details
${initiativeDetails}

### Initiative Validation Details
${initiativeValidationDetails}

### Initiative Category
${initiativeCategory}

### Initiative Main URL
${initiativeMainURL}

### Initiative Logo
${initiativeLogo}

### Initiative Website
${initiativeWebsite}

### Initiative Phone Number
${initiativePhoneNumber}

### Initiative E-Mail
${initiativeEmail}

### Initiative WhatsApp
${initiativeWhatsApp}

### Initiative Telegram
${initiativeTelegram}

### Initiative Drive
${initiativeDrive}

### Initiative Form
${initiativeForm}

### Initiative Document
${initiativeDocument}

### Initiative Discord
${initiativeDiscord}

### Initiative Facebook
${initiativeFacebook}

### Initiative Instagram
${initiativeInstagram}

### Initiative TikTok
${initiativeTikTok}

### Initiative X (Twitter)
${initiativeTwitter}

### Initiative LinkedIn
${initiativeLinkedIn}

### Initiative YouTube Page / Channel
${initiativeYouTube}

### Initiative Donation Link
${initiativeDonationLink}

### Initiative Tags
${initiativeTags}`;

    var issueTitle = `[NEW-INITIATIVE]: ${initiativeName}`;

    // Call the function to create a GitHub issue
    createGithubIssue(issueTitle, issueBody);
}

function createGithubIssue(title, body) {
    var personalGithubToken = PropertiesService.getUserProperties().getProperty('GITHUB_TOKEN');
    var repo = '4tals/LinksForIsrael';
    var url = 'https://api.github.com/repos/' + repo + '/issues';

    var payload = {
        title: title, body: body, labels: ['new-initiative-request']
    };

    var options = {
        method: 'post', headers: {
            Authorization: 'Bearer ' + personalGithubToken, Accept: 'application/vnd.github+json'
        }, contentType: 'application/json', payload: JSON.stringify(payload),
    };

    try {
        var response = UrlFetchApp.fetch(url, options);
        Logger.log(response.getContentText());
    } catch (error) {
        console.error('Error creating GitHub issue: ' + error.toString());
        throw error;
    }
}

function testOnFormSubmit(row = 153) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headersRange = sheet.getRange("A1:Z1");
    var headers = headersRange.getValues()[0];

    // Adjust this range to match the range where your test data is located
    var testDataRange = sheet.getRange(`A${row}:Z${row}`);
    var testData = testDataRange.getValues()[0];

    // Log the actual values to make sure they're what you expect
    Logger.log("Headers: " + headers.join(", "));
    Logger.log("Test Data: " + testData.join(", "));

    var namedValues = {};
    for (var i = 0; i < headers.length; i++) {
        namedValues[headers[i]] = [testData[i]];
    }

    Logger.log("Named Values: " + JSON.stringify(namedValues));

    var e = {namedValues: namedValues};
    onFormSubmit(e);
}

function setPersonalGithubToken() {
  var personalGithubToken = 'your_actual_github_token'; // Replace with your actual token
  PropertiesService.getUserProperties().setProperty('GITHUB_TOKEN', personalGithubToken);
}
