import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const environment = process.env.ENVIRONMENT;
const jsonData = JSON.parse(
	fs.readFileSync("./TSAP/Data/Environment.json", "utf8"),
)[environment];
const envDetails = {
	url: jsonData.url,
	uri: jsonData.uri,
	adminEmail: jsonData.adminEmail,
	password: jsonData.password,
	approverEmail: jsonData.approverEmail,
	approverPassword: jsonData.approverPassword,
	senderEmail: jsonData.senderEmail,
	urlTrial: jsonData.urlTrial,
	uriTrial: jsonData.uriTrial,
	usernameTrial: jsonData.usernameTrial,
	passwordTrial: jsonData.passwordTrial,
	emailDomain: jsonData.emailDomain,
	sampleUserMail: jsonData.sampleUserMail,
	sampleUserName: jsonData.sampleUserName,
	loginUrl: jsonData.loginUrl,
	signupUrl: jsonData.signupUrl,
	goalCycle: jsonData.goalCycle,
	goalsUserEmail: jsonData.goalsUserEmail,
	goalsPassword: jsonData.goalsPassword,
	goalsUserName: jsonData.goalsUserName,
	goalSnapshotSecret: jsonData.goalSnapshotSecret,
};
export { envDetails };
