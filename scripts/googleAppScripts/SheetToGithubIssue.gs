function onFormSubmit(e) {
  var formResponse = e.namedValues;

  // Extract data from form fields
  var initiativeName = formResponse['שם היוזמה'][0];
  var category = formResponse['קטגוריה'][0];
  var mainLink = formResponse['לינק לאתר או קישור ראשי'][0];
  var description = formResponse['תיאור פרטי היוזמה'][0];
  var remarksForAdmins = formResponse['הערות למנהלי העמוד'][0];
  var whatsappLink = formResponse['Whatsapp link'][0];
  var telegramLink = formResponse['Telegram link'][0];
  var driveLink = formResponse['Google Drive link'][0];
  var gFormLink = formResponse['Google Form link'][0];
  var gDocLink = formResponse['Google Doc link'][0];
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
  var formLink = '_No response_';
  var documentLink = '_No response_';
  var linkedinLink = '_No response_';
  var youtubeLink = '_No response_';
  var donationLink = '_No response_';
  var logoLink = '_No response_';
  var tags = '_No response_';

  // Function to format the value or return "_No response_"
  function formatValue(value) {
    return value.trim() ? value.trim() : "_No response_";
  }

  // Construct the issue body using the form response data with markdown
  var issueBody = `### Initiative Name\n${formatValue(initiativeName)}\n\n` +
                  `### Initiative Description\n${formatValue(description)}\n\n` +
                  `### Initiative Details\n${formatValue(initiativeDetails)}\n\n` +
                  `### Initiative Validation Details\n${formatValue(validationLink)}\n\n` +
                  `### Initiative Category\n${formatValue(category)}\n\n` +
                  `### Initiative main URL\n${formatValue(mainLink)}\n\n` +
                  `### Initiative Website\n${formatValue(websiteLink)}\n\n` +
                  `### Initiative Phone Number\n${formatValue(phoneNumber)}\n\n` +
                  `### Initiative E-Mail\n${formatValue(email)}\n\n` +
                  `### Initiative WhatsApp\n${formatValue(whatsappLink)}\n\n` +
                  `### Initiative Telegram\n${formatValue(telegramLink)}\n\n` +
                  `### Initiative Drive\n${formatValue(driveLink)}\n\n` +
                  `### Initiative Form\n${formatValue(formLink)}\n\n` +
                  `### Initiative Document\n${formatValue(documentLink)}\n\n` +
                  `### Initiative Discord\n${formatValue(discordLink)}\n\n` +
                  `### Initiative Facebook\n${formatValue(facebookLink)}\n\n` +
                  `### Initiative Instagram\n${formatValue(instagramLink)}\n\n` +
                  `### Initiative TikTok\n${formatValue(tiktokLink)}\n\n` +
                  `### Initiative X (Twitter)\n${formatValue(twitterLink)}\n\n` +
                  `### Initiative LinkedIn\n${formatValue(linkedinLink)}\n\n` +
                  `### Initiative Youtube Page / Channel\n${formatValue(youtubeLink)}\n\n` +
                  `### Initiative Donation Link\n${formatValue(donationLink)}\n\n` +
                  `### Initiative logo\n${formatValue(logoLink)}\n\n` +
                  `### Initiative Tags\n${formatValue(tags)}`;

    // Use the initiative name as the issue title + the required prefix
    var issueTitle = `[NEW-INITIATIVE]: ${initiativeName}`;

    // Call the function to create a GitHub issue
    createGithubIssue(issueTitle, issueBody);
}

function createGithubIssue(title, body) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var githubToken = scriptProperties.getProperty('GITHUB_TOKEN');
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
      Authorization: 'token ' + githubToken,
      Accept: 'application/vnd.github.v3+json'
    },
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // This will prevent the script from throwing an exception on HTTP errors
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
  } catch (error) {
    Logger.log('Error creating GitHub issue: ' + error.toString());
  }
}

function testOnFormSubmit(row = 153) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Make sure this range includes all the headers for your form responses
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
