INOVEGEN WEBSITE (static, ready for Vercel)

STEP 1 - SAVE FORM DATA TO GOOGLE SHEETS (about 5 minutes, all clicks)
1. Go to sheets.google.com and create a blank spreadsheet named "Inovegen Submissions".
2. Click Extensions > Apps Script.
3. Delete the sample code. Open apps-script/Code.gs from this folder, copy everything, paste it in, click Save.
4. Click Deploy > New deployment. Click the gear icon > Web app.
   - Execute as: Me
   - Who has access: Anyone
   Click Deploy and approve the permissions (Advanced > Go to project > Allow).
5. Copy the "Web app URL" it shows.
6. Open js/main.js and paste it between the quotes:  sheetUrl: "PASTE_URL_HERE",
Applications go to the tab "Internship Applications"; contact messages go to "Inquiries".
Each new submission also emails inovegenoffical@gmail.com.
To get a CSV: in the Sheet, File > Download > Comma Separated Values (.csv).
If you ever change Code.gs: Deploy > Manage deployments > Edit > New version > Deploy.

STEP 2 - DEPLOY WITH VERCEL (no commands)
1. Create a GitHub repository named inovegen-website.
2. Click "uploading an existing file", drag in the CONTENTS of this folder, click Commit changes.
3. On vercel.com sign in with GitHub, click Add New > Project, choose the repository, click Deploy.
To update later: edit the file on GitHub; Vercel redeploys automatically.

PREVIEW LOCALLY
Open the folder in VS Code and use Live Server on index.html.
