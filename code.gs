function listGooglePhotoFiles(){
  
  // GUIDE: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
  
  // Accesses the master spreadsheet.
  var database = DriveApp.getFilesByName("Google Photos Deletion Verifier").next();
  var spreadsheets = SpreadsheetApp.open(database);
  
  // Activates the "Uploaded" sheet and copies the information into an array.
  var uploadedSh = spreadsheets.getSheetByName("Uploaded");
  uploadedSh.activate();
  uploadedSh.clear();
  
  // Obtains list of folders with given name at the top.
  var foldername = "GooglePhotos";
  var google_photos_folders = DriveApp.getFoldersByName(foldername);
  var google_photos_folder = google_photos_folders.next();
  var gp_years = google_photos_folder.getFolders();
  
  // Outputs the names of files into "Google Photos" sheet
  var file;
  var filename;
  var fullname;
  var filenumber;
  var fulldate;
  var month;
  var year;
  var size;
  var name;
  var minFileNum = 2342;
  var maxFileNum = 3040;
  var minMonth = 9; 
  var maxMonth = 9;
  var targYear = 2018;
  while(gp_years.hasNext()){
    year_folder = gp_years.next();
    name = year_folder.getName();
    year_photos = year_folder.getFiles();
    if (name == targYear){
      while(year_photos.hasNext()){
        file = year_photos.next();
        filename = file.getName();
        fulldate = file.getDateCreated();
        month = fulldate.getMonth()+1;
        date = fulldate.getUTCDate();
        year = fulldate.getUTCFullYear();
        if (minMonth <= month && month <= maxMonth){
             if (year = targYear){
               uploadedSh.appendRow([filename,fulldate]);
             }
        }
      }
    }
  }
}

function listFauxUploads() {
  
  // Accesses the master spreadsheet.
  var database = DriveApp.getFilesByName("Google Photos Deletion Verifier").next();
  var spreadsheets = SpreadsheetApp.open(database);
  
  // Activates the "Uploaded" sheet and copies the information into an array.
  var uploadedSh = spreadsheets.getSheetByName("Uploaded");
  uploadedSh.activate();
  var uploadedVals = uploadedSh.getDataRange().getValues();
  var uploadedArr = new Array;
  for (i in uploadedVals) {
     uploadedArr.push(uploadedVals[i].toString());
  }
   
  // Activates the "Pending Deletions" sheet and copies the information into an array.
  var pendingDeletionsSh = spreadsheets.getSheetByName("Pending Deletions");
  pendingDeletionsSh.activate();
  var pendingDeletionVals = pendingDeletionsSh.getDataRange().getValues();
  var pendingDeletionArr = new Array;
  for (i in pendingDeletionVals) {
     pendingDeletionArr.push(pendingDeletionVals[i].toString());
  }
  
  // Activates the "Faux Uploads" sheet an
  var fauxUploadSh = spreadsheets.getSheetByName("Faux Uploads");
  fauxUploadSh.activate();
  fauxUploadSh.clear();
  
  var upload_file;
  var upload;
  var filename;
  var link;
  var row; 
  var wasUploaded;
  var notFound;
  var repository;
  var j;
  
   // Determines which files were not uploaded onto Google Photos
   for (i in pendingDeletionArr){
     notFound = true;
     filename = pendingDeletionArr[i].slice(0,-4);
     j = 0;
     while (j < uploadedArr.length && notFound){
         upload_file = uploadedArr[j];
         upload = upload_file.slice(0,8);
         if (filename == upload){
           notFound = false;
         }
         //fauxUploadSh.appendRow([filename,upload,i,notFound,j]);
         j++;
      }
    
     // If file was not found in the uploaded repository, then outputs it to the spreadsheet.
     if(notFound){
       fauxUploadSh.appendRow([pendingDeletionArr[i]]);
     }
    }
}
    


