function onFormSubmit(e) {
  var formResponse = e.namedValues;

  // Extract data from form fields
  var initiativeName = formResponse['שם היוזמה'][0];
  var category = formResponse['קטגוריה'][0];
  var mainLink = formResponse['לינק לאתר או קישור ראשי'][0];
  var description = formResponse['תיאור פרטי היוזמה'][0];
  var whatsappLink = formResponse['Whatsapp link'][0];
  var telegramLink = formResponse['Telegram link'][0];
  var driveLink = formResponse['Google Drive link'][0];
  var discordLink = formResponse['Discord link'][0];
  var instagramLink = formResponse['Instagram link'][0];
  var tiktokLink = formResponse['Tiktok link'][0];
  var twitterLink = formResponse['Twitter / X link'][0];
  var facebookLink = formResponse['Facebook link'][0];

  // todo: adjust the form and add these fields
  var initiativeDetails = '_No response_';
  var validationLink = '_No response_';
  var websiteLink = '_No response_';
  var phoneNumber = '_No response_';
  var email = '_No response_';
  var formLink = formResponse['Google Form link'][0];
  var documentLink = formResponse['Google Doc link'][0];
  var linkedinLink = '_No response_';
  var youtubeLink = '_No response_';
  var donationLink = '_No response_';
  var logoLink = '_No response_';
  var tags = '_No response_';

  function normalizeResponse(value) {
    return value && value.trim() ? value.trim() : "_No response_";
  }

  // Construct the issue body using the form response data with markdown
    var issueBody =
    `### Initiative Name
    ${normalizeResponse(initiativeName)}

    ### Initiative Description
    ${normalizeResponse(description)}

    ### Initiative Details
    ${normalizeResponse(initiativeDetails)}

    ### Initiative Validation Details
    ${normalizeResponse(validationLink)}

    ### Initiative Category
    ${normalizeResponse(category)}

    ### Initiative main URL
    ${normalizeResponse(mainLink)}

    ### Initiative Website
    ${normalizeResponse(websiteLink)}

    ### Initiative Phone Number
    ${normalizeResponse(phoneNumber)}

    ### Initiative E-Mail
    ${normalizeResponse(email)}

    ### Initiative WhatsApp
    ${normalizeResponse(whatsappLink)}

    ### Initiative Telegram
    ${normalizeResponse(telegramLink)}

    ### Initiative Drive
    ${normalizeResponse(driveLink)}

    ### Initiative Form
    ${normalizeResponse(formLink)}

    ### Initiative Document
    ${normalizeResponse(documentLink)}

    ### Initiative Discord
    ${normalizeResponse(discordLink)}

    ### Initiative Facebook
    ${normalizeResponse(facebookLink)}

    ### Initiative Instagram
    ${normalizeResponse(instagramLink)}

    ### Initiative TikTok
    ${normalizeResponse(tiktokLink)}

    ### Initiative X (Twitter)
    ${normalizeResponse(twitterLink)}

    ### Initiative LinkedIn
    ${normalizeResponse(linkedinLink)}

    ### Initiative Youtube Page / Channel
    ${normalizeResponse(youtubeLink)}

    ### Initiative Donation Link
    ${normalizeResponse(donationLink)}

    ### Initiative logo
    ${normalizeResponse(logoLink)}

    ### Initiative Tags
    ${normalizeResponse(tags)}`;


    // Use the initiative name as the issue title + the required prefix
    var issueTitle = `[NEW-INITIATIVE]: ${initiativeName}`;

    // Call the function to create a GitHub issue
    createGithubIssue(issueTitle, issueBody);
}

function createGithubIssue(title, body) {
  var personalGithubToken = PropertiesService.getUserProperties().getProperty('GITHUB_TOKEN');
  var repo = '4tals/LinksForIsrael';
  var url = 'https://api.github.com/repos/' + repo + '/issues';

  var payload = {
    title: title,
    body: body,
    labels: ['new-initiative-request']
  };

  var options = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + personalGithubToken,
      Accept: 'application/vnd.github+json'
    },
    contentType: 'application/json',
    payload: JSON.stringify(payload),
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

  var e = { namedValues: namedValues };
  onFormSubmit(e);
}

function setPersonalGithubToken() {
  var personalGithubToken = 'your_actual_github_token'; // Replace with your actual token
  PropertiesService.getUserProperties().setProperty('GITHUB_TOKEN', personalGithubToken);
}
