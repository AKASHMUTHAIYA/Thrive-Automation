import { google } from "googleapis";
import readline from "readline";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your OAuth2 credentials (from email-credentials.js)
const CLIENT_ID =
	"";
const CLIENT_SECRET = "";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // or "http://localhost" if that's what you used

// Gmail API scopes
const SCOPES = [
	"https://www.googleapis.com/auth/gmail.modify",
	"https://www.googleapis.com/auth/calendar.readonly",
	"https://www.googleapis.com/auth/calendar.events",
];

/**
 * Create an OAuth2 client with the given credentials
 */
const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI,
);

/**
 * Get a new refresh token
 */
async function getNewRefreshToken() {
	// Generate the authorization URL
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
		// Force consent screen to get a new refresh token
		prompt: "consent",
	});

	console.log("\n==========================================================");
	console.log("Gmail OAuth2 Token Refresh Script");
	console.log("==========================================================\n");
	console.log("Your current refresh token has been invalidated.");
	console.log("This usually happens when you change your password.\n");
	console.log("To get a new refresh token, follow these steps:\n");
	console.log("1. Open this URL in your browser:");
	console.log("\n" + authUrl + "\n");
	console.log("2. Authorize the application");
	console.log("3. Copy the authorization code from the browser");
	console.log("4. Paste it below\n");

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve, reject) => {
		rl.question("Enter the authorization code: ", async (code) => {
			rl.close();

			try {
				// Exchange the authorization code for tokens
				const { tokens } = await oauth2Client.getToken(code);

				console.log("\n✅ Successfully obtained new tokens!\n");
				console.log("Your new refresh token is:");
				console.log(tokens.refresh_token);
				console.log("\n");

				// Update the email-credentials.js file
				const credentialsPath = path.join(__dirname, "email-credentials.js");

				const newCredentials = `export const gmail_data = {
	CLIENT_ID:
		"${CLIENT_ID}",
	CLIENT_SECRET: "${CLIENT_SECRET}",
	REFRESH_TOKEN:
		"${tokens.refresh_token}",
	REDIRECT_URI: "${REDIRECT_URI}",
};
`;

				await fs.writeFile(credentialsPath, newCredentials, "utf8");
				console.log(
					"✅ Updated email-credentials.js with the new refresh token\n",
				);
				console.log("File path:", credentialsPath);
				console.log("\nYou can now run your tests again!\n");

				resolve(tokens);
			} catch (error) {
				console.error("\n❌ Error obtaining tokens:", error.message);
				reject(error);
			}
		});
	});
}

// Run the script
getNewRefreshToken()
	.then(() => {
		console.log("==========================================================");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Failed to refresh token:", error);
		process.exit(1);
	});
