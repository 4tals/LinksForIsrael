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

  // Construct the issue body using the form response data
  var issueBody = "### Initiative Name\n" + initiativeName +
                    "\n\n### Category\n" + category +
                    "\n\n### Category\n" + category +
                    "\n\n### Main Link\n" + mainLink +
                    "\n\n### Description\n" + description +
                    "\n\n### WhatsApp Link\n" + (whatsappLink || 'N/A') +
                    "\n\n### Remarks for Admins\n" + (remarksForAdmins || 'N/A') +
                    "\n\n### Telegram Link\n" + (telegramLink || 'N/A') +
                    "\n\n### Drive Link\n" + (driveLink || 'N/A') +
                    "\n\n### Form Link\n" + (gFormLink || 'N/A') +
                    "\n\n### Doc Link\n" + (gDocLink || 'N/A') +
                    "\n\n### Discord Link\n" + (discordLink || 'N/A') +
                    "\n\n### Instagram Link\n" + (instagramLink || 'N/A') +
                    "\n\n### TikTok Link\n" + (tiktokLink || 'N/A') +
                    "\n\n### Twitter/X Link\n" + (twitterLink || 'N/A') +
                    "\n\n### Facebook Link\n" + (facebookLink || 'N/A');

    // Use the initiative name as the issue title
    var issueTitle = initiativeName;

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
