import path from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function globalTeardown() {
	// const reportPath = path.join(__dirname, "./html-report.html");
	// const zip = new AdmZip();
	// zip.addLocalFile(reportPath);
	// Further teardown logic

	// Force garbage collection if available (when --expose-gc flag is used)
	if (global.gc) {
		console.log("🧹 Running garbage collection...");
		global.gc();
	}

	// Small delay to allow cleanup to complete
	await new Promise((resolve) => setTimeout(resolve, 100));
}
