function listUploads(){
  
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

  // Obtain targeted year folder  
  var targYear = 2018;
  var targFolder;
  if (targYear){
    targFolder = google_photos_folder.getFoldersByName(targYear);
  } else {    
    targFolder = google_photos_folder.getFolders();
  }
  
  // Activates the "Pending Deletions" sheet and copies the information into an array.
  var pendingDeletionsSh = spreadsheets.getSheetByName("Pending Deletions");
  pendingDeletionsSh.activate();
  var pendingDeletionVals = pendingDeletionsSh.getDataRange().getValues();
  var pendingDeletionArr = new Array;
  for (i in pendingDeletionVals) {
     pendingDeletionArr.push(pendingDeletionVals[i].toString());
  }
  
  // Activates the "Faux Uploads" sheet
  var fauxUploadSh = spreadsheets.getSheetByName("Faux Uploads");
  fauxUploadSh.activate();
  fauxUploadSh.clear();
  
  // Activates the "Uploaded" sheet
  var uploadedSh = spreadsheets.getSheetByName("Uploaded");
  uploadedSh.activate();
  uploadedSh.clear();
 
  var folder;
  var files; // FileIterator
  var size;
  var fauxUploads = new Array;
  while(targFolder.hasNext()){
    folder = targFolder.next();
    for (i in pendingDeletionArr){
      filename = pendingDeletionArr[i];
      files = folder.getFilesByName(filename);
      if(files.hasNext()){
        size = files.next().getSize();
        uploadedSh.appendRow([filename, size]);
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
     filename = pendingDeletionArr[i];
     j = 0;
     while (j < uploadedArr.length && notFound){
         upload_file = uploadedArr[j];
         upload = upload_file;
         if (filename == upload){
           notFound = false;
         }
         //fauxUploadSh.appendRow([filename,upload,i,notFound,j]);
         j++;
      }
     Logger.log(filename);
    
     // If file was not found in the uploaded repository, then outputs it to the spreadsheet.
     if(notFound){
       fauxUploadSh.appendRow([pendingDeletionArr[i]]);
     }
    }
}


