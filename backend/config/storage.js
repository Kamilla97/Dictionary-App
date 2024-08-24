const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage with credentials
const storage = new Storage({
    keyFilename: 'dictionary-storage.json', //TOBE   in backend folder
    projectId: 'dictionary-433920', 
});

// Name of the bucket you created
const bucketName = 'dictionarry_mp3_files';
const bucket = storage.bucket(bucketName);

module.exports = {
    bucket,
};
